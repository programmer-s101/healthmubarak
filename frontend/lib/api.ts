export const API_URL = "http://localhost:8000";

export async function apiGet(path: string) {
  const res = await fetch(API_URL + path, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
  return res.json();
}

export async function apiPost(path: string, body: any) {
  const res = await fetch(API_URL + path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  });
  return res.json();
}
