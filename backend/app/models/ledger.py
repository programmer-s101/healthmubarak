from sqlalchemy import Column, Integer, String, Numeric, ForeignKey, DateTime
from sqlalchemy.sql import func
from app.database import Base

class Ledger(Base):
    __tablename__ = "ledger"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    entry_type = Column(String)  # debit / credit
    reference_type = Column(String)  # order / payment
    reference_id = Column(Integer)
    amount = Column(Numeric(10, 2))
    created_at = Column(DateTime, server_default=func.now())
