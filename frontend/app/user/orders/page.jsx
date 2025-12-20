"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import Loader from "../../components/ui/Loader";
import Button from "../../components/ui/Button";

export default function UserOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    try {
      const res = await api.get("/orders/my");
      setOrders(res.data || []);
    } catch (err) {
      console.error("Failed to load orders", err);
      alert("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  if (loading) return <Loader />;

  if (!orders.length)
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">No orders yet 🌱</p>
        <Button
          className="mt-4 bg-green-600 hover:bg-green-700"
          onClick={() => (window.location.href = "/user/items")}
        >
          Start Shopping
        </Button>
      </div>
    );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* HEADER */}
      <div className="mb-6">
        <button
          onClick={() => (window.location.href = "/user/items")}
          className="text-sm text-green-700 hover:underline"
        >
          ← Back to Items
        </button>

        <h1 className="text-3xl font-bold text-green-800 mt-2">
          My Orders
        </h1>
        <p className="text-sm text-gray-600">
          Track your healthy purchases 🌿
        </p>
      </div>

      {/* ORDERS LIST */}
      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-xl border border-green-100 shadow-sm p-5 hover:shadow-md transition"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold text-gray-800">
                  Order #{order.id}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Total: ₹{order.total_price}
                </p>
              </div>

              <span
                className={`px-3 py-1 text-xs rounded-full font-medium
                  ${
                    order.status === "DELIVERED"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }
                `}
              >
                {order.status}
              </span>
            </div>

            <Button
              size="sm"
              className="mt-4 bg-green-600 hover:bg-green-700"
              onClick={() =>
                (window.location.href = `/user/orders/${order.id}`)
              }
            >
              View Order Details
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
