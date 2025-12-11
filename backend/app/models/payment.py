from sqlalchemy import Column, Integer, Float, String, ForeignKey
from app.database import Base

class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    amount = Column(Float)
    status = Column(String, default="pending")  # pending / paid / partial
    payment_method = Column(String)  # cash / upi
