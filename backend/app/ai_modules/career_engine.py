"""
Career Engine
-------------
Computes a career readiness score, strengths/limitations, a roadmap,
and top-matching career roles from a user's parsed resume + profile
skills. Rule-based — reuses the same skill taxonomy and role map as
skill_gap.py so scores stay consistent across the app.
"""
from typing import Dict, Any, List, Optional

from app.ai_modules.skill_gap import ROLE_SKILL_MAP


def _top_matching_roles(combined_skills: set, limit: int = 3) -> List[Dict[str, Any]]:
    role_scores = []
    for role, required in ROLE_SKILL_MAP.items():
        req_set = set(required)
        matched = combined_skills & req_set
        score = round((len(matched) / len(req_set)) * 100, 1) if req_set else 0.0
        role_scores.append({
            "role": role.title(),
            "match_score": score,
            "matched_skills": sorted(s.title() for s in matched),
            "missing_skills": sorted(s.title() for s in (req_set - combined_skills)),
        })
    role_scores.sort(key=lambda r: r["match_score"], reverse=True)
    return role_scores[:limit]


def _diagnosis(score: float, best: Optional[Dict[str, Any]]) -> Dict[str, str]:
    if score >= 75:
        headline = "Strong readiness. You're closely aligned with your target roles."
        stage = "Interview ready"
    elif score >= 50:
        headline = "Good potential. Your profile needs stronger professional evidence."
        stage = "Building professional evidence"
    else:
        headline = "Early stage. Focus on building core skills and experience first."
        stage = "Foundation building"

    role_name = best["role"] if best else "your target roles"
    summary = (
        f"Based on your current resume and skills, you show the strongest alignment "
        f"with {role_name}. Prioritize closing the highlighted skill gaps and adding "
        f"measurable project evidence to improve your readiness."
    )
    return {"headline": headline, "summary": summary, "stage": stage}


def build_career_overview(
    parsed_resume: Optional[Dict[str, Any]], profile_skills: Optional[str] = None
) -> Dict[str, Any]:
    parsed = parsed_resume or {}
    resume_skills = parsed.get("skills", []) or []
    experience_years = parsed.get("experience_years") or 0
    sections_found = parsed.get("sections_found", []) or []

    profile_skill_list = [
        s.strip().lower() for s in (profile_skills or "").split(",") if s and s.strip()
    ]
    combined_skills = {s.lower() for s in resume_skills} | set(profile_skill_list)

    top_roles = _top_matching_roles(combined_skills)
    best = top_roles[0] if top_roles else None

    skill_strength = min(100.0, len(combined_skills) * 7)
    experience_depth = min(100.0, experience_years * 15)
    section_completeness = min(100.0, len(sections_found) * 15)
    role_alignment = best["match_score"] if best else 0.0

    overall_score = round(
        skill_strength * 0.3
        + experience_depth * 0.2
        + section_completeness * 0.2
        + role_alignment * 0.3,
        1,
    )

    metrics = [
        {"label": "Skill Strength", "score": round(skill_strength, 1)},
        {"label": "Experience Depth", "score": round(experience_depth, 1)},
        {"label": "Resume Completeness", "score": round(section_completeness, 1)},
        {"label": "Target Role Alignment", "score": round(role_alignment, 1)},
    ]

    strengths: List[Dict[str, str]] = []
    if len(combined_skills) >= 5:
        strengths.append({
            "title": "Broad technical skill set",
            "description": f"Your profile lists {len(combined_skills)} relevant skills, giving you flexibility across roles.",
        })
    if experience_years >= 1:
        strengths.append({
            "title": "Demonstrated work experience",
            "description": f"Approximately {int(experience_years)} years of experience is reflected in your resume.",
        })
    if "projects" in sections_found:
        strengths.append({
            "title": "Project evidence present",
            "description": "Your resume includes a projects section, which recruiters use as proof of applied skill.",
        })
    if "certifications" in sections_found:
        strengths.append({
            "title": "Certifications listed",
            "description": "Certifications add credibility and act as ATS keyword anchors.",
        })
    if not strengths:
        strengths.append({
            "title": "Foundational profile",
            "description": "You've made a start — add more skills, experience, and sections to build stronger signals.",
        })

    limitations: List[Dict[str, str]] = []
    if best and best["missing_skills"]:
        limitations.append({
            "title": f"Skill gaps for {best['role']}",
            "description": "Missing: " + ", ".join(best["missing_skills"][:5]) + ".",
            "severity": "High" if len(best["missing_skills"]) > 3 else "Medium",
        })
    if experience_years < 1:
        limitations.append({
            "title": "Limited demonstrated experience",
            "description": "Add internships, freelance work, or project experience with measurable outcomes.",
            "severity": "Medium",
        })
    if "projects" not in sections_found:
        limitations.append({
            "title": "No visible project section",
            "description": "Add a projects section showing applied use of your skills.",
            "severity": "High",
        })
    if "certifications" not in sections_found:
        limitations.append({
            "title": "No certifications listed",
            "description": "Certifications strengthen ATS matching and credibility.",
            "severity": "Low",
        })
    if not limitations:
        limitations.append({
            "title": "Minor gaps only",
            "description": "Your profile is largely well-rounded; focus on deepening evidence in your strongest area.",
            "severity": "Low",
        })

    roadmap: List[Dict[str, str]] = []
    step = 1
    if best and best["missing_skills"]:
        roadmap.append({
            "number": str(step).zfill(2),
            "period": "0-4 weeks",
            "title": f"Close top skill gaps for {best['role']}",
            "description": "Focus on: " + ", ".join(best["missing_skills"][:3]) + " through targeted courses and small projects.",
        })
        step += 1
    if "projects" not in sections_found:
        roadmap.append({
            "number": str(step).zfill(2),
            "period": "1-6 weeks",
            "title": "Build and document a portfolio project",
            "description": "Ship one project that demonstrates your top skills end-to-end, and add it to your resume with measurable outcomes.",
        })
        step += 1
    roadmap.append({
        "number": str(step).zfill(2),
        "period": "4-8 weeks",
        "title": f"Target roles aligned to {best['role'] if best else 'your strongest skill set'}",
        "description": "Apply to roles matching your top skill cluster while continuing to build evidence for weaker areas.",
    })

    diagnosis = _diagnosis(overall_score, best)

    return {
        "score": overall_score,
        "headline": diagnosis["headline"],
        "summary": diagnosis["summary"],
        "profile_stage": diagnosis["stage"],
        "metrics": metrics,
        "strengths": strengths,
        "limitations": limitations,
        "roadmap": roadmap,
        "recommended_roles": top_roles,
    }