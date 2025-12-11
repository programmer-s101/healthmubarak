"use client";

import { useEffect, useState } from "react";
import { getAllCustomers } from "@/services/ownerService";

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await getAllCustomers();
    console.log("Customers API Response:", res);

    // Ensure it's always an array
    const safeData = Array.isArray(res) ? res : [];
    setCustomers(safeData);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">Customers</h1>

      <table className="mt-6 w-full bg-white shadow">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-3 border">Name</th>
            <th className="p-3 border">Phone</th>
            <th className="p-3 border">Outstanding</th>
          </tr>
        </thead>

        <tbody>
          {customers.map((c) => (
            <tr key={c.id}>
              <td className="p-3 border">{c.name}</td>
              <td className="p-3 border">{c.phone}</td>
              <td className="p-3 border">₹{c.total_due}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
