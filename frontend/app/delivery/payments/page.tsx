export default function DeliveryPayments() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Pending Payments</h1>

      <table className="mt-6 w-full bg-white shadow border">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-3 border">Customer</th>
            <th className="p-3 border">Amount</th>
            <th className="p-3 border">Action</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td className="p-3 border">Mohd Arif</td>
            <td className="p-3 border">₹120</td>
            <td className="p-3 border">
              <button className="bg-green-600 text-white px-4 py-2 rounded">
                Cash Received
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
