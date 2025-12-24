from dotenv import load_dotenv
import os

load_dotenv()


from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import owner_orders
from app.api import owner_delivery
from app.routers import owner_items
from fastapi.staticfiles import StaticFiles


# Import API routers ONLY
from app.api import (
    auth,
    items,
    orders,
    payments,
    subscriptions,
    delivery,
    owner,
    ledger,
)

app = FastAPI(title="Health Mubarak API")

# Register routers
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

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/ping")
def ping():
    return {"status": "ok"}

app.mount(
    "/uploads",
    StaticFiles(directory="uploads"),
    name="uploads",
)