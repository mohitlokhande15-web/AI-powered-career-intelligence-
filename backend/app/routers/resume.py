from typing import List
import datetime as dt

from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.database import get_db
from app import models, schemas, auth as auth_utils
from app.ai_modules import resume_parser, ats_engine, resume_insights

router = APIRouter(prefix="/api/resume", tags=["resume"])

ALLOWED_EXTENSIONS = (".pdf", ".docx", ".txt")


@router.post("/upload", response_model=schemas.ResumeOut)
async def upload_resume(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth_utils.get_current_user),
):
    if not file.filename.lower().endswith(ALLOWED_EXTENSIONS):
        raise HTTPException(
            status_code=400,
            detail="Unsupported file type. Upload a PDF, DOCX, or TXT resume.",
        )

    content = await file.read()
    raw_text = resume_parser.extract_text(file.filename, content)
    parsed = resume_parser.parse_resume(raw_text)
    scored = ats_engine.score_resume(parsed, raw_text)

    resume = models.Resume(
        user_id=current_user.id,
        filename=file.filename,
        raw_text=raw_text,
        parsed_data=parsed,
        ats_score=scored["ats_score"],
        ats_breakdown=scored["breakdown"],
    )
    db.add(resume)
    db.commit()
    db.refresh(resume)

    return _to_resume_out(resume, _get_profile_skills(db, current_user.id))


@router.post("/create", response_model=schemas.ResumeOut)
def create_blank_resume(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth_utils.get_current_user),
):
    blank_parsed = {
        "name": current_user.name, "email": current_user.email, "phone": None,
        "location": None, "linkedin_url": None, "github_url": None, "portfolio_url": None,
        "summary": None, "skills": [], "education": [], "experience": [],
        "projects": [], "certifications": [], "sections_found": [], "word_count": 0,
    }
    resume = models.Resume(
        user_id=current_user.id,
        filename=f"New Resume - {dt.datetime.utcnow().strftime('%Y-%m-%d')}.txt",
        raw_text="",
        parsed_data=blank_parsed,
        ats_score=0.0,
        ats_breakdown={"keyword_match": 0, "formatting": 0, "section_completeness": 0, "readability": 0, "contact_info": 0},
    )
    db.add(resume)
    db.commit()
    db.refresh(resume)
    return _to_resume_out(resume, _get_profile_skills(db, current_user.id))


@router.get("/history", response_model=List[schemas.ResumeOut])
def resume_history(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth_utils.get_current_user),
):
    resumes = (
        db.query(models.Resume)
        .filter(models.Resume.user_id == current_user.id)
        .order_by(models.Resume.uploaded_at.desc())
        .all()
    )
    return [_to_resume_out(r, _get_profile_skills(db, current_user.id)) for r in resumes]


@router.get("/{resume_id}", response_model=schemas.ResumeOut)
def get_resume(
    resume_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth_utils.get_current_user),
):
    resume = (
        db.query(models.Resume)
        .filter(models.Resume.id == resume_id, models.Resume.user_id == current_user.id)
        .first()
    )
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    return _to_resume_out(resume, _get_profile_skills(db, current_user.id))


@router.get("/{resume_id}/download")
def download_resume(
    resume_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth_utils.get_current_user),
):
    resume = (
        db.query(models.Resume)
        .filter(models.Resume.id == resume_id, models.Resume.user_id == current_user.id)
        .first()
    )
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")

    content = resume.raw_text or ""
    return StreamingResponse(
        iter([content.encode("utf-8")]),
        media_type="text/plain",
        headers={"Content-Disposition": f"attachment; filename={resume.filename}"},
    )


@router.delete("/{resume_id}")
def delete_resume(
    resume_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth_utils.get_current_user),
):
    resume = (
        db.query(models.Resume)
        .filter(models.Resume.id == resume_id, models.Resume.user_id == current_user.id)
        .first()
    )
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")

    db.query(models.JobAnalysis).filter(
        models.JobAnalysis.resume_id == resume_id
    ).delete()

    db.delete(resume)
    db.commit()
    return {"message": "Resume deleted successfully"}


@router.post("/{resume_id}/replace", response_model=schemas.ResumeOut)
async def replace_resume(
    resume_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth_utils.get_current_user),
):
    resume = (
        db.query(models.Resume)
        .filter(models.Resume.id == resume_id, models.Resume.user_id == current_user.id)
        .first()
    )
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")

    if not file.filename.lower().endswith(ALLOWED_EXTENSIONS):
        raise HTTPException(status_code=400, detail="Unsupported file type.")

    content = await file.read()
    raw_text = resume_parser.extract_text(file.filename, content)
    parsed = resume_parser.parse_resume(raw_text)
    scored = ats_engine.score_resume(parsed, raw_text)

    resume.filename = file.filename
    resume.raw_text = raw_text
    resume.parsed_data = parsed
    resume.ats_score = scored["ats_score"]
    resume.ats_breakdown = scored["breakdown"]

    db.commit()
    db.refresh(resume)
    return _to_resume_out(resume, _get_profile_skills(db, current_user.id))


@router.put("/{resume_id}", response_model=schemas.ResumeOut)
def update_resume(
    resume_id: int,
    payload: schemas.ResumeUpdateRequest,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth_utils.get_current_user),
):
    resume = (
        db.query(models.Resume)
        .filter(models.Resume.id == resume_id, models.Resume.user_id == current_user.id)
        .first()
    )
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")

    parsed = payload.parsed_data.model_dump()
    rebuilt_text = resume_parser.reconstruct_text(parsed)
    scored = ats_engine.score_resume(parsed, rebuilt_text)

    if payload.filename and payload.filename.strip():
        resume.filename = payload.filename.strip()

    resume.raw_text = rebuilt_text
    resume.parsed_data = parsed
    resume.ats_score = scored["ats_score"]
    resume.ats_breakdown = scored["breakdown"]

    db.commit()
    db.refresh(resume)
    return _to_resume_out(resume, _get_profile_skills(db, current_user.id))


@router.post("/{resume_id}/score-preview", response_model=schemas.ResumeScorePreviewOut)
def score_preview(
    resume_id: int,
    payload: schemas.ResumeScorePreviewRequest,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth_utils.get_current_user),
):
    resume = (
        db.query(models.Resume)
        .filter(models.Resume.id == resume_id, models.Resume.user_id == current_user.id)
        .first()
    )
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")

    parsed = payload.parsed_data.model_dump()
    rebuilt_text = resume_parser.reconstruct_text(parsed)
    scored = ats_engine.score_resume(parsed, rebuilt_text, payload.job_description)
    return schemas.ResumeScorePreviewOut(
        ats_score=scored["ats_score"], breakdown=scored["breakdown"]
    )


def _get_profile_skills(db: Session, user_id: int) -> str | None:
    profile = db.query(models.Profile).filter(models.Profile.user_id == user_id).first()
    return profile.skills if profile else None


def _to_resume_out(resume: models.Resume, profile_skills: str | None = None) -> schemas.ResumeOut:
    insights = resume_insights.build_resume_insights(
        resume.parsed_data,
        resume.ats_score,
        profile_skills,
    )
    return schemas.ResumeOut(
        id=resume.id,
        filename=resume.filename,
        parsed_data=resume.parsed_data,
        ats_score=resume.ats_score,
        ats_breakdown=resume.ats_breakdown,
        uploaded_at=resume.uploaded_at.isoformat(),
        summary=insights["summary"],
        skills_lacking=insights["skills_lacking"],
        raw_text=resume.raw_text,
        improvements=insights["improvements"],
    )