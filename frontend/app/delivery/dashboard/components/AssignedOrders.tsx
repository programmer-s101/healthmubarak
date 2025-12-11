"use client";

import { useEffect, useState } from "react";

export default function AssignedOrders({ deliveryBoyId }: any) {
  const [orders, setOrders] = useState([]);

  function load() {
    fetch(`http://127.0.0.1:8000/delivery/orders/${deliveryBoyId}`)
      .then(res => res.json())
      .then(setOrders);
  }

  useEffect(() => {
    load();
  }, []);

  async function complete(id: number) {
    await fetch(`http://127.0.0.1:8000/delivery/orders/complete/${id}`, {
      method: "POST",
    });
    load();
  }

  return (
    <div className="mt-6 bg-white p-4 shadow rounded-xl">
      <h2 className="text-xl font-bold mb-4">Assigned Orders</h2>

      {orders.map((o: any) => (
        <div key={o.id} className="border-b py-3 flex items-center justify-between">
          <div>
            <p><b>Order #{o.id}</b></p>
            <p className="text-gray-500 text-sm">{o.address}</p>
          </div>
          {o.status !== "delivered" && (
            <button
              onClick={() => complete(o.id)}
              className="px-4 py-1 bg-green-600 text-white rounded-lg"
            >
              Mark Delivered
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
