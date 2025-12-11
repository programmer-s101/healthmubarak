import axios from "axios";

const API = "http://127.0.0.1:8000";

export async function loginUser(data) {
  return axios.post(`${API}/auth/login`, data);
}

export async function loginOwner(data) {
  return axios.post(`${API}/owner/login`, data);
}

export async function loginDelivery(data) {
  return axios.post(`${API}/delivery/login`, data);
}
