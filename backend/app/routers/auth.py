from fastapi import APIRouter, Depends, HTTPException, Response, Request, status
from sqlalchemy.orm import Session

from app.database import get_db
from app import models, schemas, auth as auth_utils

router = APIRouter(prefix="/api/auth", tags=["auth"])

REFRESH_COOKIE_NAME = "refresh_token"


def _set_refresh_cookie(response: Response, token: str):
    response.set_cookie(
        key=REFRESH_COOKIE_NAME,
        value=token,
        httponly=True,
        secure=False,       # set True in production (requires HTTPS)
        samesite="lax",
        max_age=60 * 60 * 24 * 30,  # 30 days, keep in sync with settings
        path="/api/auth",   # cookie only sent to auth endpoints
    )


@router.post("/register", response_model=schemas.TokenResponse)
def register(payload: schemas.RegisterRequest, response: Response, db: Session = Depends(get_db)):
    existing = db.query(models.User).filter(models.User.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user = models.User(
        name=payload.name,
        email=payload.email,
        hashed_password=auth_utils.hash_password(payload.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    db.add(models.Profile(user_id=user.id))
    db.commit()

    access_token = auth_utils.create_access_token({"sub": str(user.id)})
    refresh_token = auth_utils.create_refresh_token({"sub": str(user.id)})
    _set_refresh_cookie(response, refresh_token)
    return schemas.TokenResponse(access_token=access_token)


@router.post("/login", response_model=schemas.TokenResponse)
def login(payload: schemas.LoginRequest, response: Response, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == payload.email).first()
    if not user or not auth_utils.verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials"
        )
    access_token = auth_utils.create_access_token({"sub": str(user.id)})
    refresh_token = auth_utils.create_refresh_token({"sub": str(user.id)})
    _set_refresh_cookie(response, refresh_token)
    return schemas.TokenResponse(access_token=access_token)


@router.post("/refresh", response_model=schemas.RefreshResponse)
def refresh(request: Request, db: Session = Depends(get_db)):
    token = request.cookies.get(REFRESH_COOKIE_NAME)
    if not token:
        raise HTTPException(status_code=401, detail="No refresh token")

    user_id = auth_utils.decode_refresh_token(token)
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    access_token = auth_utils.create_access_token({"sub": str(user.id)})
    return schemas.RefreshResponse(access_token=access_token)


@router.post("/logout")
def logout(response: Response):
    response.delete_cookie(key=REFRESH_COOKIE_NAME, path="/api/auth")
    return {"message": "Logged out"}


@router.post("/change-password")
def change_password(
    payload: schemas.ChangePasswordRequest,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth_utils.get_current_user),
):
    if not auth_utils.verify_password(payload.current_password, current_user.hashed_password):
        raise HTTPException(status_code=400, detail="Current password is incorrect")

    if len(payload.new_password) < 6:
        raise HTTPException(status_code=400, detail="New password must be at least 6 characters")

    current_user.hashed_password = auth_utils.hash_password(payload.new_password)
    db.commit()
    return {"message": "Password updated successfully"}


@router.get("/me", response_model=schemas.UserOut)
def me(current_user: models.User = Depends(auth_utils.get_current_user)):
    return current_user