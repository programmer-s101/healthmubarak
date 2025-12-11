export async function fetchOwnerStats() {
  const res = await fetch("http://127.0.0.1:8000/owner/stats", {
    cache: "no-store",
  });
  return res.json();
}
