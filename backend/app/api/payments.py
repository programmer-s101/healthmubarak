from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.ledger import Ledger
from app.models.order import Order

router = APIRouter(prefix="/payments", tags=["Payments"])


# OWNER CONFIRMS CASH / UPI PAYMENT
@router.post("/confirm")
def confirm_payment(
    order_id: int,
    payment_mode: str,  # cash | upi
    db: Session = Depends(get_db)
):
    order = db.query(Order).filter(Order.id == order_id).first()

    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    if order.payment_status == "paid":
        raise HTTPException(status_code=400, detail="Payment already confirmed")

    # CREDIT entry in ledger
    credit_entry = Ledger(
        user_id=order.user_id,
        entry_type="credit",
        reference_type="payment",
        reference_id=order.id,
        amount=order.total_price
    )

    db.add(credit_entry)

    # Update order
    order.payment_status = "paid"
    order.type = payment_mode

    db.commit()

    return {
        "message": "Payment confirmed",
        "order_id": order.id,
        "mode": payment_mode
    }


# USER / OWNER CHECKS BALANCE
@router.get("/balance")
def get_balance(user_id: int, db: Session = Depends(get_db)):
    entries = db.query(Ledger).filter(Ledger.user_id == user_id).all()

    total_debit = sum(e.amount for e in entries if e.entry_type == "debit")
    total_credit = sum(e.amount for e in entries if e.entry_type == "credit")

    return {
        "total_debit": total_debit,
        "total_credit": total_credit,
        "balance": total_debit - total_credit
    }


# FULL LEDGER HISTORY
@router.get("/ledger")
def ledger_history(user_id: int, db: Session = Depends(get_db)):
    return db.query(Ledger)\
        .filter(Ledger.user_id == user_id)\
        .order_by(Ledger.created_at)\
        .all()
