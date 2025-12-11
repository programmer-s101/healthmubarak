from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.order import Order

router = APIRouter(prefix="/delivery/orders", tags=["Delivery Orders"])

@router.get("/{delivery_boy_id}")
def orders(delivery_boy_id: int, db: Session = Depends(get_db)):
    orders = db.query(Order).filter(Order.delivery_boy_id == delivery_boy_id).all()
    return orders

@router.post("/complete/{order_id}")
def complete_order(order_id: int, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id).first()
    order.status = "delivered"
    db.commit()
    return {"status": "success"}

