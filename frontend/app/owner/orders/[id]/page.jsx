"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import Link from "next/link";
import api from "@/lib/api";
import Loader from "../../../components/ui/Loader";
import Button from "../../../components/ui/Button";

export default function OwnerOrderDetail({ params }) {
  const { id } = use(params);
  const orderId = Number(id);

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadOrder = async () => {
    if (!orderId || isNaN(orderId)) return;

    try {
      const res = await api.get(`/owner/orders/${orderId}`);
      setOrder(res.data);
    } catch (err) {
      console.error("Order load failed", err);
      alert("Failed to load order");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  if (loading) return <Loader />;
  if (!order)
    return (
      <div className="p-8 text-center text-gray-600">
        Order not found
      </div>
    );

  const statusBadge = (status) => {
    const base =
      "px-4 py-1 rounded-full text-sm font-semibold inline-block";

    switch (status) {
      case "pending":
        return (
          <span className={`${base} bg-yellow-100 text-yellow-800`}>
            Pending
          </span>
        );
      case "confirmed":
        return (
          <span className={`${base} bg-blue-100 text-blue-800`}>
            Confirmed
          </span>
        );
      case "delivered":
        return (
          <span className={`${base} bg-green-100 text-green-800`}>
            Delivered
          </span>
        );
      case "cancelled":
        return (
          <span className={`${base} bg-red-100 text-red-800`}>
            Cancelled
          </span>
        );
      default:
        return (
          <span className={`${base} bg-gray-100 text-gray-700`}>
            {status}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-100 p-8">

      {/* TOP BAR */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Order #{order.order_id}
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Order details and delivery status
          </p>
        </div>

        <Link href="/owner/orders">
          <Button variant="secondary">← Back to Orders</Button>
        </Link>
      </div>

      {/* MAIN CARD */}
      <div className="rounded-2xl bg-white shadow-xl p-6 space-y-6">

        {/* SUMMARY */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="rounded-xl bg-green-50 p-4">
            <p className="text-sm text-gray-600">Status</p>
            <div className="mt-1">{statusBadge(order.status)}</div>
          </div>

          <div className="rounded-xl bg-green-50 p-4">
            <p className="text-sm text-gray-600">Total Amount</p>
            <p className="mt-1 text-xl font-bold text-green-700">
              ₹{order.total_price}
            </p>
          </div>

          <div className="rounded-xl bg-green-50 p-4">
            <p className="text-sm text-gray-600">Created At</p>
            <p className="mt-1 text-sm text-gray-800">
              {new Date(order.created_at).toLocaleString()}
            </p>
          </div>
        </div>

        {/* ITEMS */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Ordered Items
          </h2>

          <div className="rounded-xl border border-green-100 p-4">
            <ul className="space-y-2">
              {order.items?.map((item, idx) => (
                <li
                  key={idx}
                  className="flex justify-between text-sm"
                >
                  <span className="text-gray-700">
                    {item.name} × {item.quantity}
                  </span>
                  <span className="font-medium text-gray-800">
                    ₹{item.price}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* DELIVERY */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Delivery Details
          </h2>

          <div className="rounded-xl border border-green-100 p-4 text-sm">
            {order.delivery ? (
              <div className="space-y-1">
                <p>
                  <span className="text-gray-600">Delivery Boy ID:</span>{" "}
                  <span className="font-medium">
                    {order.delivery.delivery_boy_id}
                  </span>
                </p>
                <p>
                  <span className="text-gray-600">Status:</span>{" "}
                  {order.delivery.delivered ? (
                    <span className="text-green-700 font-medium">
                      Delivered ✅
                    </span>
                  ) : (
                    <span className="text-orange-600 font-medium">
                      Pending 🚚
                    </span>
                  )}
                </p>
              </div>
            ) : (
              <p className="text-gray-500">Not assigned</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
