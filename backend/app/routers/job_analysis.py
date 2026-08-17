from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app import models, schemas, auth as auth_utils
from app.ai_modules import job_matcher, ats_engine, skill_gap, resume_insights

router = APIRouter(prefix="/api/job-analysis", tags=["job-analysis"])


@router.post("", response_model=schemas.JobAnalysisOut)
def analyze_job(
    payload: schemas.JobAnalysisRequest,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth_utils.get_current_user),
):
    resume_skills = []
    resume = None
    if payload.resume_id:
        resume = (
            db.query(models.Resume)
            .filter(models.Resume.id == payload.resume_id, models.Resume.user_id == current_user.id)
            .first()
        )
        if not resume:
            raise HTTPException(status_code=404, detail="Resume not found")
        resume_skills = (resume.parsed_data or {}).get("skills", [])
    else:
        resume = (
            db.query(models.Resume)
            .filter(models.Resume.user_id == current_user.id)
            .order_by(models.Resume.uploaded_at.desc())
            .first()
        )
        if resume:
            resume_skills = (resume.parsed_data or {}).get("skills", [])

    result = job_matcher.match_job(resume_skills, payload.job_description)

    ats_result = None
    improvements = []
    if resume:
        ats_result = ats_engine.score_resume(
            resume.parsed_data or {}, resume.raw_text or "", payload.job_description
        )
        insights = resume_insights.build_resume_insights(
            resume.parsed_data, ats_result["ats_score"]
        )
        improvements = insights["improvements"]

    if result["missing_skills"]:
        improvements.append(
            "Add these missing keywords to your resume: " + ", ".join(result["missing_skills"][:5])
        )

    courses = skill_gap.get_course_recommendations(result["missing_skills"])

    analysis = models.JobAnalysis(
        user_id=current_user.id,
        resume_id=resume.id if resume else None,
        job_title=payload.job_title,
        job_description=payload.job_description,
        match_score=result["match_score"],
        matched_skills=result["matched_skills"],
        missing_skills=result["missing_skills"],
    )
    db.add(analysis)
    db.commit()
    db.refresh(analysis)

    return schemas.JobAnalysisOut(
        id=analysis.id,
        job_title=analysis.job_title,
        match_score=analysis.match_score,
        matched_skills=analysis.matched_skills,
        missing_skills=analysis.missing_skills,
        ats_score=ats_result["ats_score"] if ats_result else None,
        recommended_courses=courses,
        resume_improvements=improvements,
    )