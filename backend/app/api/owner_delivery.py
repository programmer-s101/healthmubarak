from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime

from app.database import get_db
from app.models.order import Order
from app.models.delivery_log import DeliveryLog
from app.models.delivery_boy import DeliveryBoy

router = APIRouter(
    prefix="/owner/delivery",
    tags=["Owner Delivery"]
)

@router.post("/assign")
def assign_delivery(
    order_id: int,
    delivery_boy_id: int,
    db: Session = Depends(get_db)
):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(404, "Order not found")

    boy = db.query(DeliveryBoy).filter(DeliveryBoy.id == delivery_boy_id).first()
    if not boy:
        raise HTTPException(404, "Delivery boy not found")

    existing = (
        db.query(DeliveryLog)
        .filter(DeliveryLog.order_id == order_id)
        .first()
    )

    if existing:
        raise HTTPException(400, "Delivery already assigned")

    log = DeliveryLog(
        order_id=order_id,
        delivery_boy_id=delivery_boy_id,
        delivered=False
    )

    order.status = "out_for_delivery"

    db.add(log)
    db.commit()

    return {"message": "Delivery assigned"}

@router.post("/complete")
def complete_delivery(
    order_id: int,
    db: Session = Depends(get_db)
):
    log = (
        db.query(DeliveryLog)
        .filter(DeliveryLog.order_id == order_id)
        .first()
    )

    if not log:
        raise HTTPException(404, "Delivery not found")

    log.delivered = True
    log.delivered_at = datetime.utcnow()

    order = db.query(Order).filter(Order.id == order_id).first()
    order.status = "delivered"

    db.commit()

    return {"message": "Order marked as delivered"}

