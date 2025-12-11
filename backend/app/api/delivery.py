from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.delivery_log import DeliveryLog

router = APIRouter(prefix="/delivery", tags=["Delivery"])

@router.post("/update")
def update_delivery(order_id: int, delivery_boy_id: int, db: Session = Depends(get_db)):
    log = DeliveryLog(order_id=order_id, delivery_boy_id=delivery_boy_id, delivered=True)
    db.add(log)
    db.commit()
    return {"message": "Delivery updated"}
