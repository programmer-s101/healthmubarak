export async function fetchDeliveryStats(deliveryBoyId: number) {
  const res = await fetch(`http://127.0.0.1:8000/delivery/stats/${deliveryBoyId}`, {
    cache: "no-store",
  });
  return res.json();
}

export async function fetchAssignedOrders(deliveryBoyId: number) {
  const res = await fetch(`http://127.0.0.1:8000/delivery/orders/${deliveryBoyId}`, {
    cache: "no-store",
  });
  return res.json();
}

export async function completeOrder(orderId: number) {
  const res = await fetch(`http://127.0.0.1:8000/delivery/orders/complete/${orderId}`, {
    method: "POST",
  });
  return res.json();
}
