from dotenv import load_dotenv
import os

load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

# ✅ CREATE APP FIRST
app = FastAPI(title="Health Mubarak API")

# ✅ NOW import DB & models
from app.database import engine, Base
from app.models.user import User  # import ALL models

# ✅ NOW startup hook works
@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)

# ---------------- ROUTERS ----------------
from app.api import (
    auth,
    items,
    orders,
    payments,
    subscriptions,
    delivery,
    owner,
    ledger,
    owner_orders,
    owner_delivery,
)
from app.routers import owner_items

app.include_router(auth.router)
app.include_router(items.router)
app.include_router(orders.router)
app.include_router(payments.router)
app.include_router(subscriptions.router)
app.include_router(delivery.router)
app.include_router(owner.router)
app.include_router(ledger.router)
app.include_router(owner_orders.router)
app.include_router(owner_delivery.router)
app.include_router(owner_items.router)

# ---------------- CORS ----------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------- HEALTH ----------------
@app.get("/ping")
def ping():
    return {"status": "ok"}

# ---------------- STATIC ----------------
app.mount(
    "/uploads",
    StaticFiles(directory="uploads"),
    name="uploads",
)
