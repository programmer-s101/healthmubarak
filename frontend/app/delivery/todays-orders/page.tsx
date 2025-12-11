export default function TodaysOrders() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Today’s Orders</h1>

      <div className="mt-6 space-y-4">

        {/* Each order card */}
        <div className="bg-white shadow p-4 rounded-lg">
          <h3 className="text-lg font-semibold">Customer Name</h3>

          <p className="text-gray-500">Address: XYZ, Lane 5</p>
          <p className="mt-2 font-medium">Items:</p>
          <ul className="list-disc ml-6 text-gray-700">
            <li>Milk 1 Litre</li>
            <li>Curd 500g</li>
          </ul>

          <div className="flex gap-3 mt-4">
            <button className="bg-green-600 text-white px-4 py-2 rounded">
              Mark Delivered
            </button>

            <button className="bg-yellow-500 text-white px-4 py-2 rounded">
              Not Available
            </button>

            <button className="bg-red-600 text-white px-4 py-2 rounded">
              Cancel Delivery
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
