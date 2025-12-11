"use client";

import { useEffect, useState } from "react";

export default function DeliveryHistory() {
  const [history, setHistory] = useState([]);

  async function loadHistory() {
    const res = await fetch("http://localhost:8000/delivery/history");
    const data = await res.json();
    setHistory(data);
  }

  useEffect(() => {
    loadHistory();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Delivery History</h1>

      <div className="mt-6 bg-white p-4 rounded shadow">
        {history.length === 0 ? (
          <p>No history found.</p>
        ) : (
          history.map((h: any) => (
            <div key={h.id} className="border-b pb-2 mb-2">
              <p><strong>Name:</strong> {h.customer_name}</p>
              <p><strong>Item:</strong> {h.item_name}</p>
              <p><strong>Date:</strong> {h.delivered_at}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
