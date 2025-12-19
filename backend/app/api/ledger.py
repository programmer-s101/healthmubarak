from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models.ledger import Ledger

router = APIRouter(prefix="/ledger", tags=["Ledger"])

@router.get("/balance")
def get_user_balance(user_id: int, db: Session = Depends(get_db)):
    debit = db.query(func.coalesce(func.sum(Ledger.amount), 0))\
        .filter(Ledger.user_id == user_id, Ledger.entry_type == "debit")\
        .scalar()

    credit = db.query(func.coalesce(func.sum(Ledger.amount), 0))\
        .filter(Ledger.user_id == user_id, Ledger.entry_type == "credit")\
        .scalar()

    balance = debit - credit

    return {
        "user_id": user_id,
        "total_debit": debit,
        "total_credit": credit,
        "balance": balance
    }
