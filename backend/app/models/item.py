from sqlalchemy import Column, Integer, String, Float, Boolean, Date
from app.database import Base

class Item(Base):
    __tablename__ = "items"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    unit = Column(String, default="pcs")  # kg, litre, pcs, g, ml
    price = Column(Float, nullable=False, default=0.0)
    in_stock = Column(Boolean, default=True)
    is_preorder = Column(Boolean, default=False)
    availability_date = Column(Date, nullable=True)
    created_at = Column(Date)
