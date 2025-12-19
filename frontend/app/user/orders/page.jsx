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
  if (!orders.length) return <p className="p-6">No orders yet</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">My Orders</h1>

      {orders.map((order) => (
        <div key={order.id} className="border p-4 mb-3 rounded">
          <p><b>Order #</b>{order.id}</p>
          <p>Status: {order.status}</p>
          <p>Total: ₹{order.total_price}</p>

          <Button
            size="sm"
            className="mt-2"
            onClick={() => (window.location.href = `/user/orders/${order.id}`)}
          >
            View
          </Button>
        </div>
      ))}
    </div>
  );
}
