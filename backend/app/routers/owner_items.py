from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.item import Item
from app.utils.image_upload import save_item_image

router = APIRouter(prefix="/owner/items", tags=["Owner Items"])


# 📄 LIST ALL ITEMS
@router.get("/")
def list_items(db: Session = Depends(get_db)):
    return db.query(Item).all()


# ➕ CREATE ITEM
@router.post("/")
def create_item(
    name: str = Form(...),
    price: float = Form(...),
    unit: str = Form("pcs"),
    is_preorder: bool = Form(False),
    in_stock: bool = Form(True),
    image: UploadFile | None = File(None),
    db: Session = Depends(get_db),
):
    image_url = None
    image_path = None

    if image:
        image_url, image_path = save_item_image(image)

    item = Item(
        name=name,
        price=price,
        unit=unit,
        is_preorder=is_preorder,
        in_stock=in_stock,
        image_url=image_url,
        image_path=image_path,
    )

    db.add(item)
    db.commit()
    db.refresh(item)
    return item


# ✏️ UPDATE ITEM
@router.put("/{item_id}")
def update_item(
    item_id: int,
    name: str = Form(...),
    price: float = Form(...),
    unit: str = Form(...),
    is_preorder: bool = Form(...),
    in_stock: bool = Form(...),
    image: UploadFile | None = File(None),
    db: Session = Depends(get_db),
):
    item = db.query(Item).filter(Item.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    if image:
        item.image_url, item.image_path = save_item_image(image)

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


# 🔄 TOGGLE STOCK
@router.patch("/{item_id}/stock")
def toggle_stock(item_id: int, db: Session = Depends(get_db)):
    item = db.query(Item).filter(Item.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    item.in_stock = not item.in_stock
    db.commit()
    db.refresh(item)
    return item
