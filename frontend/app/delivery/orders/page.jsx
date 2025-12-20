"use client";

import { useEffect, useState } from "react";
import RequireAuth from "@/app/components/RequireAuth";
import api from "@/lib/api";
import Loader from "@/app/components/ui/Loader";
import Button from "@/app/components/ui/Button";

export default function DeliveryOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    try {
      const res = await api.get("/delivery/orders"); // 🔴 adjust if API differs
      setOrders(res.data || []);
    } catch (err) {
      console.error("Failed to load delivery orders", err);
      alert("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  return (
    <RequireAuth role="delivery">
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-green-800 mb-4">
          Assigned Orders 🚚
        </h1>

        {loading && <Loader />}

        {!loading && !orders.length && (
          <p className="text-gray-600">No assigned orders yet</p>
        )}

        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.order_id}
              className="bg-white border border-green-100 rounded-xl p-5 shadow-sm"
            >
              <div className="flex justify-between items-center">
                <h2 className="font-semibold text-lg">
                  Order #{order.order_id}
                </h2>

                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    order.delivered
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {order.delivered ? "Delivered" : "Pending"}
                </span>
              </div>

              <div className="mt-2 text-sm text-gray-600 space-y-1">
                <p>Total: ₹{order.total_price}</p>
                <p>
                  Created:{" "}
                  {new Date(order.created_at).toLocaleString()}
                </p>
              </div>

              <Button
                size="sm"
                className="mt-4 bg-green-600 hover:bg-green-700"
                onClick={() =>
                  (window.location.href = `/delivery/orders/${order.order_id}`)
                }
              >
                View Details
              </Button>
            </div>
          ))}
        </div>
      </div>
    </RequireAuth>
  );
}
