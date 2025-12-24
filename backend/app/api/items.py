# app/routers/items.py

from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.item import Item
from app.utils.image_upload import save_item_image

router = APIRouter(prefix="/items", tags=["Items"])


# ➕ ADD ITEM
@router.post("/add")
def add_item(
    name: str = Form(...),
    price: float = Form(...),
    unit: str = Form("pcs"),
    is_preorder: bool = Form(False),

    # Frontend names
    base_qty: float = Form(1),
    min_qty: float = Form(1),
    max_qty: float = Form(10),
    step_qty: float = Form(1),

    image: UploadFile | None = File(None),
    db: Session = Depends(get_db),
):
    image_url = None
    if image:
        image_url = save_item_image(image)

    item = Item(
        name=name,
        price=price,
        unit=unit,
        is_preorder=is_preorder,
        in_stock=True,

        # 🔁 MAP TO DB COLUMNS
        base_quantity=base_qty,
        min_quantity=min_qty,
        max_quantity=max_qty,
        step_size=step_qty,

        image_url=image_url,
    )

    db.add(item)
    db.commit()
    db.refresh(item)
    return item


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


# ✏️ UPDATE ITEM (422 FIXED)
@router.put("/update/{item_id}")
def update_item(
    item_id: int,

    name: str = Form(...),
    price: float = Form(...),
    unit: str = Form(...),
    is_preorder: bool = Form(...),
    in_stock: bool = Form(...),

    # Frontend names
    base_qty: float = Form(...),
    min_qty: float = Form(...),
    max_qty: float = Form(...),
    step_qty: float = Form(...),

    image: UploadFile | None = File(None),
    db: Session = Depends(get_db),
):
    item = db.query(Item).filter(Item.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    # Basic fields
    item.name = name
    item.price = price
    item.unit = unit
    item.is_preorder = is_preorder
    item.in_stock = in_stock

    # 🔁 MAP TO DB COLUMNS
    item.base_quantity = base_qty
    item.min_quantity = min_qty
    item.max_quantity = max_qty
    item.step_size = step_qty

    # Optional image update
    if image:
        item.image_url = save_item_image(image)

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
