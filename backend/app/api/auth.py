import os
from dotenv import load_dotenv

load_dotenv()   # ✅ MUST be before os.getenv()


from fastapi import APIRouter, Depends, HTTPException, Response, Request
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from jose import jwt, JWTError
from datetime import datetime, timedelta

from app.database import get_db
from app.models.user import User

router = APIRouter(prefix="/auth", tags=["Auth"])

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM =os.getenv("ALGORITHM")
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# ---------------- UTILS ----------------
def hash_password(password: str):
    return pwd_context.hash(password)


def verify_password(plain, hashed):
    return pwd_context.verify(plain, hashed)


def create_token(user: User):
    payload = {
        "id": user.id,
        "role": user.role,
        "exp": datetime.utcnow() + timedelta(days=2)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def get_current_user(request: Request, db: Session):
    token = request.cookies.get("token")
    if not token:
        raise HTTPException(401, "Not logged in")

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user = db.query(User).get(payload["id"])
        if not user:
            raise HTTPException(401)
        return user
    except JWTError:
        raise HTTPException(401, "Invalid token")


# ---------------- USER SIGNUP ----------------
@router.post("/signup")
def user_signup(fullname: str, phone: str, password: str, db: Session = Depends(get_db)):
    if db.query(User).filter(User.phone == phone).first():
        raise HTTPException(400, "Phone already exists")

    user = User(
        fullname=fullname,
        phone=phone,
        password_hash=hash_password(password),
        role="user"
    )

    db.add(user)
    db.commit()

    return {"message": "User signup successful"}


# ---------------- LOGIN (ALL ROLES) ----------------
@router.post("/login")
def login(phone: str, password: str, response: Response, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.phone == phone).first()
    if not user:
        raise HTTPException(404, "User not found")

    if not verify_password(password, user.password_hash):
        raise HTTPException(400, "Wrong password")

    token = create_token(user)

    response.set_cookie(
        key="token",
        value=token,
        httponly=True,
        samesite="lax",
        max_age=60 * 60 * 48
    )

    return {
        "message": "Login successful",
        "role": user.role,
        "user_id": user.id,
        "access_token": token
    }



# ---------------- LOGOUT ----------------
@router.post("/logout")
def logout(response: Response):
    response.delete_cookie("token")
    return {"message": "Logged out"}


# ---------------- CURRENT USER ----------------
@router.get("/me")
def get_me(
    request: Request,
    db: Session = Depends(get_db)
):
    user = get_current_user(request, db)

    return {
        "id": user.id,
        "fullname": user.fullname,
        "phone": user.phone,
        "role": user.role
    }



