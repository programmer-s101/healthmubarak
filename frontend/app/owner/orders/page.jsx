"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";

import Table from "../../components/ui/Table";
import Loader from "../../components/ui/Loader";
import Button from "../../components/ui/Button";

export default function OwnerOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    try {
      const res = await api.get("/owner/orders");
      setOrders(res.data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  if (loading) return <Loader />;

  const statusBadge = (status) => {
    const base =
      "px-3 py-1 rounded-full text-xs font-semibold inline-block";

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
          <h1 className="text-3xl font-bold text-gray-800">Orders</h1>
          <p className="text-sm text-gray-600 mt-1">
            Track and manage customer orders
          </p>
        </div>

        <Link href="/owner/dashboard">
          <Button variant="secondary">← Dashboard</Button>
        </Link>
      </div>

      {/* CONTENT CARD */}
      <div className="rounded-2xl bg-white shadow-xl p-6 overflow-x-auto">

        {orders.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No orders found
          </div>
        ) : (
          <Table
            columns={[
              "Order ID",
              "User ID",
              "Total",
              "Status",
              "Items",
              "Delivery",
              "Created At",
              "Action",
            ]}
            data={orders.map((order) => ({
              "Order ID": (
                <span className="font-semibold text-gray-800">
                  #{order.order_id}
                </span>
              ),
              "User ID": order.user_id,
              "Total": (
                <span className="font-medium text-green-700">
                  ₹{order.total_price}
                </span>
              ),
              "Status": statusBadge(order.status),
              "Items": (
                <ul className="list-disc pl-4 text-sm text-gray-700">
                  {order.items?.map((i, idx) => (
                    <li key={idx}>
                      {i.name} × {i.quantity}
                    </li>
                  ))}
                </ul>
              ),
              "Delivery": order.delivery ? (
                order.delivery.delivered ? (
                  <span className="text-green-700 font-medium">
                    Delivered ✅
                  </span>
                ) : (
                  <span className="text-orange-600 font-medium">
                    Pending 🚚
                  </span>
                )
              ) : (
                <span className="text-gray-500">Not Assigned</span>
              ),
              "Created At": (
                <span className="text-sm text-gray-600">
                  {new Date(order.created_at).toLocaleString()}
                </span>
              ),
              "Action": (
                <Button
                  size="sm"
                  onClick={() =>
                    (window.location.href = `/owner/orders/${order.order_id}`)
                  }
                >
                  View
                </Button>
              ),
            }))}
          />
        )}
      </div>
    </div>
  );
}
