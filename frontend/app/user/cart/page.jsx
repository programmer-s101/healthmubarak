"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import Button from "../../components/ui/Button";


export default function CartPage() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(saved);
  }, []);

  const removeItem = (id) => {
    const updated = cart.filter((i) => i.id !== id);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

const placeOrder = async () => {
  const userId = Number(localStorage.getItem("user_id"));

  if (!userId) {
    alert("User not logged in");
    return;
  }

  try {
    for (const item of cart) {
      await api.post("/orders/create", null, {
        params: {
          user_id: userId,
          item_id: item.id,
          quantity: item.quantity,
        },
      });
    }

    alert("Order placed successfully");
    setCart([]);
    localStorage.removeItem("cart");
  } catch (err) {
    console.error("Order failed", err);
    alert("Failed to place order");
  }
};

  const total = cart.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );

  if (!cart.length) return <p className="p-6">Cart is empty</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Your Cart</h1>

      {cart.map((item) => (
        <div
          key={item.id}
          className="flex justify-between border p-3 mb-2"
        >
          <div>
            {item.name} × {item.quantity}
          </div>
          <div>
            ₹{item.price * item.quantity}
            <Button
              size="sm"
              variant="danger"
              className="ml-2"
              onClick={() => removeItem(item.id)}
            >
              Remove
            </Button>
          </div>
        </div>
      ))}

      <h2 className="mt-4 font-semibold">Total: ₹{total}</h2>

      <Button onClick={placeOrder} className="mt-4">
        Place Order
      </Button>
    </div>
  );
}
