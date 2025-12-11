from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.subscription_order import SubscriptionOrder
from datetime import date, timedelta

router = APIRouter(prefix="/subscriptions", tags=["Subscriptions"])

@router.post("/create")
def create_subscription(user_id: int, item_id: int, quantity: float, frequency: str, db: Session = Depends(get_db)):

    next_date = date.today()

    if frequency == "daily":
        next_date += timedelta(days=1)
    elif frequency == "weekly":
        next_date += timedelta(days=7)
    elif frequency == "monthly":
        next_date = next_date.replace(month=next_date.month + 1)

    sub = SubscriptionOrder(
        user_id=user_id,
        item_id=item_id,
        quantity=quantity,
        next_delivery_date=str(next_date)
    )
    db.add(sub)
    db.commit()

    return {"message": "Subscription created", "next_date": next_date}

@router.get("/by-user")
def list_user_subscriptions(user_id: int, db: Session = Depends(get_db)):
    return db.query(SubscriptionOrder).filter(SubscriptionOrder.user_id == user_id).all()

