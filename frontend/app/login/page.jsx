"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const params = new URLSearchParams({ phone, password });

      const res = await fetch(
        `http://127.0.0.1:8000/auth/login?${params.toString()}`,
        {
          method: "POST",
          credentials: "include", // 🔥 REQUIRED for cookies
        }
      );

      if (!res.ok) throw new Error();

      const data = await res.json();

     // 🔥 SAVE AUTH DATA (REQUIRED)
localStorage.setItem("access_token", data.access_token);
localStorage.setItem("role", data.role);
localStorage.setItem("user_id", data.user_id); // ✅ REQUIRED
localStorage.removeItem("cart"); // ✅ THIS FIXES IT

      // 🔥 USE replace() to prevent back-loop
      if (data.role === "owner") router.replace("/owner/items");
      if (data.role === "user") router.replace("/user/items");
      if (data.role === "delivery") router.replace("/delivery/orders");

    } catch {
      setError("Invalid phone or password");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "100px auto" }}>
      <h2>Login</h2>

      <form onSubmit={handleLogin}>
        <input
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
        <br /><br />

        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br /><br />

        <button type="submit">Login</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <p>
        New user? <a href="/signup">Signup here</a>
      </p>
    </div>
  );
}
