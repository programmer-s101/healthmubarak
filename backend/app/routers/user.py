from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.auth.deps import get_current_user
from app.models.user import User
from app.models.order import Order  # we will make this next

router = APIRouter(prefix="/user", tags=["User"])


@router.get("/profile")
def get_profile(user = Depends(get_current_user), db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.id == user["id"]).first()

    return {
        "id": db_user.id,
        "fullname": db_user.fullname,
        "phone": db_user.phone,
        "role": db_user.role
    }


@router.get("/orders")
def get_orders(user = Depends(get_current_user), db: Session = Depends(get_db)):
    orders = db.query(Order).filter(Order.user_id == user["id"]).all()

    total_due = sum(o.price for o in orders if o.payment_status != "paid")

    return {
        "total_due": total_due,
        "orders": orders
    }
