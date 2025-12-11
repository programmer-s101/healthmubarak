from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.auth.deps import role_required
from app.models.user import User
from app.models.order import Order

router = APIRouter(prefix="/owner", tags=["Owner"])


@router.get("/dashboard")
def owner_dashboard(user = Depends(role_required("owner")), db: Session = Depends(get_db)):
    total_users = db.query(User).count()
    total_orders = db.query(Order).count()
    unpaid = db.query(Order).filter(Order.payment_status != "paid").all()

    total_due = sum(o.price for o in unpaid)

    return {
        "total_users": total_users,
        "total_orders": total_orders,
        "total_due": total_due
    }
