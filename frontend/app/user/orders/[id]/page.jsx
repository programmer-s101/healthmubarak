"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import api from "@/lib/api";
import Loader from "../../../components/ui/Loader";

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
  if (!data) return <p>Order not found</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">
        Order #{data.order.id}
      </h1>

      <p>Status: {data.order.status}</p>
      <p>Total: ₹{data.order.total_price}</p>

      <h2 className="mt-4 font-semibold">Items</h2>
      {data.items.map((item) => (
        <div key={item.item_id} className="border p-2 mt-2">
          {item.name} × {item.quantity} — ₹{item.price}
        </div>
      ))}
    </div>
  );
}
