from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta
from app.database import get_db
from app.models.user import User

router = APIRouter(prefix="/auth", tags=["Auth"])

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = "MYSECRET123"  # later move to env
ALGORITHM = "HS256"

def hash_password(password: str):
    return pwd_context.hash(password)

def verify_password(plain, hashed):
    return pwd_context.verify(plain, hashed)

def create_token(user_id: int):
    expire = datetime.utcnow() + timedelta(days=2)
    return jwt.encode({"id": user_id, "exp": expire}, SECRET_KEY, algorithm=ALGORITHM)


# -----------------------------
# SIGNUP
# -----------------------------
@router.post("/signup")
def signup(name: str, phone: str, password: str, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.phone == phone).first()
    if existing:
        raise HTTPException(400, "Phone already registered")

    user = User(
        name=name,
        phone=phone,
        address="",
        is_active=True
    )
    user.hashed_password = hash_password(password)

    db.add(user)
    db.commit()
    db.refresh(user)

    return {"message": "Signup successful"}


# -----------------------------
# LOGIN — SET JWT COOKIE (HTTPOnly)
# -----------------------------
@router.post("/login")
def login(phone: str, password: str, response: Response, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.phone == phone).first()
    if not user:
        raise HTTPException(404, "User not found")

    if not verify_password(password, user.hashed_password):
        raise HTTPException(400, "Incorrect password")

    token = create_token(user.id)

    # ⭐ SET HTTPONLY COOKIE
    response.set_cookie(
        key="token",
        value=token,
        httponly=True,
        samesite="lax",
        max_age=2 * 24 * 60 * 60,  # 2 days
    )

    return {"message": "Login successful", "user_id": user.id}
