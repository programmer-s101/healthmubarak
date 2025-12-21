# app/utils/image_upload.py

import os
import uuid
from fastapi import UploadFile

UPLOAD_DIR = "uploads/items"

os.makedirs(UPLOAD_DIR, exist_ok=True)

def save_item_image(file: UploadFile) -> str:
    ext = file.filename.split(".")[-1]
    filename = f"{uuid.uuid4()}.{ext}"
    path = os.path.join(UPLOAD_DIR, filename)

    with open(path, "wb") as buffer:
        buffer.write(file.file.read())

    return f"/uploads/items/{filename}"
