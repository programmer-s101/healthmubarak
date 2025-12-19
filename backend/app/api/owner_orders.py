from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.item import Item
from app.models.delivery_log import DeliveryLog

router = APIRouter(
    prefix="/owner/orders",
    tags=["Owner Orders"]
)

@router.get("/")
def get_all_orders(db: Session = Depends(get_db)):
    orders = db.query(Order).order_by(Order.id.desc()).all()

    response = []

    for order in orders:
        items = (
            db.query(OrderItem, Item)
            .join(Item, Item.id == OrderItem.item_id)
            .filter(OrderItem.order_id == order.id)
            .all()
        )

        delivery = (
            db.query(DeliveryLog)
            .filter(DeliveryLog.order_id == order.id)
            .first()
        )

        response.append({
            "order_id": order.id,
            "user_id": order.user_id,
            "total_price": order.total_price,
            "status": order.status,
            "created_at": order.created_at,
            "items": [
                {
                    "item_id": item.Item.id,
                    "name": item.Item.name,
                    "price": item.Item.price,
                    "quantity": item.OrderItem.quantity
                }
                for item in items
            ],
            "delivery": {
                "delivery_boy_id": delivery.delivery_boy_id,
                "delivered": delivery.delivered
            } if delivery else None
        })

    return response

@router.get("/{order_id}")
def get_order_by_id(order_id: int, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id).first()

    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    items = (
        db.query(OrderItem, Item)
        .join(Item, Item.id == OrderItem.item_id)
        .filter(OrderItem.order_id == order.id)
        .all()
    )

    delivery = (
        db.query(DeliveryLog)
        .filter(DeliveryLog.order_id == order.id)
        .first()
    )

    return {
        "order_id": order.id,
        "user_id": order.user_id,
        "total_price": order.total_price,
        "status": order.status,
        "created_at": order.created_at,
        "items": [
            {
                "item_id": item.Item.id,
                "name": item.Item.name,
                "price": item.Item.price,
                "quantity": item.OrderItem.quantity
            }
            for item in items
        ],
        "delivery": {
            "delivery_boy_id": delivery.delivery_boy_id,
            "delivered": delivery.delivered,
            "delivered_at": delivery.delivered_at
        } if delivery else None
    }

