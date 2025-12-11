from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.item import Item

router = APIRouter(prefix="/orders", tags=["Orders"])

@router.post("/create")
def create_order(user_id: int, item_id: int, quantity: float, db: Session = Depends(get_db)):
    item = db.query(Item).filter(Item.id == item_id).first()
    total_price = item.price * quantity

    order = Order(user_id=user_id, total_amount=total_price)
    db.add(order)
    db.commit()
    db.refresh(order)

    order_item = OrderItem(order_id=order.id, item_id=item_id, quantity=quantity, price=item.price)
    db.add(order_item)
    
    db.commit()
    return {"message": "Order created", "order_id": order.id}

@router.get("/by-user")
def get_user_orders(user_id: int, db: Session = Depends(get_db)):
    return db.query(Order).filter(Order.user_id == user_id).all()
