from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app import models, schemas, auth as auth_utils
from app.ai_modules import skill_gap, career_engine
import re

router = APIRouter(prefix="/api/career", tags=["career"])


@router.get("/skill-gap", response_model=schemas.SkillGapResponse)
def get_skill_gap(
    target_role: str = Query(..., description="e.g. 'Frontend Developer'"),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth_utils.get_current_user),
):
    profile = (
        db.query(models.Profile)
        .filter(models.Profile.user_id == current_user.id)
        .first()
    )
    have_skills = []
    if profile and profile.skills:
        have_skills = [s.strip() for s in profile.skills.split(",") if s.strip()]

    latest_resume = (
        db.query(models.Resume)
        .filter(models.Resume.user_id == current_user.id)
        .order_by(models.Resume.uploaded_at.desc())
        .first()
    )
    if latest_resume and latest_resume.parsed_data:
        have_skills += latest_resume.parsed_data.get("skills", [])

    result = skill_gap.analyze_skill_gap(target_role, have_skills)
    return schemas.SkillGapResponse(**result)


@router.get("/overview", response_model=schemas.CareerOverviewOut)
def get_career_overview(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth_utils.get_current_user),
):
    profile = (
        db.query(models.Profile)
        .filter(models.Profile.user_id == current_user.id)
        .first()
    )
    latest_resume = (
        db.query(models.Resume)
        .filter(models.Resume.user_id == current_user.id)
        .order_by(models.Resume.uploaded_at.desc())
        .first()
    )

    parsed_data = latest_resume.parsed_data if latest_resume else None
    profile_skills = profile.skills if profile else None

    result = career_engine.build_career_overview(parsed_data, profile_skills)
    return schemas.CareerOverviewOut(**result)



SALARY_BASE_BY_ROLE = {
    "software engineer": 650000, "frontend developer": 550000, "backend developer": 600000,
    "full stack developer": 620000, "data analyst": 500000, "data scientist": 800000,
    "data engineer": 750000, "devops engineer": 700000, "product manager": 900000,
    "ux designer": 550000, "qa engineer": 450000, "mobile developer": 600000,
    "machine learning engineer": 900000,
}
DEFAULT_BASE_SALARY = 500000

LOCATION_MULTIPLIER = {
    "bangalore": 1.15, "bengaluru": 1.15, "mumbai": 1.1, "delhi": 1.05, "gurgaon": 1.1,
    "pune": 1.0, "hyderabad": 1.05, "chennai": 0.95, "remote": 1.0,
}
DEFAULT_LOCATION_MULTIPLIER = 0.9


@router.get("/salary-estimate")
def salary_estimate(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth_utils.get_current_user),
):
    profile = db.query(models.Profile).filter(models.Profile.user_id == current_user.id).first()

    role_key = (profile.target_role or "").strip().lower() if profile else ""
    base = next((v for k, v in SALARY_BASE_BY_ROLE.items() if k in role_key), DEFAULT_BASE_SALARY)

    exp_str = (profile.experience or "0") if profile else "0"
    exp_years = 0.0
    match = re.search(r"(\d+(\.\d+)?)", exp_str)
    if match:
        exp_years = float(match.group(1))
    exp_multiplier = 1 + min(exp_years, 15) * 0.06

    location_key = (profile.location or "").strip().lower() if profile else ""
    loc_multiplier = next(
        (v for k, v in LOCATION_MULTIPLIER.items() if k in location_key),
        DEFAULT_LOCATION_MULTIPLIER,
    )

    estimated_mid = round(base * exp_multiplier * loc_multiplier, -3)
    low = round(estimated_mid * 0.85, -3)
    high = round(estimated_mid * 1.2, -3)

    return {
        "role": profile.target_role if profile and profile.target_role else "General",
        "location": profile.location if profile and profile.location else "India (avg)",
        "experience_years": exp_years,
        "low": int(low),
        "mid": int(estimated_mid),
        "high": int(high),
        "currency": "INR",
        "disclaimer": "Rough estimate based on role, experience, and location — not sourced from real-time market data.",
    }