from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.payment import Payment

router = APIRouter(prefix="/payments", tags=["Payments"])

@router.post("/add")
def add_payment(user_id: int, amount: float, method: str, db: Session = Depends(get_db)):
    pay = Payment(user_id=user_id, amount=amount, payment_method=method)
    db.add(pay)
    db.commit()
    return {"message": "Payment added"}

@router.get("/history")
def payment_history(user_id: int, db: Session = Depends(get_db)):
    return db.query(Payment).filter(Payment.user_id == user_id).all()

@router.get("/outstanding")
def outstanding_amount(user_id: int, db: Session = Depends(get_db)):
    payments = db.query(Payment).filter(Payment.user_id == user_id).all()

    total_paid = sum(p.amount for p in payments if p.status == "paid")

    # total orders cost
    from app.models.order import Order
    orders = db.query(Order).filter(Order.user_id == user_id).all()
    total_order_cost = sum(o.total_amount for o in orders)

    balance = total_order_cost - total_paid

    return {"balance": balance}

