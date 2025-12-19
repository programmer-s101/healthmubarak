from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.item import Item

router = APIRouter(prefix="/owner/items", tags=["Owner Items"])


# 📄 LIST ALL ITEMS
@router.get("/")
def list_items(db: Session = Depends(get_db)):
    return db.query(Item).all()


# ➕ CREATE ITEM
@router.post("/")
def create_item(
    name: str,
    price: float,
    unit: str = "pcs",
    is_preorder: bool = False,
    in_stock: bool = True,
    db: Session = Depends(get_db),
):
    item = Item(
        name=name,
        price=price,
        unit=unit,
        is_preorder=is_preorder,
        in_stock=in_stock,
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


# ✏️ UPDATE ITEM (ALL FIELDS)
@router.put("/{item_id}")
def update_item(
    item_id: int,
    name: str,
    price: float,
    unit: str,
    is_preorder: bool,
    in_stock: bool,
    db: Session = Depends(get_db),
):
    item = db.query(Item).filter(Item.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    item.name = name
    item.price = price
    item.unit = unit
    item.is_preorder = is_preorder
    item.in_stock = in_stock

    db.commit()
    db.refresh(item)
    return item


# 🗑️ DELETE ITEM
@router.delete("/{item_id}")
def delete_item(item_id: int, db: Session = Depends(get_db)):
    item = db.query(Item).filter(Item.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    db.delete(item)
    db.commit()
    return {"message": "Item deleted"}


# 🔄 TOGGLE STOCK (OWNER)
@router.patch("/{item_id}/stock")
def toggle_stock(item_id: int, db: Session = Depends(get_db)):
    item = db.query(Item).filter(Item.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    item.in_stock = not item.in_stock
    db.commit()
    db.refresh(item)
    return item
