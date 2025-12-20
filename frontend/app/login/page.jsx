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
          credentials: "include", // REQUIRED for cookies
        }
      );

      if (!res.ok) {
        throw new Error();
      }

      const data = await res.json();

      // SAVE AUTH DATA
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("user_id", data.user_id);
      localStorage.removeItem("cart");

      // ROLE BASED REDIRECT
      if (data.role === "owner") router.replace("/owner/dashboard");
      if (data.role === "user") router.replace("/user/items");
      if (data.role === "delivery") router.replace("/delivery/orders");

    } catch (err) {
      setError("Invalid phone or password");
    }
  };

  return (
    <div className="auth-bg flex items-center justify-center px-4">
      <div className="relative z-10 w-full max-w-md animate-fade-lift">

        {/* LOGO */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-green-800 drop-shadow-[0_2px_6px_rgba(255,255,255,0.8)]">
            HealthMubarak
          </h1>
          <p className="text-sm text-green-800 mt-1 font-medium drop-shadow-[0_1px_4px_rgba(255,255,255,0.9)]">
            Pure & Natural Organic Products
          </p>
        </div>

        {/* CARD */}
        <div className="glass-card p-8">
          <h2 className="text-2xl font-semibold text-center text-green-800 mb-6">
            Welcome
          </h2>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="text"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-600"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-600"
            />

            <button
              type="submit"
              className="w-full mt-4 rounded-lg bg-gradient-to-b from-green-600 to-green-700 py-3 text-white font-semibold shadow-lg hover:brightness-110 transition"
            >
              Login
            </button>

            {error && (
              <p className="text-red-600 text-sm text-center mt-2">
                {error}
              </p>
            )}

            <div className="text-center mt-6">
              <a
                href="/signup"
                className="inline-block w-full rounded-lg border-2 border-green-700 py-3 text-green-800 font-semibold hover:bg-green-50 transition"
              >
                Create New Account
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
