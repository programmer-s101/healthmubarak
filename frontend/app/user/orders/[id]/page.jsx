"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import api from "@/lib/api";
import Loader from "../../../components/ui/Loader";
import Button from "../../../components/ui/Button";

export default function UserOrderDetail({ params }) {
  const { id } = use(params);
  const orderId = Number(id);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadOrder = async () => {
    try {
      const res = await api.get(`/orders/my/${orderId}`);
      setData(res.data);
    } catch (err) {
      console.error("Order load failed", err);
      alert("Order not found");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) loadOrder();
  }, [orderId]);

  if (loading) return <Loader />;
  if (!data) return <p className="p-6">Order not found</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* BACK */}
      <button
        onClick={() => window.history.back()}
        className="text-sm text-green-700 hover:underline mb-4"
      >
        ← Back to Orders
      </button>

      {/* ORDER SUMMARY */}
      <div className="bg-green-50 border border-green-100 rounded-xl p-5 mb-6">
        <h1 className="text-2xl font-bold text-green-800">
          Order #{data.order.id}
        </h1>

        <div className="flex flex-wrap gap-6 mt-3 text-sm">
          <p>
            <span className="font-medium text-gray-600">Status:</span>{" "}
            <span
              className={`font-semibold ${
                data.order.status === "DELIVERED"
                  ? "text-green-700"
                  : "text-yellow-700"
              }`}
            >
              {data.order.status}
            </span>
          </p>

          <p>
            <span className="font-medium text-gray-600">Total:</span>{" "}
            <span className="font-semibold text-gray-800">
              ₹{data.order.total_price}
            </span>
          </p>
        </div>
      </div>

      {/* ITEMS */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-3">
          Ordered Items
        </h2>

        <div className="space-y-3">
          {data.items.map((item) => (
            <div
              key={item.item_id}
              className="bg-white border border-green-100 rounded-lg p-4 flex justify-between items-center shadow-sm"
            >
              <div>
                <p className="font-medium text-gray-800">
                  {item.name}
                </p>
                <p className="text-sm text-gray-500">
                  Quantity: {item.quantity}
                </p>
              </div>

              <p className="font-semibold text-green-700">
                ₹{item.price}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <Button
        className="mt-6 bg-green-600 hover:bg-green-700"
        onClick={() => (window.location.href = "/user/items")}
      >
        Order Again 🌿
      </Button>
    </div>
  );
}
