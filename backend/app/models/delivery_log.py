from sqlalchemy import Column, Integer, String, ForeignKey, Boolean
from app.database import Base

class DeliveryLog(Base):
    __tablename__ = "delivery_logs"

    id = Column(Integer, primary_key=True)
    order_id = Column(Integer, ForeignKey("orders.id"))
    delivery_boy_id = Column(Integer, ForeignKey("delivery_boys.id"))
    delivered = Column(Boolean, default=False)
    delivered_at = Column(String)
