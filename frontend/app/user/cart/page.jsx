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

  const updateCart = (updatedCart) => {
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const removeItem = (id) => {
    updateCart(cart.filter((i) => i.id !== id));
  };

  /* ======================================================
     QUANTITY HELPERS (PHASE 5)
  ====================================================== */

  const getRules = (item) => ({
    min: Number(item.min_qty ?? 1),
    max: Number(item.max_qty ?? 100),
    step: Number(item.step_qty ?? 1),
  });

  const increaseQty = (id) => {
    const updated = cart.map((item) => {
      if (item.id !== id) return item;

      const { max, step } = getRules(item);
      const nextQty = item.quantity + step;

      return {
        ...item,
        quantity: Math.min(nextQty, max),
      };
    });

    updateCart(updated);
  };

  const decreaseQty = (id) => {
    const updated = cart.map((item) => {
      if (item.id !== id) return item;

      const { min, step } = getRules(item);
      const nextQty = item.quantity - step;

      return {
        ...item,
        quantity: Math.max(nextQty, min),
      };
    });

    updateCart(updated);
  };

  /* ======================================================
     ORDER
  ====================================================== */

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

  /* ======================================================
     TOTAL (SAFE)
  ====================================================== */

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
      <div className="mb-6">
        <button
          onClick={() => (window.location.href = "/user/items")}
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CART ITEMS */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => {
            const { min, max, step } = getRules(item);

            return (
             <div
  key={item.id}
  className="flex justify-between items-center bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition"
>
  {/* LEFT: IMAGE + INFO */}
  <div className="flex items-center gap-4">
    {/* IMAGE */}
    {item.image_path && (
      <img
        src={`http://localhost:8000/${item.image_path}`}
        alt={item.name}
        className="w-20 h-20 object-cover rounded-lg border"
      />
    )}

    {/* INFO */}
    <div>
      <h2 className="font-semibold text-gray-800">
        {item.name}
      </h2>

      {/* QUANTITY STEPPER */}
      <div className="flex items-center gap-3 mt-2">
        <button
          onClick={() => decreaseQty(item.id)}
          disabled={item.quantity <= min}
          className="px-3 py-1 rounded-lg bg-gray-200 hover:bg-gray-300 text-lg disabled:opacity-40"
        >
          −
        </button>

        <span className="font-medium text-gray-800 min-w-[40px] text-center">
          {item.quantity}
        </span>

        <button
          onClick={() => increaseQty(item.id)}
          disabled={item.quantity >= max}
          className="px-3 py-1 rounded-lg bg-gray-200 hover:bg-gray-300 text-lg disabled:opacity-40"
        >
          +
        </button>
      </div>

      <p className="text-xs text-gray-500 mt-1">
        Min {min} · Max {max} · Step {step}
      </p>
    </div>
  </div>

  {/* RIGHT: PRICE + REMOVE */}
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

            );
          })}
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

          <div className="flex justify-between text-lg font-bold border-t pt-3 mt-3">
            <span>Total</span>
            <span className="text-green-700">₹{total}</span>
          </div>

          <Button className="w-full mt-6" onClick={placeOrder}>
            Place Order
          </Button>
        </div>
      </div>
    </div>
  );
}
