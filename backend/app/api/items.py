from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.item import Item

router = APIRouter(prefix="/items", tags=["Items"])

@router.post("/add")
def add_item(name: str, price: float, unit: str, is_preorder: bool, db: Session = Depends(get_db)):
    item = Item(name=name, price=price, unit=unit, is_preorder=is_preorder)
    db.add(item)
    db.commit()
    db.refresh(item)
    return {"message": "Item added", "item": item}

@router.get("/list")
def list_items(db: Session = Depends(get_db)):
    return db.query(Item).all()

@router.post("/toggle-stock")
def toggle_stock(item_id: int, db: Session = Depends(get_db)):
    item = db.query(Item).filter(Item.id == item_id).first()
    item.is_available = not item.is_available
    db.commit()
    return {"message": "Stock updated", "status": item.is_available}
