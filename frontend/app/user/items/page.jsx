"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import Button from "../../components/ui/Button";
import Loader from "../../components/ui/Loader";

export default function UserItemsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    loadItems();
    loadCartCount();
  }, []);

  const loadItems = async () => {
    try {
      const res = await api.get("/items/list");
      setItems(res.data || []);
    } catch (err) {
      alert("Failed to load items");
    } finally {
      setLoading(false);
    }
  };

  const loadCartCount = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartCount(cart.length);
  };

  const addToCart = (item) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existing = cart.find((i) => i.id === item.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...item, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    loadCartCount(); // 🔥 update badge
    alert("Item added to cart");
  };

  if (loading) return <Loader />;

  return (
    <div className="p-6">
      {/* 🔥 HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Available Items</h1>

        <Button onClick={() => (window.location.href = "/user/cart")}>
          Cart ({cartCount})
        </Button>
      </div>
<div className="flex justify-between items-center mb-4">
  <h1 className="text-xl font-bold">Available Items</h1>

  <Button onClick={() => window.location.href = "/user/orders"}>
    My Orders
  </Button>
</div>

      {/* ITEMS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="border rounded p-4 shadow"
          >
            <h2 className="font-semibold">{item.name}</h2>
            <p>₹{item.price}</p>
            <p>Unit: {item.unit}</p>
            <p className={item.in_stock ? "text-green-600" : "text-red-600"}>
              {item.in_stock ? "In Stock" : "Out of Stock"}
            </p>

            <Button
              disabled={!item.in_stock}
              onClick={() => addToCart(item)}
              className="mt-2"
            >
              Add to Cart
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
