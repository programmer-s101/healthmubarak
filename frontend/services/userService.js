import api from "../lib/api";

export const getItems = async () => {
  const res = await api.get("/items");
  return res.data;
};

export const placeInstantOrder = async (itemId, quantity) => {
  const res = await api.post("/orders/instant", {
    item_id: itemId,
    quantity,
  });
  return res.data;
};

export const createSubscription = async (itemId, quantity, frequency) => {
  const res = await api.post("/orders/subscription", {
    item_id: itemId,
    quantity,
    frequency, // daily, weekly, monthly
  });
  return res.data;
};

export const getUserOrders = async () => {
  const res = await api.get("/orders/my");
  return res.data;
};

export const getOutstandingAmount = async () => {
  const res = await api.get("/payments/outstanding");
  return res.data;
};

export const payAmount = async (amount, method) => {
  const res = await api.post("/payments/pay", {
    amount,
    method, // cash or upi
  });
  return res.data;
};
