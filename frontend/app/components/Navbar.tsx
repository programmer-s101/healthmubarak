import RequireAuth from "@/app/components/RequireAuth";

export default function DeliveryOrders() {
  return (
    <RequireAuth role="delivery">
      <h1>Delivery Orders</h1>
    </RequireAuth>
  );
}
