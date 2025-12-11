export default function UserStats({ stats }) {
  return (
    <div className="grid grid-cols-3 gap-4">

      <div className="p-4 bg-white rounded shadow">
        <h3 className="text-sm text-gray-500">Pending Amount</h3>
        <p className="text-xl font-bold text-red-600">
          ₹{stats.pendingAmount}
        </p>
      </div>

      <div className="p-4 bg-white rounded shadow">
        <h3 className="text-sm text-gray-500">Total Orders</h3>
        <p className="text-xl font-bold">
          {stats.totalOrders}
        </p>
      </div>

      <div className="p-4 bg-white rounded shadow">
        <h3 className="text-sm text-gray-500">Active Subscriptions</h3>
        <p className="text-xl font-bold">
          {stats.subscriptions}
        </p>
      </div>

    </div>
  );
}
