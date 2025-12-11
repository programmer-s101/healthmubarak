"use client";

import { useEffect, useState } from "react";
import { get } from "@/lib/api";
import { Card } from "@/components/ui/card";

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const user_id = localStorage.getItem("user_id");

    get(`/payments/history?user_id=${user_id}`).then((data) => {
      setPayments(data);
    });

    get(`/payments/outstanding?user_id=${user_id}`).then((data) => {
      setBalance(data.balance);
    });
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Payment History</h1>

      <p className="text-xl mt-2 mb-4">
        Outstanding Amount: <strong>{balance} Rs</strong>
      </p>

      {payments.map((p) => (
        <Card key={p.id} className="p-4 mb-3">
          <p>Amount: {p.amount} Rs</p>
          <p>Status: {p.status}</p>
          <p>Method: {p.payment_method}</p>
        </Card>
      ))}
    </div>
  );
}
