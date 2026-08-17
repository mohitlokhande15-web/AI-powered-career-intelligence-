from typing import Any, Dict, List, Optional


def build_resume_insights(
    parsed_data: Optional[Dict[str, Any]],
    ats_score: Optional[float],
    profile_skills: Optional[str] = None,
) -> Dict[str, Any]:
    parsed = parsed_data or {}
    skills = [skill.strip() for skill in parsed.get("skills", []) if skill and str(skill).strip()]
    sections_found = [
        section.strip() for section in parsed.get("sections_found", []) if section and str(section).strip()
    ]
    experience_years = parsed.get("experience_years") or 0

    summary_parts: List[str] = []
    if experience_years:
        summary_parts.append(f"{int(experience_years)} years of experience")
    if skills:
        summary_parts.append(f"{len(skills)} core skills captured")
    if sections_found:
        summary_parts.append("sections include " + ", ".join(sections_found[:3]))

    if summary_parts:
        summary = "Resume highlights " + "; ".join(summary_parts) + "."
    else:
        summary = "Resume has been uploaded and is ready for review."

    profile_skill_list = [
        skill.strip().lower()
        for skill in (profile_skills or "").split(",")
        if skill and skill.strip()
    ]
    resume_skill_list = [skill.lower() for skill in skills]

    skills_lacking = [
        skill.title()
        for skill in profile_skill_list
        if skill not in resume_skill_list and skill
    ]

    improvements: List[str] = []
    if ats_score is not None and ats_score < 75:
        improvements.append("Improve ATS keyword alignment to raise the score.")
    if not sections_found:
        improvements.append("Add standard sections like Summary, Experience, and Education.")
    elif not any(section.lower() in {"summary", "experience", "education"} for section in sections_found):
        improvements.append("Structure the resume with clearer top-level sections.")
    if not skills:
        improvements.append("Add more concrete skills and technologies to strengthen the profile.")
    if not any(skill.lower() in {"python", "sql", "excel", "communication"} for skill in resume_skill_list):
        improvements.append("Include measurable technical or leadership keywords to improve recruiter matching.")

    return {
        "summary": summary,
        "skills_lacking": skills_lacking,
        "improvements": improvements,
    }
