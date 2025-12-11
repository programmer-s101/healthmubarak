"use client";

import { useEffect, useState } from "react";

export default function DeliveryStatsCards({ deliveryBoyId }: any) {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/delivery/stats/${deliveryBoyId}`)
      .then(res => res.json())
      .then(setStats);
  }, []);

  if (!stats) return <p>Loading...</p>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-white p-4 shadow rounded-xl text-center">
        <h2 className="text-2xl font-bold">{stats.total_assigned}</h2>
        <p className="text-gray-600 text-sm">Total Orders</p>
      </div>

      <div className="bg-white p-4 shadow rounded-xl text-center">
        <h2 className="text-2xl font-bold">{stats.active}</h2>
        <p className="text-gray-600 text-sm">Active</p>
      </div>

      <div className="bg-white p-4 shadow rounded-xl text-center">
        <h2 className="text-2xl font-bold">{stats.completed}</h2>
        <p className="text-gray-600 text-sm">Completed</p>
      </div>

      <div className="bg-white p-4 shadow rounded-xl text-center">
        <h2 className="text-2xl font-bold">₹{stats.total_earnings}</h2>
        <p className="text-gray-600 text-sm">Earnings</p>
      </div>
    </div>
  );
}
