import api from "../lib/api";

export const login = async (email, password) => {
  const res = await api.post("/auth/login", {
    email,
    password,
  });
  return res.data;
};

export const signup = async (name, email, phone, password) => {
  const res = await api.post("/auth/signup", {
    name,
    email,
    phone,
    password,
  });
  return res.data;
};

export const getProfile = async () => {
  const res = await api.get("/auth/me");
  return res.data;
};
