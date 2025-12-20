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
    loadCartCount();
    alert("Item added to cart");
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-100 p-8">

      {/* HEADER */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Fresh & Organic Products
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Handpicked for your healthy lifestyle 🌿
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            variant="secondary"
            onClick={() => (window.location.href = "/user/orders")}
          >
            My Orders
          </Button>

          <Button onClick={() => (window.location.href = "/user/cart")}>
            Cart ({cartCount})
          </Button>
        </div>
      </div>

      {/* ITEMS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="group rounded-2xl bg-white shadow-md hover:shadow-xl transition-all duration-300 p-6 flex flex-col"
          >
            {/* PRODUCT INFO */}
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-800 group-hover:text-green-700 transition">
                {item.name}
              </h2>

              <p className="mt-1 text-xl font-bold text-green-700">
                ₹{item.price}
              </p>

              <p className="text-sm text-gray-500 mt-1">
                Unit: {item.unit}
              </p>

              <p
                className={`mt-2 text-sm font-medium ${
                  item.in_stock
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {item.in_stock ? "In Stock" : "Out of Stock"}
              </p>
            </div>

            {/* ACTION */}
            <Button
              disabled={!item.in_stock}
              onClick={() => addToCart(item)}
              className="mt-4"
            >
              {item.in_stock ? "Add to Cart" : "Unavailable"}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
