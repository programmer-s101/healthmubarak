import { apiGet } from "@/lib/api";
import StatsCards from "./components/StatsCards";
import OrdersGraph from "./components/OrdersGraph";



export default async function OwnerDashboard() {
  const data = await apiGet("/owner/dashboard");

  return (
    <div className="p-6">
<StatsCards />
      <OrdersGraph />
      <h1 className="text-xl font-bold">Owner Dashboard</h1>

      <div className="grid grid-cols-3 gap-4 mt-4">
        <div className="p-4 bg-white shadow rounded">
          <h3 className="font-semibold">Total Users</h3>
          <p>{data.total_users}</p>
        </div>

        <div className="p-4 bg-white shadow rounded">
          <h3 className="font-semibold">Total Orders</h3>
          <p>{data.total_orders}</p>
        </div>

        <div className="p-4 bg-white shadow rounded">
          <h3 className="font-semibold">Total Due</h3>
          <p>₹{data.total_due}</p>
        </div>
      </div>
    </div>
  );
}
