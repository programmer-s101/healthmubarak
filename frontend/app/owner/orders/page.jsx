"use client";

import { useEffect, useState } from "react";
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

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Orders</h1>

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
          "Order ID": order.order_id,
          "User ID": order.user_id,
          "Total": `₹${order.total_price}`,
          "Status": order.status,
          "Items": (
            <ul className="list-disc pl-4">
              {order.items?.map((i, idx) => (
                <li key={idx}>
                  {i.name} × {i.quantity}
                </li>
              ))}
            </ul>
          ),
          "Delivery": order.delivery
            ? order.delivery.delivered
              ? "Delivered ✅"
              : "Pending 🚚"
            : "Not Assigned",
          "Created At": new Date(order.created_at).toLocaleString(),
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
    </div>
  );
}
