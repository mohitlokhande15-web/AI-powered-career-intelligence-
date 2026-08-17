"""
ATS Scoring Engine
------------------
Scores a parsed resume against general applicant-tracking-system best
practices, and optionally against a specific job description. Produces
an overall 0-100 score plus a breakdown across sub-categories so the
frontend can render the ATS score card and radar chart.
"""
from typing import Dict, Any, Optional, List

REQUIRED_SECTIONS = ["experience", "education", "skills"]
BONUS_SECTIONS = ["projects", "certifications", "summary"]


def score_resume(
    parsed: Dict[str, Any], raw_text: str, job_description: Optional[str] = None
) -> Dict[str, Any]:
    contact_info = _score_contact_info(parsed)
    section_completeness = _score_sections(parsed)
    formatting = _score_formatting(raw_text)
    readability = _score_readability(raw_text)
    keyword_match = (
        _score_keyword_match(parsed, job_description)
        if job_description
        else _score_keyword_baseline(parsed)
    )

    breakdown = {
        "keyword_match": round(keyword_match, 1),
        "formatting": round(formatting, 1),
        "section_completeness": round(section_completeness, 1),
        "readability": round(readability, 1),
        "contact_info": round(contact_info, 1),
    }

    overall = round(
        keyword_match * 0.35
        + section_completeness * 0.25
        + formatting * 0.15
        + readability * 0.15
        + contact_info * 0.10,
        1,
    )

    return {"ats_score": overall, "breakdown": breakdown}


def _score_contact_info(parsed: Dict[str, Any]) -> float:
    score = 0.0
    if parsed.get("email"):
        score += 50
    if parsed.get("phone"):
        score += 50
    return score


def _score_sections(parsed: Dict[str, Any]) -> float:
    found = set(parsed.get("sections_found", []))
    required_hit = sum(1 for s in REQUIRED_SECTIONS if s in found)
    bonus_hit = sum(1 for s in BONUS_SECTIONS if s in found)
    return min(
        100.0, (required_hit / len(REQUIRED_SECTIONS)) * 80 + bonus_hit * 6.7
    )


def _score_formatting(raw_text: str) -> float:
    word_count = len(raw_text.split())
    if word_count < 150:
        return 40.0
    if word_count > 1200:
        return 60.0
    return 90.0


def _score_readability(raw_text: str) -> float:
    sentences = max(raw_text.count("."), 1)
    words = max(len(raw_text.split()), 1)
    avg_sentence_len = words / sentences
    if avg_sentence_len <= 20:
        return 90.0
    if avg_sentence_len <= 30:
        return 70.0
    return 50.0


def _score_keyword_baseline(parsed: Dict[str, Any]) -> float:
    skill_count = len(parsed.get("skills", []))
    return min(100.0, skill_count * 8.0)


def _score_keyword_match(parsed: Dict[str, Any], job_description: str) -> float:
    jd_lower = job_description.lower()
    resume_skills = set(parsed.get("skills", []))
    if not resume_skills:
        return 0.0
    matched = [s for s in resume_skills if s in jd_lower]
    return min(100.0, (len(matched) / max(len(resume_skills), 1)) * 100)
