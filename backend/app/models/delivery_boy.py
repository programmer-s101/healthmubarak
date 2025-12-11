from sqlalchemy import Column, Integer, String, Boolean
from app.database import Base

class DeliveryBoy(Base):
    __tablename__ = "delivery_boys"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    phone = Column(String)
    is_active = Column(Boolean, default=True)
