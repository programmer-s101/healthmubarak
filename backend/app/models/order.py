from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    item_name = Column(String)
    quantity = Column(String)
    price = Column(Float)
    type = Column(String)  # instant / daily / weekly / monthly
    payment_status = Column(String, default="pending")  # pending / partial / paid
    delivery_status = Column(String, default="not_delivered")

    user = relationship("User")

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
        rows = db.query(
            func.date(Order.created_at).label("day"),
            func.count(Order.id).label("count")
        ).group_by(func.date(Order.created_at)).all()

        return [{"day": r.day, "count": r.count} for r in rows]