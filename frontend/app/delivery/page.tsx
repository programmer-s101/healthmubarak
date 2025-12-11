export default function DeliveryHome() {
  return (
    <div>
      <h1 className="text-3xl font-bold">Today’s Summary</h1>

      <div className="grid grid-cols-3 gap-6 mt-6">

        <div className="p-6 bg-white shadow rounded-xl">
          <h2 className="font-semibold text-xl">Total Deliveries</h2>
        </div>

        <div className="p-6 bg-white shadow rounded-xl">
          <h2 className="font-semibold text-xl">Pending Deliveries</h2>
        </div>

        <div className="p-6 bg-white shadow rounded-xl">
          <h2 className="font-semibold text-xl">Pending Payments</h2>
        </div>

      </div>
    </div>
  );
}
