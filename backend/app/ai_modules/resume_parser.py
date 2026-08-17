"""
Resume Parser
-------------
Extracts raw text from uploaded resume files (PDF / DOCX / TXT) and
parses it into structured fields: contact info, location, skills,
education entries, experience entries (incl. internships), projects,
certifications. Deterministic, rule-based — no external LLM dependency.
"""
import io
import re
from typing import Dict, Any, List, Optional
from uuid import uuid4
from datetime import datetime

import PyPDF2
import docx

SKILL_KEYWORDS = [
    "python", "java", "javascript", "typescript", "react", "next.js",
    "node.js", "fastapi", "django", "flask", "sql", "postgresql", "mysql",
    "mongodb", "aws", "azure", "gcp", "docker", "kubernetes", "git",
    "machine learning", "deep learning", "nlp", "data analysis", "pandas",
    "numpy", "tensorflow", "pytorch", "scikit-learn", "tableau", "power bi",
    "excel", "html", "css", "tailwind", "rest api", "graphql", "ci/cd",
    "agile", "scrum", "project management", "communication", "leadership",
]

EMAIL_RE = re.compile(r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}")
PHONE_RE = re.compile(r"(\+?\d{1,3}[\s-]?)?\d{10}")
LINKEDIN_RE = re.compile(r"(https?://)?(www\.)?linkedin\.com/\S+", re.I)
GITHUB_RE = re.compile(r"(https?://)?(www\.)?github\.com/\S+", re.I)
PORTFOLIO_RE = re.compile(r"(https?://)?(www\.)?[a-z0-9-]+\.(dev|me|io|com)(/\S*)?", re.I)

CGPA_RE = re.compile(r"(?:cgpa|gpa)\s*[:\-]?\s*(\d\.\d{1,2})\s*(?:/\s*(\d(?:\.\d)?))?", re.I)
PERCENT_RE = re.compile(r"(\d{2,3}(?:\.\d{1,2})?)\s*%")
YEAR_RANGE_RE = re.compile(
    r"(\b(?:19|20)\d{2}\b|present)\s*[-–—to]{1,4}\s*(\b(?:19|20)\d{2}\b|present)", re.I
)
SINGLE_YEAR_RE = re.compile(r"\b(?:19|20)\d{2}\b")

DEGREE_PATTERNS = [
    r"b\.?\s?tech", r"m\.?\s?tech", r"b\.?\s?e\b", r"m\.?\s?e\b",
    r"b\.?\s?sc", r"m\.?\s?sc", r"b\.?\s?a\b", r"m\.?\s?a\b",
    r"bachelor(?:'s)?(?:\s+of\s+\w+)?", r"master(?:'s)?(?:\s+of\s+\w+)?",
    r"mba", r"phd", r"ph\.d", r"diploma",
]
DEGREE_RE = re.compile("|".join(DEGREE_PATTERNS), re.I)

# Recognized section headers -> canonical section key
SECTION_HEADERS = {
    "education": ["education", "academic background", "academics"],
    "experience": ["experience", "work experience", "employment history",
                   "professional experience"],
    "internship": ["internship", "internships"],
    "projects": ["projects", "academic projects", "personal projects"],
    "certifications": ["certifications", "certificates", "licenses"],
    "skills": ["skills", "technical skills", "skills & tools", "core competencies"],
    "summary": ["summary", "objective", "profile", "about"],
}

LOCATION_HINTS = re.compile(
    r"\b([A-Z][a-zA-Z]+(?:\s[A-Z][a-zA-Z]+)?,\s?[A-Z]{2,}|"
    r"[A-Z][a-zA-Z]+,\s?[A-Z][a-zA-Z]+)\b"
)


def extract_text(filename: str, content: bytes) -> str:
    lower = filename.lower()
    if lower.endswith(".pdf"):
        reader = PyPDF2.PdfReader(io.BytesIO(content))
        return "\n".join(page.extract_text() or "" for page in reader.pages)
    if lower.endswith(".docx"):
        document = docx.Document(io.BytesIO(content))
        return "\n".join(p.text for p in document.paragraphs)
    return content.decode("utf-8", errors="ignore")


