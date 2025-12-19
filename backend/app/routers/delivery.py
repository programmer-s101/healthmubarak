from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.auth.deps import role_required
from app.models.order import Order
from app.models.user import User

router = APIRouter(
    prefix="/delivery",
    tags=["Delivery"]
)

# ----------------------------------
# OWNER ASSIGNS DELIVERY BOY
# ----------------------------------
@router.post("/assign")
def assign_delivery(
    order_id: int,
    delivery_boy_id: int,
    db: Session = Depends(get_db),
    owner=Depends(role_required("owner"))
):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    delivery_boy = db.query(User).filter(
        User.id == delivery_boy_id,
        User.role == "delivery",
        User.is_active == True
    ).first()

    if not delivery_boy:
        raise HTTPException(status_code=404, detail="Delivery boy not found")

    order.delivery_boy_id = delivery_boy_id
    order.delivery_status = "assigned"
    order.status = "out_for_delivery"

    db.commit()

    return {
        "message": "Delivery assigned successfully",
        "order_id": order.id,
        "delivery_boy_id": delivery_boy_id
    }


# ----------------------------------
# DELIVERY BOY – VIEW HIS ORDERS
# ----------------------------------
@router.get("/my-orders")
def my_orders(
    db: Session = Depends(get_db),
    delivery=Depends(role_required("delivery"))
):
    return db.query(Order).filter(
        Order.delivery_boy_id == delivery.id,
        Order.delivery_status == "assigned"
    ).all()


# ----------------------------------
# DELIVERY BOY – MARK DELIVERED
# ----------------------------------
@router.post("/mark-delivered")
def mark_delivered(
    order_id: int,
    db: Session = Depends(get_db),
    delivery=Depends(role_required("delivery"))
):
    order = db.query(Order).filter(
        Order.id == order_id,
        Order.delivery_boy_id == delivery.id
    ).first()

    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    order.delivery_status = "delivered"
    order.status = "completed"

    db.commit()

    return {
        "message": "Order marked as delivered",
        "order_id": order.id
    }
