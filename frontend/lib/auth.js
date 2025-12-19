export async function getCurrentUser() {
  try {
    const res = await fetch("http://127.0.0.1:8000/auth/me", {
      credentials: "include",
    });

    if (!res.ok) return null;

    return await res.json();
  } catch {
    return null;
  }
}
