"use client";
import { useState } from "react";
import { post } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Login() {
  const [form, setForm] = useState({ phone: "", password: "" });

  const submit = async () => {
    const res = await post("/auth/login", form);
    if (res.token) {
      localStorage.setItem("token", res.token);
      localStorage.setItem("user_id", res.user_id);
      window.location.href = "/customer/items";
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Login</h1>

      <Input placeholder="Phone" className="mb-2"
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
      />
      <Input type="password" placeholder="Password" className="mb-2"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />

      <Button onClick={submit} className="w-full">Login</Button>
    </div>
  );
}
