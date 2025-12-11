from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.order import Order
from app.models.order_item import OrderItem
from sqlalchemy import func

router = APIRouter(prefix="/owner/stats", tags=["Owner Stats"])

@router.get("/")
def owner_stats(db: Session = Depends(get_db)):

    total_customers = Order.get_total_customers(db)
    active_orders = Order.get_active_orders(db)
    completed_orders = Order.get_completed_orders(db)
    total_earnings = Order.get_total_earnings(db)
    orders_per_day = Order.get_orders_per_day(db)

    # Top 5 items
    top_items = db.query(
        OrderItem.item_name,
        func.count(OrderItem.id).label("count")
    ).group_by(OrderItem.item_name)\
     .order_by(func.count(OrderItem.id).desc())\
     .limit(5).all()

    return {
        "total_customers": total_customers,
        "active_orders": active_orders,
        "completed_orders": completed_orders,
        "total_earnings": total_earnings,
        "orders_per_day": orders_per_day,
        "top_items": [{"name": t[0], "count": t[1]} for t in top_items]
    }
