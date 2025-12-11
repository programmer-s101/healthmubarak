import { apiGet, apiPost } from "@/lib/api";
import DeliveryStatsCards from "./components/DeliveryStatsCards";
import AssignedOrders from "./components/AssignedOrders";

export default async function DeliveryDashboard() {
  const orders = await apiGet("/delivery/today");

  async function markDelivered(id: number) {
    await apiPost(`/delivery/mark/${id}`, {});
    window.location.reload();
  }
const deliveryBoyId = 1; // for now hard-coded
  return (
    <div className="p-6">

<DeliveryStatsCards deliveryBoyId={deliveryBoyId} />
      <AssignedOrders deliveryBoyId={deliveryBoyId} />

      <h1 className="text-xl font-bold">Today's Deliveries</h1>

      <div className="mt-4 bg-white p-4 shadow rounded">
        {orders.map((o: any) => (
          <div key={o.id} className="border-b pb-3 mb-3">
            <p><strong>Item:</strong> {o.item_name}</p>
            <p><strong>Qty:</strong> {o.quantity}</p>

            <button
              className="bg-green-600 text-white px-3 py-1 rounded mt-2"
              onClick={() => markDelivered(o.id)}
            >
              Mark Delivered
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
