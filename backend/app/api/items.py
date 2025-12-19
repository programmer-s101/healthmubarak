from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.item import Item

router = APIRouter(prefix="/items", tags=["Items"])


# ➕ ADD ITEM
@router.post("/add")
def add_item(
    name: str,
    price: float,
    unit: str = "pcs",
    is_preorder: bool = False,
    db: Session = Depends(get_db),
):
    item = Item(
        name=name,
        price=price,
        unit=unit,
        is_preorder=is_preorder,
        in_stock=True,
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return {"message": "Item added", "item": item}


# 📄 LIST ITEMS
@router.get("/list")
def list_items(db: Session = Depends(get_db)):
    return db.query(Item).all()


# 🔄 TOGGLE STOCK
@router.post("/toggle-stock")
def toggle_stock(item_id: int, db: Session = Depends(get_db)):
    item = db.query(Item).filter(Item.id == item_id).first()

    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    item.in_stock = not item.in_stock
    db.commit()
    db.refresh(item)

    return {
        "item_id": item.id,
        "in_stock": item.in_stock,
        "message": "Item stock status updated",
    }


# ✏️ UPDATE ITEM
@router.put("/update/{item_id}")
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
@router.delete("/delete/{item_id}")
def delete_item(item_id: int, db: Session = Depends(get_db)):
    item = db.query(Item).filter(Item.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    db.delete(item)
    db.commit()
    return {"message": "Item deleted"}
