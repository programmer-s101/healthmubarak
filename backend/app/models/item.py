from sqlalchemy import Column, Integer, String, Float, Boolean, Date, Text
from app.database import Base
from datetime import date


class Item(Base):
    __tablename__ = "items"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, nullable=False)
    unit = Column(String)
    price = Column(Float, nullable=False)

    is_preorder = Column(Boolean, default=False)
    in_stock = Column(Boolean, default=True)

    availability_date = Column(Date, nullable=True)
    created_at = Column(Date, default=date.today)

    # ✅ MATCH DATABASE COLUMN NAMES EXACTLY
    base_quantity = Column(Float, default=1)
    min_quantity = Column(Float, default=1)
    max_quantity = Column(Float, default=100)
    step_size = Column(Float, default=1)

    # ✅ IMAGE (DO NOT CHANGE)
    image_url = Column(Text, nullable=True)
    image_path = Column(Text, nullable=True)
