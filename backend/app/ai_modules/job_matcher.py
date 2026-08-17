"""
Job Matcher
-----------
Compares a resume's extracted skills against a job description and
produces a match score plus matched/missing skill lists. Uses the same
skill taxonomy as resume_parser so scores stay consistent end-to-end.
"""
from typing import Dict, Any, List

from app.ai_modules.resume_parser import SKILL_KEYWORDS


def extract_jd_skills(job_description: str) -> List[str]:
    jd_lower = job_description.lower()
    return [kw for kw in SKILL_KEYWORDS if kw in jd_lower]


def match_job(resume_skills: List[str], job_description: str) -> Dict[str, Any]:
    resume_skill_set = {s.lower() for s in (resume_skills or [])}
    jd_skills = extract_jd_skills(job_description)
    jd_skill_set = set(jd_skills)

    matched = sorted(resume_skill_set & jd_skill_set)
    missing = sorted(jd_skill_set - resume_skill_set)

    match_score = round((len(matched) / len(jd_skill_set)) * 100, 1) if jd_skill_set else 0.0

    return {
        "match_score": match_score,
        "matched_skills": [s.title() for s in matched],
        "missing_skills": [s.title() for s in missing],
    }