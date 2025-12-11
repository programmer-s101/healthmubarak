import { apiGet, apiPost } from "../lib/api";

// ITEMS -----------------------
export const getAllItems = async () => {
  return await apiGet("/owner/items");
};

export const addItem = async (item) => {
  return await apiPost("/owner/items", item);
};

// PUT using POST (FastAPI accepts POST for update also if needed)
export const updateItem = async (itemId, updates) => {
  return await apiPost(`/owner/items/${itemId}`, updates);
};

export const toggleStock = async (itemId, status) => {
  return await apiPost(`/owner/items/${itemId}/stock`, {
    in_stock: status,
  });
};

// ORDERS -----------------------
export const getAllOrders = async () => {
  return await apiGet("/owner/orders");
};

export const markDelivered = async (orderId) => {
  return await apiPost(`/owner/orders/${orderId}/delivered`, {});
};

export const confirmPayment = async (orderId) => {
  return await apiPost(`/owner/orders/${orderId}/payment`, {});
};

// CUSTOMERS -----------------------
export const getAllCustomers = async () => {
  return await apiGet("/owner/customers");
};

export const getCustomerHistory = async (customerId) => {
  return await apiGet(`/owner/customers/${customerId}/history`);
};

// OWNER ITEMS -----------------------
export const ownerListItems = async () => {
  return await apiGet("/owner/items");
};

export const ownerCreateItem = async (payload) => {
  return await apiPost("/owner/items", payload);
};

export const ownerUpdateItem = async (itemId, updates) => {
  return await apiPost(`/owner/items/${itemId}`, updates);
};

export const ownerDeleteItem = async (itemId) => {
  return await apiPost(`/owner/items/${itemId}/delete`, {});
};

export const ownerToggleStock = async (itemId, in_stock) => {
  return await apiPost(`/owner/items/${itemId}/stock`, { in_stock });
};
