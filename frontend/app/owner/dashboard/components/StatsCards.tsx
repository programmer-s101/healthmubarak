"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";

export default function StatsCards() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/owner/stats")
      .then(res => res.json())
      .then(data => setStats(data));
  }, []);

  if (!stats) return <p>Loading...</p>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card className="p-4 text-center">
        <h2 className="text-xl font-bold">{stats.total_customers}</h2>
        <p className="text-gray-600 text-sm">Customers</p>
      </Card>

      <Card className="p-4 text-center">
        <h2 className="text-xl font-bold">{stats.active_orders}</h2>
        <p className="text-gray-600 text-sm">Active Orders</p>
      </Card>

      <Card className="p-4 text-center">
        <h2 className="text-xl font-bold">{stats.completed_orders}</h2>
        <p className="text-gray-600 text-sm">Delivered</p>
      </Card>

      <Card className="p-4 text-center">
        <h2 className="text-xl font-bold">₹{stats.total_earnings}</h2>
        <p className="text-gray-600 text-sm">Earnings</p>
      </Card>
    </div>
  );
}
