"use client";

import { useEffect, useState } from "react";
import { get, post } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useParams } from "next/navigation";

export default function ItemDetails() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    get("/items/list").then((items) => {
      const found = items.find((i) => i.id == id);
      setItem(found);
    });
  }, [id]);

  const buyNow = async () => {
    const user_id = localStorage.getItem("user_id");
    const res = await post("/orders/create", {
      user_id,
      item_id: id,
      quantity: qty,
    });
    alert("Order placed successfully");
  };

  const subscribeNow = async (frequency) => {
    const user_id = localStorage.getItem("user_id");
    const res = await post("/subscriptions/create", {
      user_id,
      item_id: id,
      quantity: qty,
      frequency,
    });
    alert("Subscription added");
  };

  if (!item) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <Card className="p-4">
        <h1 className="text-2xl font-bold">{item.name}</h1>
        <p className="mb-2 text-gray-600">
          {item.price} Rs / {item.unit}
        </p>

        <label className="text-sm font-semibold">Quantity ({item.unit})</label>
        <Input
          type="number"
          min="1"
          className="my-2"
          value={qty}
          onChange={(e) => setQty(e.target.value)}
        />

        <Button onClick={buyNow} className="w-full my-2">
          Buy Now
        </Button>

        <p className="font-bold mt-4">Subscribe</p>

        <div className="grid grid-cols-3 gap-2 mt-2">
          <Button onClick={() => subscribeNow("daily")}>Daily</Button>
          <Button onClick={() => subscribeNow("weekly")}>Weekly</Button>
          <Button onClick={() => subscribeNow("monthly")}>Monthly</Button>
        </div>
      </Card>
    </div>
  );
}
