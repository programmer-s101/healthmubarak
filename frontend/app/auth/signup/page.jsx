"use client";
import { useState } from "react";
import { post } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Signup() {
  const [form, setForm] = useState({ name: "", phone: "", password: "" });

  const submit = async () => {
    const res = await post("/auth/signup", form);
    alert(res.message);
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create Account</h1>

      <Input placeholder="Name" className="mb-2"
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <Input placeholder="Phone" className="mb-2"
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
      />
      <Input type="password" placeholder="Password" className="mb-2"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />

      <Button onClick={submit} className="w-full">Signup</Button>
    </div>
  );
}
