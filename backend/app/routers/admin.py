from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app import models, auth as auth_utils

router = APIRouter(prefix="/api/admin", tags=["admin"])


@router.get("/stats")
def get_stats(
    db: Session = Depends(get_db),
    _admin: models.User = Depends(auth_utils.get_current_admin),
):
    total_users = db.query(func.count(models.User.id)).scalar() or 0
    total_resumes = db.query(func.count(models.Resume.id)).scalar() or 0
    total_analyses = db.query(func.count(models.JobAnalysis.id)).scalar() or 0
    avg_ats = db.query(func.avg(models.Resume.ats_score)).scalar()
    avg_match = db.query(func.avg(models.JobAnalysis.match_score)).scalar()

    return {
        "total_users": total_users,
        "total_resumes": total_resumes,
        "total_analyses": total_analyses,
        "avg_ats_score": round(avg_ats, 1) if avg_ats else None,
        "avg_match_score": round(avg_match, 1) if avg_match else None,
    }


@router.get("/users")
def list_users(
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
    _admin: models.User = Depends(auth_utils.get_current_admin),
):
    users = (
        db.query(models.User)
        .order_by(models.User.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    result = []
    for u in users:
        resume_count = (
            db.query(func.count(models.Resume.id))
            .filter(models.Resume.user_id == u.id)
            .scalar()
            or 0
        )
        result.append({
            "id": u.id,
            "name": u.name,
            "email": u.email,
            "role": u.role,
            "created_at": u.created_at,
            "resume_count": resume_count,
        })
    return result


@router.get("/analyses")
def list_analyses(
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
    _admin: models.User = Depends(auth_utils.get_current_admin),
):
    analyses = (
        db.query(models.JobAnalysis)
        .order_by(models.JobAnalysis.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    result = []
    for a in analyses:
        user = db.query(models.User).filter(models.User.id == a.user_id).first()
        result.append({
            "id": a.id,
            "user_email": user.email if user else "unknown",
            "job_title": a.job_title,
            "match_score": a.match_score,
            "missing_skills": a.missing_skills,
            "created_at": a.created_at,
        })
    return result


@router.get("/resumes")
def list_resumes(
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
    _admin: models.User = Depends(auth_utils.get_current_admin),
):
    resumes = (
        db.query(models.Resume)
        .order_by(models.Resume.uploaded_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    result = []
    for r in resumes:
        user = db.query(models.User).filter(models.User.id == r.user_id).first()
        result.append({
            "id": r.id,
            "user_email": user.email if user else "unknown",
            "filename": r.filename,
            "ats_score": r.ats_score,
            "uploaded_at": r.uploaded_at,
        })
    return result