def _split_sections(lines: List[str]) -> Dict[str, List[str]]:
    """Group lines under the section header they fall beneath."""
    sections: Dict[str, List[str]] = {}
    current = "header"  # lines before the first recognized header
    sections[current] = []

    for line in lines:
        stripped = line.strip()
        matched_key = None
        low = stripped.lower().rstrip(":")
        for key, aliases in SECTION_HEADERS.items():
            if low in aliases or (len(low) < 40 and any(low == a for a in aliases)):
                matched_key = key
                break
        if matched_key:
            current = matched_key
            sections.setdefault(current, [])
            continue
        sections.setdefault(current, []).append(stripped)

    return sections


def _extract_education(block_lines: List[str]) -> List[Dict[str, Any]]:
    entries = []
    text_block = "\n".join(block_lines)
    # Split into chunks by blank-ish boundaries or degree mentions
    chunks = re.split(r"\n(?=[A-Z])", text_block) if text_block else []
    if not chunks:
        chunks = block_lines

    for chunk in chunks:
        if not chunk.strip():
            continue
        degree_match = DEGREE_RE.search(chunk)
        if not degree_match and not re.search(r"university|college|institute", chunk, re.I):
            continue

        year_match = YEAR_RANGE_RE.search(chunk)
        start_year, end_year = "", ""
        if year_match:
            start_year, end_year = year_match.group(1), year_match.group(2)
        else:
            single = SINGLE_YEAR_RE.findall(chunk)
            if single:
                end_year = single[-1]

        cgpa_match = CGPA_RE.search(chunk)
        percent_match = PERCENT_RE.search(chunk)

        inst_match = re.search(
            r"(?:at|,)\s*([A-Z][A-Za-z&.,\s]{3,60}(?:University|College|Institute))",
            chunk,
        )
        if not inst_match:
            inst_match = re.search(
                r"([A-Z][A-Za-z&.,\s]{3,60}(?:University|College|Institute))", chunk
            )

        entries.append({
            "id": str(uuid4())[:8],
            "degree": degree_match.group(0).strip() if degree_match else "",
            "institution": inst_match.group(1).strip() if inst_match else "",
            "location": None,
            "start_year": start_year,
            "end_year": end_year,
            "cgpa": cgpa_match.group(1) if cgpa_match else None,
            "percentage": percent_match.group(1) if percent_match else None,
        })

    return entries


def _extract_experience(block_lines: List[str], is_internship: bool = False) -> List[Dict[str, Any]]:
    entries = []
    text_block = "\n".join(block_lines)
    chunks = re.split(r"\n(?=[A-Z][A-Za-z\s]{2,50}(?:\||,|-|–|\n))", text_block) if text_block else []
    if not chunks:
        chunks = [text_block] if text_block else []

    for chunk in chunks:
        chunk = chunk.strip()
        if not chunk:
            continue
        lines = [l for l in chunk.splitlines() if l.strip()]
        if not lines:
            continue

        header_line = lines[0]
        year_match = YEAR_RANGE_RE.search(chunk)
        start_date, end_date = "", ""
        if year_match:
            start_date, end_date = year_match.group(1), year_match.group(2)

        role, company = "", ""
        if "|" in header_line:
            parts = [p.strip() for p in header_line.split("|")]
            role, company = (parts + [""])[:2]
        elif "," in header_line:
            parts = [p.strip() for p in header_line.split(",")]
            role, company = (parts + [""])[:2]
        elif " at " in header_line.lower():
            parts = re.split(r"\s+at\s+", header_line, flags=re.I)
            role, company = (parts + [""])[:2]
        else:
            role = header_line

        bullets = [
            l.lstrip("•-–* ").strip()
            for l in lines[1:]
            if l.strip() and not YEAR_RANGE_RE.fullmatch(l.strip())
        ]

        entries.append({
            "id": str(uuid4())[:8],
            "role": role.strip(),
            "company": company.strip(),
            "location": None,
            "start_date": start_date,
            "end_date": end_date,
            "is_internship": is_internship,
            "bullets": bullets,
        })

    return entries


