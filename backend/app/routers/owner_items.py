from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.auth.deps import role_required
from app.models.item import Item

router = APIRouter(prefix="/owner/items", tags=["Owner Items"])

# List all items
@router.get("/")
def list_items(db: Session = Depends(get_db), user = Depends(role_required("owner"))):
    items = db.query(Item).all()
    return items

# Add new item
@router.post("/")
def create_item(name: str, price: float, unit: str = "pcs", is_preorder: bool = False, in_stock: bool = True, db: Session = Depends(get_db), user = Depends(role_required("owner"))):
    item = Item(name=name, price=price, unit=unit, is_preorder=is_preorder, in_stock=in_stock)
    db.add(item)
    db.commit()
    db.refresh(item)
    return item

# Update an item
@router.put("/{item_id}")
def update_item(item_id: int, name: str = None, price: float = None, unit: str = None, is_preorder: bool = None, in_stock: bool = None, db: Session = Depends(get_db), user = Depends(role_required("owner"))):
    item = db.query(Item).filter(Item.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    if name is not None: item.name = name
    if price is not None: item.price = price
    if unit is not None: item.unit = unit
    if is_preorder is not None: item.is_preorder = is_preorder
    if in_stock is not None: item.in_stock = in_stock
    db.commit()
    db.refresh(item)
    return item

# Soft delete (or hard delete)
@router.delete("/{item_id}")
def delete_item(item_id: int, db: Session = Depends(get_db), user = Depends(role_required("owner"))):
    item = db.query(Item).filter(Item.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    db.delete(item)
    db.commit()
    return {"message": "Item deleted"}

# Toggle stock quickly
@router.patch("/{item_id}/stock")
def toggle_stock(item_id: int, in_stock: bool, db: Session = Depends(get_db), user = Depends(role_required("owner"))):
    item = db.query(Item).filter(Item.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    item.in_stock = in_stock
    db.commit()
    db.refresh(item)
    return item
