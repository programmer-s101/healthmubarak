import os
import uuid
from fastapi import UploadFile

UPLOAD_DIR = "uploads/items"
os.makedirs(UPLOAD_DIR, exist_ok=True)


def save_item_image(image: UploadFile):
    ext = image.filename.split(".")[-1]
    filename = f"{uuid.uuid4()}.{ext}"
    file_path = os.path.join(UPLOAD_DIR, filename)

    with open(file_path, "wb") as f:
        f.write(image.file.read())

    image_url = f"/uploads/items/{filename}"
    return image_url, file_path