def _extract_projects(block_lines: List[str]) -> List[Dict[str, Any]]:
    entries = []
    text_block = "\n".join(block_lines)
    chunks = re.split(r"\n(?=[A-Z])", text_block) if text_block else []

    for chunk in chunks:
        lines = [l for l in chunk.splitlines() if l.strip()]
        if not lines:
            continue
        title = lines[0].strip()
        description = " ".join(l.strip() for l in lines[1:])
        tech = [kw for kw in SKILL_KEYWORDS if kw in chunk.lower()]
        link_match = GITHUB_RE.search(chunk) or PORTFOLIO_RE.search(chunk)

        entries.append({
            "id": str(uuid4())[:8],
            "title": title,
            "description": description,
            "tech_stack": tech,
            "link": link_match.group(0) if link_match else None,
        })

    return entries


def _extract_certifications(block_lines: List[str]) -> List[Dict[str, Any]]:
    entries = []
    for line in block_lines:
        line = line.strip()
        if not line:
            continue
        year_match = SINGLE_YEAR_RE.search(line)
        title = re.sub(r"\(?\b(19|20)\d{2}\b\)?", "", line).strip(" -–,")
        entries.append({
            "id": str(uuid4())[:8],
            "title": title,
            "issuer": "",
            "year": year_match.group(0) if year_match else None,
        })
    return entries


def _compute_total_experience_years(experience: List[Dict[str, Any]]) -> float:
    """Sum durations across experience/internship entries using their
    start_date/end_date (bare years, e.g. '2022', '2023', or 'present')."""
    total_months = 0
    current_year = datetime.now().year

    for entry in experience:
        start_raw = (entry.get("start_date") or "").strip().lower()
        end_raw = (entry.get("end_date") or "").strip().lower()

        if not start_raw:
            continue

        try:
            start_year = int(start_raw)
        except ValueError:
            continue

        if end_raw in ("present", "current", "now", ""):
            end_year = current_year
        else:
            try:
                end_year = int(end_raw)
            except ValueError:
                end_year = start_year  # single-year entry, assume ~short stint

        months = (end_year - start_year) * 12
        if months == 0:
            months = 6  # same-year entry (e.g. summer internship) — assume ~6 months
        if 0 < months <= 600:
            total_months += months

    return round(total_months / 12, 1) if total_months else 0.0


def _fallback_experience_years_from_block(block_lines: List[str]) -> float:
    """
    Last-resort estimate: scan the raw experience/internship block text for
    ANY year mentions (ranges or bare years) and take earliest-to-latest span.
    Used only when structured entry extraction yields 0, so a messy layout
    (unusual headers, non-standard entry formatting) doesn't silently report
    zero years of experience.
    """
    text_block = "\n".join(block_lines)
    if not text_block.strip():
        return 0.0

    current_year = datetime.now().year
    years_found = set()

    for match in YEAR_RANGE_RE.finditer(text_block):
        for g in (match.group(1), match.group(2)):
            g = (g or "").strip().lower()
            if g in ("present", "current", "now"):
                years_found.add(current_year)
            elif g.isdigit():
                years_found.add(int(g))

    for match in SINGLE_YEAR_RE.finditer(text_block):
        years_found.add(int(match.group(0)))

    if len(years_found) < 2:
        return 0.0

    span_years = max(years_found) - min(years_found)
    return round(min(span_years, 40), 1)  # cap at 40 to avoid nonsense from stray years


