export default function UserSubscriptions({ subs }) {
  return (
    <div className="bg-white shadow rounded p-4">
      <h2 className="text-lg font-semibold mb-3">Your Subscriptions</h2>

      {subs.length === 0 ? (
        <p className="text-gray-500">No active subscriptions.</p>
      ) : (
        <ul className="space-y-3">
          {subs.map((s, i) => (
            <li key={i} className="border rounded p-3">
              <p className="font-medium">{s.itemName}</p>
              <p className="text-gray-500 text-sm">
                {s.type} — Qty: {s.qty} {s.unit}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
