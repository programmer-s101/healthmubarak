"use client";

import { useEffect, useState } from "react";
import { get } from "@/lib/api";
import { Card } from "@/components/ui/card";

export default function Subscriptions() {
  const [subs, setSubs] = useState([]);

  useEffect(() => {
    const user_id = localStorage.getItem("user_id");
    get(`/subscriptions/by-user?user_id=${user_id}`).then(setSubs);
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">My Subscriptions</h1>

      {subs.map((s) => (
        <Card key={s.id} className="p-4 mb-3">
          <p>Subscription ID: {s.id}</p>
          <p>Item: {s.item_id}</p>
          <p>Next Delivery: {s.next_delivery_date}</p>
        </Card>
      ))}
    </div>
  );
}
