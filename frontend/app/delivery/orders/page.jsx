import RequireAuth from "@/app/components/RequireAuth";

export default function DeliveryOrders() {
  return (
    <RequireAuth role="delivery">
      <h2>Delivery Orders</h2>
    </RequireAuth>
  );
}
