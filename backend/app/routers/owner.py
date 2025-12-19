from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from passlib.context import CryptContext

from app.database import get_db
from app.auth.deps import role_required
from app.models.user import User
from app.models.order import Order
from app.models.ledger import Ledger

router = APIRouter(
    prefix="/owner",
    tags=["Owner"]
)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str):
    return pwd_context.hash(password)


# ----------------------------------
# OWNER DASHBOARD
# ----------------------------------
@router.get("/dashboard")
def owner_dashboard(
    owner=Depends(role_required("owner")),
    db: Session = Depends(get_db)
):
    total_users = db.query(User).count()
    total_orders = db.query(Order).count()

    pending_orders = db.query(Order).filter(
        Order.delivery_status != "delivered"
    ).count()

    delivered_orders = db.query(Order).filter(
        Order.delivery_status == "delivered"
    ).count()

    # Ledger is source of truth
    total_debit = db.query(
        func.coalesce(func.sum(Ledger.amount), 0)
    ).filter(Ledger.entry_type == "debit").scalar()

    total_credit = db.query(
        func.coalesce(func.sum(Ledger.amount), 0)
    ).filter(Ledger.entry_type == "credit").scalar()

    outstanding_amount = total_debit - total_credit

    return {
        "total_users": total_users,
        "total_orders": total_orders,
        "pending_orders": pending_orders,
        "delivered_orders": delivered_orders,
        "total_due": float(outstanding_amount)
    }


# ----------------------------------
# OWNER CREATES DELIVERY BOY
# ----------------------------------
@router.post("/add-delivery-boy")
def add_delivery_boy(
    fullname: str,
    phone: str,
    password: str,
    owner=Depends(role_required("owner")),
    db: Session = Depends(get_db)
):
    existing = db.query(User).filter(User.phone == phone).first()
    if existing:
        raise HTTPException(status_code=400, detail="Phone already exists")

    delivery_boy = User(
        fullname=fullname,
        phone=phone,
        password_hash=hash_password(password),
        role="delivery",
        is_active=True
    )

    db.add(delivery_boy)
    db.commit()

    return {
        "message": "Delivery boy created successfully",
        "delivery_boy_id": delivery_boy.id
    }
