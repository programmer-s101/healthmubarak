import { apiGet } from "@/lib/api";

export default async function UserDashboard() {
  const profile = await apiGet("/user/profile");
  const data = await apiGet("/user/orders");

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Welcome, {profile.fullname}</h1>

      <div className="mt-4 p-4 bg-white rounded shadow">
        <p className="text-lg font-semibold">Total Due: ₹{data.total_due}</p>
      </div>

      <h2 className="mt-6 text-lg font-bold">Order History</h2>

      <div className="mt-4 bg-white shadow p-4 rounded">
        {data.orders.map((order: any) => (
          <div key={order.id} className="border-b pb-2 mb-2">
            <p><strong>Item:</strong> {order.item_name}</p>
            <p><strong>Qty:</strong> {order.quantity}</p>
            <p><strong>Price:</strong> ₹{order.price}</p>
            <p><strong>Payment:</strong> {order.payment_status}</p>
            <p><strong>Type:</strong> {order.type}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
