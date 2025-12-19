from pydantic import BaseModel
from datetime import datetime

class UserCreate(BaseModel):
    fullname: str
    phone: str
    password: str
    role: str = "user"  # default user

class UserLogin(BaseModel):
    phone: str
    password: str

class UserOut(BaseModel):
    id: int
    fullname: str
    phone: str
    role: str
    created_at: datetime | None = None

    class Config:
        from_attributes = True
