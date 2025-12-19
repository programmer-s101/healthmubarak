from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.order import Order          # ✅ MISSING IMPORT
from app.models.delivery_boy import DeliveryBoy
from app.models.delivery_log import DeliveryLog

router = APIRouter(prefix="/delivery", tags=["Delivery"])


@router.post("/update")
def update_delivery(order_id: int, delivery_boy_id: int, db: Session = Depends(get_db)):

    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    boy = db.query(DeliveryBoy).filter(DeliveryBoy.id == delivery_boy_id).first()
    if not boy:
        raise HTTPException(status_code=404, detail="Delivery boy not found")

    # update order
    order.delivery_boy_id = boy.id
    order.delivery_status = "delivered"
    order.status = "completed"

    db.flush()  # ensure FK-safe state

    log = DeliveryLog(
        order_id=order.id,
        delivery_boy_id=boy.id,
        delivered=True
    )

    db.add(log)
    db.commit()

    return {
        "message": "Delivery updated successfully",
        "order_id": order.id,
        "delivery_boy_id": boy.id
    }
