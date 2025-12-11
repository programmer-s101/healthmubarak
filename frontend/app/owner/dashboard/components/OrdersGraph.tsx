"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react";

export default function OrdersGraph() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/owner/stats")
      .then(res => res.json())
      .then(d => setData(d.orders_per_day));
  }, []);

  return (
    <div className="bg-white p-4 rounded-xl shadow mt-6">
      <h2 className="font-bold mb-4">Orders Per Day</h2>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data}>
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
