from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app import models, schemas, auth as auth_utils

router = APIRouter(prefix="/api/profile", tags=["profile"])

TRACKED_FIELDS = [
    "phone", "location", "career_stage", "target_role", "experience",
    "career_interest", "github_url", "linkedin_url", "portfolio_url",
    "skills", "certifications", "bio", "career_goal",
]


def _get_or_create_profile(db: Session, user: models.User) -> models.Profile:
    profile = db.query(models.Profile).filter(models.Profile.user_id == user.id).first()
    if not profile:
        profile = models.Profile(user_id=user.id)
        db.add(profile)
        db.commit()
        db.refresh(profile)
    return profile


@router.get("", response_model=schemas.ProfileData)
def get_profile(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth_utils.get_current_user),
):
    profile = _get_or_create_profile(db, current_user)
    return _to_profile_data(current_user, profile)


@router.put("", response_model=schemas.ProfileData)
def update_profile(
    payload: schemas.ProfileUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth_utils.get_current_user),
):
    profile = _get_or_create_profile(db, current_user)

    data = payload.model_dump(exclude_unset=True)
    name = data.pop("name", None)
    if name:
        current_user.name = name

    for field, value in data.items():
        setattr(profile, field, value)

    db.commit()
    db.refresh(profile)
    db.refresh(current_user)
    return _to_profile_data(current_user, profile)


@router.get("/completion", response_model=schemas.ProfileCompletion)
def profile_completion(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth_utils.get_current_user),
):
    profile = _get_or_create_profile(db, current_user)
    completed = sum(1 for f in TRACKED_FIELDS if getattr(profile, f))
    total = len(TRACKED_FIELDS)
    pct = round((completed / total) * 100) if total else 0
    return schemas.ProfileCompletion(
        profile_completion=pct, completed_fields=completed, total_fields=total
    )


def _to_profile_data(user: models.User, profile: models.Profile) -> schemas.ProfileData:
    return schemas.ProfileData(
        id=profile.id,
        name=user.name,
        email=user.email,
        phone=profile.phone,
        location=profile.location,
        career_stage=profile.career_stage,
        target_role=profile.target_role,
        experience=profile.experience,
        career_interest=profile.career_interest,
        github_url=profile.github_url,
        linkedin_url=profile.linkedin_url,
        portfolio_url=profile.portfolio_url,
        skills=profile.skills,
        certifications=profile.certifications,
        bio=profile.bio,
        career_goal=profile.career_goal,
    )
