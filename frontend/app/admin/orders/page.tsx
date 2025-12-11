"use client";

import { useEffect, useState } from "react";
import { 
  getAllOrders, 
  markDelivered, 
  confirmPayment 
} from "@/services/ownerService";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
  const res = await getAllOrders();
  setOrders(res.data || []);
};

  return (
    <div>
      <h1 className="text-2xl font-bold">Orders</h1>

      <table className="mt-6 w-full bg-white shadow">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-3 border">Customer</th>
            <th className="p-3 border">Item</th>
            <th className="p-3 border">Qty</th>
            <th className="p-3 border">Status</th>
            <th className="p-3 border">Payment</th>
            <th className="p-3 border">Actions</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td className="p-3 border">{o.customer_name}</td>
              <td className="p-3 border">{o.item_name}</td>
              <td className="p-3 border">{o.quantity}</td>
              <td className="p-3 border">{o.status}</td>
              <td className="p-3 border">{o.payment_status}</td>

              <td className="p-3 border flex gap-2">

                <button
                  onClick={() => markDelivered(o.id)}
                  className="px-3 py-1 bg-green-600 text-white rounded"
                >
                  Delivered
                </button>

                <button
                  onClick={() => confirmPayment(o.id)}
                  className="px-3 py-1 bg-blue-600 text-white rounded"
                >
                  Confirm Payment
                </button>

              </td>
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
}
