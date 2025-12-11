from pydantic import BaseModel

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

    class Config:
        from_attributes = True
