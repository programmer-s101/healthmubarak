"use client";
import { useState } from "react";
import { apiPost } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {
    const res = await apiPost("/auth/login", { phone, password });

    if (res.role === "user") router.push("/user/dashboard");
    else if (res.role === "owner") router.push("/owner/dashboard");
    else router.push("/delivery/dashboard");
  }

  return (
    <div className="p-10 max-w-sm mx-auto">
      <h1 className="text-xl font-bold mb-4">Login</h1>

      <input className="border p-2 w-full"
        placeholder="Phone"
        value={phone}
        onChange={e => setPhone(e.target.value)}
      />

      <input className="border p-2 w-full mt-3"
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />

      <button
        className="bg-blue-600 text-white px-4 py-2 mt-4 w-full"
        onClick={handleLogin}
      >
        Login
      </button>
    </div>
  );
}
