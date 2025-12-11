export default function UserTodayDelivery({ today }) {
  return (
    <div className="bg-white shadow rounded p-4">
      <h2 className="text-lg font-semibold mb-3">Today's Delivery</h2>

      {today ? (
        <div>
          <p className="font-medium">{today.itemName}</p>
          <p className="text-gray-500 text-sm">Qty: {today.qty} {today.unit}</p>
          <p className="text-sm text-green-600 mt-2">
            Status: {today.status}
          </p>
        </div>
      ) : (
        <p className="text-gray-500">No deliveries today.</p>
      )}
    </div>
  );
}
