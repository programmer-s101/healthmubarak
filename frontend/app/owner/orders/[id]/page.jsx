"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import api from "@/lib/api";
import Loader from "../../../components/ui/Loader";

export default function OwnerOrderDetail({ params }) {
  const { id } = use(params);          // ✅ correct for Next 15+
  const orderId = Number(id);          // ✅ ensure number

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
  if (!order) return <p>Order not found</p>;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">
        Order #{order.order_id}
      </h1>

      <p><b>Status:</b> {order.status}</p>
      <p><b>Total:</b> ₹{order.total_price}</p>

      <div>
        <h2 className="font-semibold mt-4">Items</h2>
        <ul className="list-disc pl-5">
          {order.items?.map((item, idx) => (
            <li key={idx}>
              {item.name} × {item.quantity} — ₹{item.price}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="font-semibold mt-4">Delivery</h2>
        {order.delivery ? (
          <p>
            Delivery Boy ID: {order.delivery.delivery_boy_id} <br />
            Status: {order.delivery.delivered ? "Delivered ✅" : "Pending 🚚"}
          </p>
        ) : (
          <p>Not assigned</p>
        )}
      </div>
    </div>
  );
}
