from sqlalchemy import Column, Integer, String, Float, ForeignKey
from app.database import Base

class SubscriptionOrder(Base):
    __tablename__ = "subscription_orders"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    item_id = Column(Integer, ForeignKey("items.id"))
    plan_id = Column(Integer, ForeignKey("subscription_plans.id"))
    quantity = Column(Float)
    next_delivery_date = Column(String)
