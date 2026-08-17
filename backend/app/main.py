from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import Base, engine
from app.routers import auth, profile, resume, job_analysis, career, health, jobs, admin

from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse


Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Career AI Platform API",
    description="Backend for the AI-powered career intelligence platform: "
    "resume parsing, ATS scoring, job matching, and skill-gap analysis.",
    version="1.0.0",
)

origins = [o.strip() for o in settings.cors_origins.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(auth.router)
app.include_router(profile.router)
app.include_router(resume.router)
app.include_router(job_analysis.router)
app.include_router(career.router)
app.include_router(jobs.router)
app.include_router(admin.router)

@app.get("/")
def root():
    return {"message": "Career AI Platform API is running", "docs": "/docs"}


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    print("VALIDATION ERROR:", exc.errors())
    return JSONResponse(status_code=422, content={"detail": exc.errors()})