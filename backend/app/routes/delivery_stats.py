from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.order import Order
from sqlalchemy import func

router = APIRouter(prefix="/delivery/stats", tags=["Delivery Stats"])

@router.get("/{delivery_boy_id}")
def delivery_stats(delivery_boy_id: int, db: Session = Depends(get_db)):

    total_assigned = db.query(func.count(Order.id))\
        .filter(Order.delivery_boy_id == delivery_boy_id)\
        .scalar()

    completed = db.query(func.count(Order.id))\
        .filter(Order.delivery_boy_id == delivery_boy_id, Order.status == "delivered")\
        .scalar()

    active = db.query(func.count(Order.id))\
        .filter(Order.delivery_boy_id == delivery_boy_id, Order.status == "picked")\
        .scalar()

    total_earnings = db.query(func.sum(Order.delivery_charge))\
        .filter(Order.delivery_boy_id == delivery_boy_id)\
        .scalar() or 0

    return {
        "total_assigned": total_assigned,
        "completed": completed,
        "active": active,
        "total_earnings": total_earnings
    }
