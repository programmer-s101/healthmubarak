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

      alert("Order placed successfully 🌿");
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

  if (!cart.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-10 text-center">
          <h1 className="text-2xl font-bold text-gray-800">
            Your cart is empty
          </h1>
          <p className="text-gray-600 mt-2">
            Add some healthy products 🌿
          </p>

          <Button
            className="mt-6"
            onClick={() => (window.location.href = "/user/items")}
          >
            Browse Products
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-100 p-8">

  {/* HEADER */}
<div className="mb-6 flex items-start justify-between">
  <div>
    <button
      onClick={() => window.location.href = "/user/items"}
      className="text-sm text-green-700 hover:underline mb-2"
    >
      ← Continue Shopping
    </button>

    <h1 className="text-3xl font-bold text-gray-800">
      Your Cart
    </h1>

    <p className="text-sm text-gray-600 mt-1">
      Review your healthy picks 🌱
    </p>
  </div>
</div>


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* CART ITEMS */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition"
            >
              <div>
                <h2 className="font-semibold text-gray-800">
                  {item.name}
                </h2>
                <p className="text-sm text-gray-500">
                  Quantity: {item.quantity}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <span className="font-bold text-green-700">
                  ₹{item.price * item.quantity}
                </span>

                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => removeItem(item.id)}
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* SUMMARY */}
        <div className="bg-white rounded-2xl shadow-xl p-6 h-fit sticky top-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Order Summary
          </h2>

          <div className="flex justify-between text-gray-700 mb-2">
            <span>Items</span>
            <span>{cart.length}</span>
          </div>

          <div className="flex justify-between text-lg font-bold text-gray-900 border-t pt-3 mt-3">
            <span>Total</span>
            <span className="text-green-700">₹{total}</span>
          </div>

          <Button
            className="w-full mt-6"
            onClick={placeOrder}
          >
            Place Order
          </Button>
        </div>
      </div>
    </div>
  );
}
