import datetime as dt

from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    DateTime,
    ForeignKey,
    Float,
    JSON,
)
from sqlalchemy.orm import relationship

from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(50), default="user", nullable=False)
    created_at = Column(DateTime, default=dt.datetime.utcnow)

    profile = relationship(
        "Profile", back_populates="user", uselist=False, cascade="all, delete-orphan"
    )
    resumes = relationship("Resume", back_populates="user", cascade="all, delete-orphan")


class Profile(Base):
    __tablename__ = "profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)

    phone = Column(String(50), nullable=True)
    location = Column(String(255), nullable=True)

    career_stage = Column(String(100), nullable=True)
    target_role = Column(String(255), nullable=True)
    experience = Column(String(100), nullable=True)
    career_interest = Column(String(255), nullable=True)

    github_url = Column(String(255), nullable=True)
    linkedin_url = Column(String(255), nullable=True)
    portfolio_url = Column(String(255), nullable=True)

    skills = Column(Text, nullable=True)
    certifications = Column(Text, nullable=True)

    bio = Column(Text, nullable=True)
    career_goal = Column(Text, nullable=True)

    user = relationship("User", back_populates="profile")


class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    filename = Column(String(255), nullable=False)
    raw_text = Column(Text, nullable=True)
    parsed_data = Column(JSON, nullable=True)

    ats_score = Column(Float, nullable=True)
    ats_breakdown = Column(JSON, nullable=True)

    uploaded_at = Column(DateTime, default=dt.datetime.utcnow)

    user = relationship("User", back_populates="resumes")


class JobAnalysis(Base):
    __tablename__ = "job_analyses"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    resume_id = Column(Integer, ForeignKey("resumes.id"), nullable=True)

    job_title = Column(String(255), nullable=True)
    job_description = Column(Text, nullable=False)

    match_score = Column(Float, nullable=True)
    matched_skills = Column(JSON, nullable=True)
    missing_skills = Column(JSON, nullable=True)

    created_at = Column(DateTime, default=dt.datetime.utcnow)