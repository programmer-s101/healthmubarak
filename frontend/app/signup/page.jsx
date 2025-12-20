"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();

  const [fullname, setFullname] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const params = new URLSearchParams({
        fullname,
        phone,
        password,
      });

      const res = await fetch(
        `http://127.0.0.1:8000/auth/signup?${params.toString()}`,
        {
          method: "POST",
        }
      );

      if (!res.ok) {
        throw new Error();
      }

      // success → go to login
      router.replace("/login");
    } catch (err) {
      setError("Signup failed (phone may already exist)");
    }
  };

  return (
    <div className="auth-bg flex items-center justify-center px-4">
      <div className="relative z-10 w-full max-w-md animate-fade-lift">
        {/* BRAND */}
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
            Create Account
          </h2>

          <form onSubmit={handleSignup} className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-600"
            />

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
              Sign Up
            </button>

            {error && (
              <p className="text-red-600 text-sm text-center mt-2">
                {error}
              </p>
            )}

            <div className="text-center mt-4">
              <a
                href="/login"
                className="text-green-700 font-semibold hover:underline"
              >
                Already have an account? Login
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
