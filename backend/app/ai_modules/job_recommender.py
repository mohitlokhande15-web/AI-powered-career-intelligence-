"""
Job recommendations via the Adzuna API (Module 4).

Strategy:
- Build a search query from the candidate's top resume skills (+ optional target role)
- Query Adzuna's /jobs/{country}/search/1 endpoint
- Score each returned job against the candidate's skill set (keyword overlap
  against title + category + description, since Adzuna doesn't return a
  structured skills list)
- Filter by location if provided
- On any API failure (network, auth, rate limit, empty key), fall back to a small
  static list so the frontend never breaks
"""

import re
from typing import Dict, List, Optional

import httpx

from app.config import settings

ADZUNA_APP_ID = settings.adzuna_app_id
ADZUNA_APP_KEY = settings.adzuna_app_key
ADZUNA_COUNTRY = settings.adzuna_country or "in"
ADZUNA_BASE_URL = "https://api.adzuna.com/v1/api/jobs"

REQUEST_TIMEOUT = 8.0
MAX_RESULTS = 10

# Used only if the Adzuna call fails outright — keeps the frontend from breaking
FALLBACK_JOBS = [
    {
        "id": "fallback-1",
        "initials": "NS",
        "company": "Nova Systems",
        "title": "Junior Data Analyst",
        "location": "Bengaluru",
        "workMode": "Hybrid",
        "match": 0,
        "skills": ["Python", "Excel", "SQL"],
        "missingSkills": [],
        "description": "Analyse business data, identify trends, and support reporting and dashboard development.",
        "url": None,
    },
]


def _build_query(resume_skills: List[str], target_role: Optional[str] = None) -> str:
    """
    Adzuna's search works best with a short, natural phrase rather than a
    comma-dumped skill list. Prefer the target role if given; otherwise use
    the top 2-3 skills.
    """
    if target_role:
        return target_role
    top_skills = resume_skills[:3]
    return " ".join(top_skills) if top_skills else "analyst"


def _score_job(job_text: str, resume_skills: List[str]) -> Dict:
    """
    Keyword overlap between the candidate's skills and the job's title+category+description.
    Short skills (<=4 chars, e.g. "SQL", "R", "AI") use word-boundary matching to
    avoid false positives (e.g. "R" inside "Research"). Longer skills use substring
    matching so variations like "JavaScript/TS" or "Machine Learning Engineer"
    still count.
    """
    text_lower = job_text.lower()
    matched = []
    for skill in resume_skills:
        skill_lower = skill.lower()
        if len(skill_lower) <= 4:
            if re.search(rf"\b{re.escape(skill_lower)}\b", text_lower):
                matched.append(skill)
        else:
            if skill_lower in text_lower:
                matched.append(skill)

    missing = [s for s in resume_skills if s not in matched]
    match_pct = round((len(matched) / len(resume_skills)) * 100) if resume_skills else 0
    return {"matched": matched, "missing": missing, "match": match_pct}


def _initials(company: str) -> str:
    words = [w for w in re.split(r"\s+", company.strip()) if w]
    return "".join(w[0].upper() for w in words[:2]) if words else "??"


def fetch_job_recommendations(
    resume_skills: List[str],
    location: Optional[str] = None,
    target_role: Optional[str] = None,
    results_per_page: int = MAX_RESULTS,
) -> List[Dict]:
    if not ADZUNA_APP_ID or not ADZUNA_APP_KEY:
        return FALLBACK_JOBS

    query = _build_query(resume_skills, target_role)
    url = f"{ADZUNA_BASE_URL}/{ADZUNA_COUNTRY}/search/1"

    params = {
        "app_id": ADZUNA_APP_ID,
        "app_key": ADZUNA_APP_KEY,
        "what": query,
        "results_per_page": results_per_page,
        "content-type": "application/json",
    }
    if location:
        params["where"] = location

    try:
        response = httpx.get(url, params=params, timeout=REQUEST_TIMEOUT)
        response.raise_for_status()
        data = response.json()
    except (httpx.HTTPError, ValueError):
        return FALLBACK_JOBS

    results = data.get("results", [])
    if not results:
        return FALLBACK_JOBS

    jobs = []
    for item in results:
        title = item.get("title", "Untitled role")
        company = (item.get("company") or {}).get("display_name", "Unknown company")
        loc = (item.get("location") or {}).get("display_name", "Not specified")
        description = item.get("description", "")
        category = (item.get("category") or {}).get("label", "")
        job_text = f"{title} {category} {description}"

        scoring = _score_job(job_text, resume_skills)

        jobs.append({
            "id": str(item.get("id", "")),
            "initials": _initials(company),
            "company": company,
            "title": title,
            "location": loc,
            "workMode": "Not specified",  # Adzuna doesn't reliably expose this
            "match": scoring["match"],
            "skills": scoring["matched"],
            "missingSkills": scoring["missing"],
            "description": description[:400],
            "url": item.get("redirect_url"),
        })

    jobs.sort(key=lambda j: j["match"], reverse=True)
    return jobs