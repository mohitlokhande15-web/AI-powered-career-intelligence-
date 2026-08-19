from typing import Optional, List, Dict, Any
from pydantic import BaseModel, EmailStr


# ---------- Auth ----------

class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserOut(BaseModel):
    id: int
    name: str
    email: str
    role: str
    class Config:
        from_attributes = True


# ---------- Profile ----------

class ProfileData(BaseModel):
    id: Optional[int] = None
    name: str
    email: str

    phone: Optional[str] = None
    location: Optional[str] = None

    career_stage: Optional[str] = None
    target_role: Optional[str] = None
    experience: Optional[str] = None
    career_interest: Optional[str] = None

    github_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    portfolio_url: Optional[str] = None

    skills: Optional[str] = None
    certifications: Optional[str] = None

    bio: Optional[str] = None
    career_goal: Optional[str] = None


class ProfileUpdate(BaseModel):
    phone: Optional[str] = None
    location: Optional[str] = None
    career_stage: Optional[str] = None
    target_role: Optional[str] = None
    experience: Optional[str] = None
    career_interest: Optional[str] = None
    github_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    portfolio_url: Optional[str] = None
    skills: Optional[str] = None
    certifications: Optional[str] = None
    bio: Optional[str] = None
    career_goal: Optional[str] = None
    name: Optional[str] = None


class ProfileCompletion(BaseModel):
    profile_completion: int
    completed_fields: int
    total_fields: int


# ---------- Resume / ATS ----------

class EducationEntry(BaseModel):
    id: str
    degree: str = ""
    institution: str = ""
    location: Optional[str] = None
    start_year: str = ""
    end_year: str = ""
    cgpa: Optional[str] = None
    percentage: Optional[str] = None


class ExperienceEntry(BaseModel):
    id: str
    role: str = ""
    company: str = ""
    location: Optional[str] = None
    start_date: str = ""
    end_date: str = ""
    is_internship: bool = False
    bullets: List[str] = []


class ProjectEntry(BaseModel):
    id: str
    title: str = ""
    description: str = ""
    tech_stack: List[str] = []
    link: Optional[str] = None


class CertificationEntry(BaseModel):
    id: str
    title: str = ""
    issuer: str = ""
    year: Optional[str] = None


class EducationEntry(BaseModel):
    id: str
    degree: str = ""
    institution: str = ""
    location: Optional[str] = None
    start_year: str = ""
    end_year: str = ""
    cgpa: Optional[str] = None
    percentage: Optional[str] = None


class ExperienceEntry(BaseModel):
    id: str
    role: str = ""
    company: str = ""
    location: Optional[str] = None
    start_date: str = ""
    end_date: str = ""
    is_internship: bool = False
    bullets: List[str] = []


class ProjectEntry(BaseModel):
    id: str
    title: str = ""
    description: str = ""
    tech_stack: List[str] = []
    link: Optional[str] = None


class CertificationEntry(BaseModel):
    id: str
    title: str = ""
    issuer: str = ""
    year: Optional[str] = None


class ResumeParsed(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None
    portfolio_url: Optional[str] = None
    summary: Optional[str] = None
    skills: List[str] = []
    education: List[EducationEntry] = []
    experience: List[ExperienceEntry] = []
    projects: List[ProjectEntry] = []
    certifications: List[CertificationEntry] = []
    sections_found: List[str] = []
    word_count: Optional[int] = None


class ATSBreakdown(BaseModel):
    keyword_match: float
    formatting: float
    section_completeness: float
    readability: float
    contact_info: float


class ResumeOut(BaseModel):
    id: int
    filename: str
    raw_text: Optional[str] = None
    parsed_data: Optional[Dict[str, Any]] = None
    ats_score: Optional[float] = None
    ats_breakdown: Optional[Dict[str, Any]] = None
    uploaded_at: str
    summary: Optional[str] = None
    skills_lacking: List[str] = []
    improvements: List[str] = []

    class Config:
        from_attributes = True


class ResumeUpdateRequest(BaseModel):
    parsed_data: ResumeParsed


class ResumeScorePreviewRequest(BaseModel):
    parsed_data: ResumeParsed
    job_description: Optional[str] = None


class ResumeScorePreviewOut(BaseModel):
    ats_score: float
    breakdown: Dict[str, Any]
# ---------- Job Matching ----------

class JobAnalysisRequest(BaseModel):
    resume_id: Optional[int] = None
    job_title: Optional[str] = None
    job_description: str


class JobAnalysisOut(BaseModel):
    id: int
    job_title: Optional[str]
    match_score: float
    matched_skills: List[str]
    missing_skills: List[str]
    ats_score: Optional[float] = None
    recommended_courses: List[Dict[str, str]] = []
    resume_improvements: List[str] = []

    class Config:
        from_attributes = True


# ---------- Skill Gap / Recommendations ----------

class SkillGapResponse(BaseModel):
    target_role: str
    have_skills: List[str]
    missing_skills: List[str]
    recommended_courses: List[Dict[str, str]]


class HealthResponse(BaseModel):
    status: str
    version: str

class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str


class RefreshResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class CareerMetric(BaseModel):
    label: str
    score: float


class CareerListItem(BaseModel):
    title: str
    description: str
    severity: Optional[str] = None


class RoadmapItem(BaseModel):
    number: str
    period: str
    title: str
    description: str


class RecommendedRole(BaseModel):
    role: str
    match_score: float
    matched_skills: List[str]
    missing_skills: List[str]


class CareerOverviewOut(BaseModel):
    score: float
    headline: str
    summary: str
    profile_stage: str
    metrics: List[CareerMetric]
    strengths: List[CareerListItem]
    limitations: List[CareerListItem]
    roadmap: List[RoadmapItem]
    recommended_roles: List[RecommendedRole]

class JobRecommendationOut(BaseModel):
    id: str
    initials: str
    company: str
    title: str
    location: str
    workMode: str
    match: int
    skills: List[str]
    missingSkills: List[str]
    description: str
    url: Optional[str] = None

class ResumeUpdateRequest(BaseModel):
    parsed_data: ResumeParsed


class ResumeScorePreviewRequest(BaseModel):
    raw_text: str
    job_description: Optional[str] = None


class ResumeScorePreviewOut(BaseModel):
    ats_score: float
    breakdown: Dict[str, Any]

class ResumeUpdateRequest(BaseModel):
    parsed_data: ResumeParsed
    filename: Optional[str] = None

class ForgotPasswordRequest(BaseModel):
    email: str

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

class ForgotPasswordRequest(BaseModel):
    email: str

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str