from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from passlib.context import CryptContext

from app.database import get_db
from app.schemas.user import UserOut
from app.models.user import User

router = APIRouter(prefix="/owner", tags=["Owner Dashboard"])
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


@router.post("/add-delivery-boy")
def add_delivery_boy(
    fullname: str,
    phone: str,
    password: str,
    db: Session = Depends(get_db)
):
    if db.query(User).filter(User.phone == phone).first():
        raise HTTPException(status_code=400, detail="Phone already exists")

    boy = User(
        fullname=fullname,
        phone=phone,
        password_hash=pwd_context.hash(password),
        role="delivery"
    )

    db.add(boy)
    db.commit()

    return {"message": "Delivery boy added successfully"}


@router.get("/users", response_model=list[UserOut])
def get_all_users(db: Session = Depends(get_db)):
    return (
        db.query(User)
        .filter(User.role == "user")
        .order_by(User.id.desc())
        .all()
    )


@router.get("/users/{user_id}", response_model=UserOut)
def get_user_by_id(
    user_id: int,
    db: Session = Depends(get_db)
):
    user = (
        db.query(User)
        .filter(User.id == user_id, User.role == "user")
        .first()
    )

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user

@router.get("/delivery-boys")
def get_delivery_boys(db: Session = Depends(get_db)):
    return (
        db.query(User)
        .filter(User.role == "delivery")
        .order_by(User.id.desc())
        .all()
    )

