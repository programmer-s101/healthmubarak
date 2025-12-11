from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import auth, items, orders, payments, subscriptions, delivery
from app.routers import auth  # <- ensure this path matches where you created routers/auth.py
from app.routers import user
from app.routers import owner
from app.routers import delivery
from app.routes import owner_stats
from app.routes import delivery_stats, delivery_orders
from app.routers import owner_items



app = FastAPI()

app.include_router(auth.router)
app.include_router(items.router)
app.include_router(orders.router)
app.include_router(payments.router)
app.include_router(subscriptions.router)
app.include_router(delivery.router)
app.include_router(user.router)
app.include_router(owner.router)
app.include_router(delivery.router)
app.include_router(owner_stats.router)
app.include_router(delivery_stats.router)
app.include_router(delivery_orders.router)
app.include_router(owner_items.router)



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
