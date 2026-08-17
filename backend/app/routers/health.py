from fastapi import APIRouter

from app import schemas

router = APIRouter(prefix="/api", tags=["health"])


@router.get("/health", response_model=schemas.HealthResponse)
def health():
    return schemas.HealthResponse(status="ok", version="1.0.0")
