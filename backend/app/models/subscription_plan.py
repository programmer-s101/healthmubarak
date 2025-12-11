from sqlalchemy import Column, Integer, String, Float, Boolean
from app.database import Base

class SubscriptionPlan(Base):
    __tablename__ = "subscription_plans"

    id = Column(Integer, primary_key=True)
    name = Column(String)
    frequency = Column(String)  # daily / weekly / monthly
    is_active = Column(Boolean, default=True)
