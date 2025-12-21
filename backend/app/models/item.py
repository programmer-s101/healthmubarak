from sqlalchemy import Column, Integer, String, Float, Boolean, Date
from app.database import Base

class Item(Base):
    __tablename__ = "items"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)

    # PRICE IS BASE PRICE (IMPORTANT)
    price = Column(Float, nullable=False, default=0.0)

    unit = Column(String, default="pcs")  # kg, g, litre, pcs

    # 🔽 NEW QUANTITY CONFIG (OPTIONAL, NON-BREAKING)
    base_quantity = Column(Float, nullable=True)
    min_quantity = Column(Float, nullable=True)
    max_quantity = Column(Float, nullable=True)
    step_size = Column(Float, nullable=True)

    in_stock = Column(Boolean, default=True)
    is_preorder = Column(Boolean, default=False)
    availability_date = Column(Date, nullable=True)
    created_at = Column(Date)

   # ✅ IMAGE PATH (NEW)
    image_path = Column(String, nullable=True)