def parse_resume(text: str) -> Dict[str, Any]:
    lower_text = text.lower()
    lines = [l for l in text.splitlines() if l.strip()]

    email_match = EMAIL_RE.search(text)
    phone_match = PHONE_RE.search(text)
    linkedin_match = LINKEDIN_RE.search(text)
    github_match = GITHUB_RE.search(text)
    location_match = LOCATION_HINTS.search(text[:500])  # look near the top

    skills_found = [kw for kw in SKILL_KEYWORDS if kw in lower_text]

    sections = _split_sections(lines)

    education = _extract_education(sections.get("education", []))
    experience = _extract_experience(sections.get("experience", []), is_internship=False)
    internships = _extract_experience(sections.get("internship", []), is_internship=True)
    experience.extend(internships)
    projects = _extract_projects(sections.get("projects", []))
    certifications = _extract_certifications(sections.get("certifications", []))

    summary_lines = sections.get("summary", [])
    summary = " ".join(summary_lines).strip() or None

    sections_found = [k for k in SECTION_HEADERS if sections.get(k)]

    name_guess = lines[0] if lines else None

    # Primary calculation from structured entries; if that yields 0
    # (e.g. section header wasn't recognized, or entry splitting failed
    # on an unusual resume layout), fall back to scanning the raw block
    # for any year mentions so experience isn't silently reported as 0.
    experience_years = _compute_total_experience_years(experience)
    if experience_years == 0.0:
        combined_block = sections.get("experience", []) + sections.get("internship", [])
        experience_years = _fallback_experience_years_from_block(combined_block)

    return {
        "name": name_guess,
        "email": email_match.group(0) if email_match else None,
        "phone": phone_match.group(0) if phone_match else None,
        "location": location_match.group(0) if location_match else None,
        "linkedin_url": linkedin_match.group(0) if linkedin_match else None,
        "github_url": github_match.group(0) if github_match else None,
        "portfolio_url": None,
        "summary": summary,
        "skills": skills_found,
        "education": education,
        "experience": experience,
        "experience_years": experience_years,
        "projects": projects,
        "certifications": certifications,
        "sections_found": sections_found,
        "word_count": len(text.split()),
    }


def reconstruct_text(parsed: Dict[str, Any]) -> str:
    """Build a plain-text resume from structured parsed_data — used after
    manual edits, since there's no original raw_text to re-parse."""
    lines = []
    if parsed.get("name"):
        lines.append(parsed["name"])
    contact_bits = [b for b in [parsed.get("email"), parsed.get("phone"), parsed.get("location")] if b]
    if contact_bits:
        lines.append(" | ".join(contact_bits))
    if parsed.get("summary"):
        lines += ["", "SUMMARY", parsed["summary"]]
    if parsed.get("skills"):
        lines += ["", "SKILLS", ", ".join(parsed["skills"])]
    if parsed.get("education"):
        lines += ["", "EDUCATION"]
        for e in parsed["education"]:
            lines.append(f"{e.get('degree','')} - {e.get('institution','')} ({e.get('start_year','')}-{e.get('end_year','')})")
            if e.get("cgpa"):
                lines.append(f"CGPA: {e['cgpa']}")
    if parsed.get("experience"):
        lines += ["", "EXPERIENCE"]
        for x in parsed["experience"]:
            label = "Internship" if x.get("is_internship") else "Experience"
            lines.append(f"{x.get('role','')} | {x.get('company','')} ({x.get('start_date','')}-{x.get('end_date','')}) [{label}]")
            for b in x.get("bullets", []):
                lines.append(f"- {b}")
    if parsed.get("projects"):
        lines += ["", "PROJECTS"]
        for p in parsed["projects"]:
            lines.append(p.get("title", ""))
            if p.get("description"):
                lines.append(p["description"])
    if parsed.get("certifications"):
        lines += ["", "CERTIFICATIONS"]
        for c in parsed["certifications"]:
            lines.append(f"{c.get('title','')} - {c.get('issuer','')} ({c.get('year','')})")
    return "\n".join(lines)