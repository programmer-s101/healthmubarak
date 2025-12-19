from fastapi import Depends, HTTPException, Request, status
from sqlalchemy.orm import Session
from jose import jwt

from app.database import get_db
from app.models.user import User

from app.api.auth import get_current_user

SECRET_KEY = "MYSECRET123"
ALGORITHM = "HS256"


def role_required(role: str):
    def wrapper(request: Request, db: Session = Depends(get_db)):
        token = request.cookies.get("token")
        if not token:
            raise HTTPException(401, "Not logged in")

        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user = db.query(User).get(payload["id"])

        if not user or user.role != role:
            raise HTTPException(403, "Access denied")

        return user

    return wrapper


def get_current_owner(current_user: User = Depends(get_current_user)):
    if current_user.role != "owner":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Owner access only"
        )
    return current_user