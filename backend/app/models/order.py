from sqlalchemy import func, Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)

    # User who placed the order
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # Delivery boy assigned
    delivery_boy_id = Column(Integer, ForeignKey("delivery_boys.id"), nullable=True)

    # Order details
    status = Column(String, default="pending")  # pending, delivered, cancelled
    item_name = Column(String)
    quantity = Column(Integer)  # FIXED: should be integer
    price = Column(Float)
    total_price = Column(Float, default=0)  # ADDED because you used it
    type = Column(String)  # instant / daily / weekly / monthly
    payment_status = Column(String, default="pending")  # pending / partial / paid
    delivery_status = Column(String, default="not_delivered")

    # Timestamps (needed for daily stats)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    user = relationship("User")

    # ---------- STATS FUNCTIONS ----------
    @staticmethod
    def get_total_customers(db):
        return db.query(func.count(func.distinct(Order.user_id))).scalar()

    @staticmethod
    def get_active_orders(db):
        return db.query(func.count(Order.id)).filter(Order.status == "pending").scalar()

    @staticmethod
    def get_completed_orders(db):
        return db.query(func.count(Order.id)).filter(Order.status == "delivered").scalar()

    @staticmethod
    def get_total_earnings(db):
        return db.query(func.sum(Order.total_price)).scalar() or 0

    @staticmethod
    def get_orders_per_day(db):
        rows = (
            db.query(
                func.date(Order.created_at).label("day"),
                func.count(Order.id).label("count")
            )
            .group_by(func.date(Order.created_at))
            .all()
        )

        return [{"day": r.day, "count": r.count} for r in rows]
