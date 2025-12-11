"use client";

import { useEffect, useState } from "react";
import { get } from "@/lib/api";
import { Card } from "@/components/ui/card";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const user_id = localStorage.getItem("user_id");
    get(`/orders/by-user?user_id=${user_id}`).then(setOrders);
  }, []);

  return (
    <div className="p-4 grid gap-4">
      <h1 className="text-2xl font-bold">My Orders</h1>

      {orders.map((o) => (
        <Card key={o.id} className="p-4 border">
          <p>Order ID: {o.id}</p>
          <p>Total Amount: {o.total_amount} Rs</p>
          <p>Status: {o.status}</p>
        </Card>
      ))}
    </div>
  );
}
