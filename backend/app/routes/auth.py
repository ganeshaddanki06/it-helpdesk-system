from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.database import get_db
from app.models.user import User
from app.models.enums import UserRole
from app.schemas.auth import UserCreate, UserLogin, UserResponse, Token, UserListResponse
from app.auth.security import verify_password, get_password_hash, create_access_token
from app.auth.dependencies import get_current_active_user, require_admin

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new standard user account"
)
@router.post("/register/", response_model=UserResponse, status_code=status.HTTP_201_CREATED, include_in_schema=False)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.username == user_in.username.strip().lower()).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already taken. Please choose another."
        )
    if db.query(User).filter(User.email == user_in.email.strip().lower()).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email address is already registered."
        )

    db_user = User(
        username=user_in.username.strip().lower(),
        email=user_in.email.strip().lower(),
        full_name=user_in.full_name.strip(),
        hashed_password=get_password_hash(user_in.password),
        role=UserRole.USER.value,
        is_active=True,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


@router.post(
    "/login",
    response_model=Token,
    status_code=status.HTTP_200_OK,
    summary="Authenticate user and obtain JWT token"
)
@router.post("/login/", response_model=Token, status_code=status.HTTP_200_OK, include_in_schema=False)
def login(login_data: UserLogin, db: Session = Depends(get_db)):
    identifier = login_data.username_or_email.strip().lower()
    user = db.query(User).filter(or_(User.username == identifier, User.email == identifier)).first()

    if not user or not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username/email or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is deactivated. Please contact an administrator."
        )

    access_token = create_access_token(data={"sub": user.username, "role": user.role})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user,
    }


@router.get(
    "/me",
    response_model=UserResponse,
    status_code=status.HTTP_200_OK,
    summary="Get authenticated user profile"
)
@router.get("/me/", response_model=UserResponse, status_code=status.HTTP_200_OK, include_in_schema=False)
def get_me(current_user: User = Depends(get_current_active_user)):
    return current_user


@router.post(
    "/logout",
    status_code=status.HTTP_200_OK,
    summary="Logout user session"
)
@router.post("/logout/", status_code=status.HTTP_200_OK, include_in_schema=False)
def logout(current_user: User = Depends(get_current_active_user)):
    return {"status": "success", "message": "Successfully logged out."}


@router.get(
    "/users",
    response_model=UserListResponse,
    status_code=status.HTTP_200_OK,
    summary="Get all system users (Admin only)"
)
@router.get("/users/", response_model=UserListResponse, status_code=status.HTTP_200_OK, include_in_schema=False)
def get_all_users(db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    users = db.query(User).order_by(User.created_at.desc()).all()
    total = len(users)
    admin_count = sum(1 for u in users if u.role == UserRole.ADMIN.value)
    technician_count = sum(1 for u in users if u.role == UserRole.TECHNICIAN.value)
    user_count = sum(1 for u in users if u.role == UserRole.USER.value)

    return {
        "users": users,
        "total": total,
        "admin_count": admin_count,
        "technician_count": technician_count,
        "user_count": user_count,
    }