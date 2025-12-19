from fastapi import APIRouter, Depends, HTTPException
from fastapi import Request

from sqlalchemy.orm import Session

from app.database import get_db
from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.item import Item
from app.models.user import User
from app.models.ledger import Ledger
from app.auth.deps import get_current_user


router = APIRouter(prefix="/orders", tags=["Orders"])


@router.post("/create")
def create_order(
    user_id: int,
    item_id: int,
    quantity: int,
    db: Session = Depends(get_db)
):
    # 1️⃣ Check user exists
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # 2️⃣ Check item exists
    item = db.query(Item).filter(Item.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    if not item.in_stock:
        raise HTTPException(status_code=400, detail="Item out of stock")

    # 3️⃣ Calculate total price
    total_price = item.price * quantity

    # 4️⃣ Create order (MATCH DB COLUMNS)
    order = Order(
        user_id=user_id,
        item_name=item.name,
        quantity=quantity,
        price=item.price,
        type="instant",
        payment_status="pending",
        delivery_status="pending",
        status="created",
        total_price=total_price
    )
    db.add(order)
    db.commit()
    db.refresh(order)

    # 5️⃣ Create order item (optional but good)
    order_item = OrderItem(
        order_id=order.id,
        item_id=item_id,
        quantity=quantity,
        price=item.price
    )
    db.add(order_item)

    # 6️⃣ Ledger entry (DEBIT)
    ledger_entry = Ledger(
        user_id=user_id,
        entry_type="debit",
        amount=total_price,
        reference_type="order",
        reference_id=order.id
    )
    db.add(ledger_entry)

    db.commit()

    return {
        "message": "Order created successfully",
        "order_id": order.id,
        "total_price": total_price
    }

# ---------------- USER: LIST OWN ORDERS ----------------
@router.get("/my")
def get_my_orders(
    request: Request,
    db: Session = Depends(get_db)
):
    user = get_current_user(request, db)

    orders = (
        db.query(Order)
        .filter(Order.user_id == user.id)
        .order_by(Order.id.desc())
        .all()
    )

    return orders


# ---------------- USER: ORDER DETAILS ----------------
@router.get("/my/{order_id}")
def get_my_order_by_id(
    order_id: int,
    request: Request,
    db: Session = Depends(get_db)
):
    user = get_current_user(request, db)

    order = (
        db.query(Order)
        .filter(Order.id == order_id, Order.user_id == user.id)
        .first()
    )

    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    items = (
        db.query(OrderItem, Item)
        .join(Item, OrderItem.item_id == Item.id)
        .filter(OrderItem.order_id == order.id)
        .all()
    )

    return {
        "order": order,
        "items": [
            {
                "item_id": i.Item.id,
                "name": i.Item.name,
                "price": i.OrderItem.price,
                "quantity": i.OrderItem.quantity,
            }
            for i in items
        ]
    }
