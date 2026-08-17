from typing import List, Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app import models, schemas, auth as auth_utils
from app.ai_modules import job_recommender

router = APIRouter(prefix="/api/jobs", tags=["jobs"])


def _latest_resume_skills(db: Session, user_id: int) -> List[str]:
    resume = (
        db.query(models.Resume)
        .filter(models.Resume.user_id == user_id)
        .order_by(models.Resume.uploaded_at.desc())
        .first()
    )
    if not resume or not resume.parsed_data:
        return []
    # adjust this key to match whatever resume_parser.parse_resume() actually names it
    return resume.parsed_data.get("skills", [])


@router.get("/recommendations", response_model=List[schemas.JobRecommendationOut])
def get_job_recommendations(
    location: Optional[str] = Query(None, description="e.g. Bengaluru, Mumbai"),
    target_role: Optional[str] = Query(None, description="e.g. 'Data Analyst'"),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth_utils.get_current_user),
):
    skills = _latest_resume_skills(db, current_user.id)
    jobs = job_recommender.fetch_job_recommendations(
        resume_skills=skills,
        location=location,
        target_role=target_role,
    )
    return jobs