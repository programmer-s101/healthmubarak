from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.auth.deps import role_required
from app.models.order import Order

router = APIRouter(prefix="/delivery", tags=["Delivery"])


@router.get("/today")
def today_deliveries(user = Depends(role_required("delivery")), db: Session = Depends(get_db)):
    orders = db.query(Order).filter(Order.delivery_status == "not_delivered").all()
    return orders


@router.post("/mark/{order_id}")
def mark_delivered(order_id: int, user = Depends(role_required("delivery")), db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id).first()
    order.delivery_status = "delivered"
    db.commit()
    return {"message": "Delivered"}


@router.get("/history")
def history(user = Depends(role_required("delivery")), db: Session = Depends(get_db)):
    orders = db.query(Order).filter(Order.delivery_status == "delivered").all()
    return orders
