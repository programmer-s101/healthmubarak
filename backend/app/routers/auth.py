from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserLogin
from app.auth.utils import hash_password, verify_password
from app.auth.jwt_handler import create_token
from app.auth.deps import get_current_user

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/signup")
def signup(data: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.phone == data.phone).first()
    if existing:
        raise HTTPException(status_code=400, detail="Phone already exists")

    new_user = User(
        fullname=data.fullname,
        phone=data.phone,
        password_hash=hash_password(data.password),
        role=data.role
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "Signup successful"}


@router.post("/login")
def login(data: UserLogin, response: Response, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.phone == data.phone).first()
    if not user:
        raise HTTPException(status_code=400, detail="Invalid phone number")

    if not verify_password(data.password, user.password_hash):
        raise HTTPException(status_code=400, detail="Incorrect password")

    token = create_token({"id": user.id, "role": user.role})

    # set cookie (HTTPOnly) — frontend must call with credentials: include
    response.set_cookie(
        key="token",
        value=token,
        httponly=True,
        samesite="lax",
        max_age=7 * 24 * 60 * 60  # 7 days
    )

    return {"message": "Login successful", "role": user.role}

@router.get("/me")
def me(user = Depends(get_current_user), db: Session = Depends(get_db)):
    uid = user.get("id")
    db_user = db.query(User).filter(User.id == uid).first()
    if not db_user:
        raise HTTPException(404, "User not found")
    return {
        "id": db_user.id,
        "fullname": db_user.fullname,
        "phone": db_user.phone,
        "role": db_user.role
    }
