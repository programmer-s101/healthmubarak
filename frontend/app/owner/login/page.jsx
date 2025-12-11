"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import Toast from "@/components/ui/toast";
import { loginOwner } from "@/lib/api/auth";

export default function OwnerLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [toast, setToast] = useState({ message: "", type: "" });

  async function handleLogin() {
    try {
      const res = await loginOwner({ email, password });
      localStorage.setItem("token_owner", res.data.token);
      router.push("/owner/dashboard");
    } catch (err) {
      setToast({ message: "Invalid owner login!", type: "error" });
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">

      <div className="bg-white shadow-lg rounded-xl p-8 w-96">
        <h1 className="text-2xl font-semibold text-center mb-6">
          Owner Login
        </h1>

        <Input label="Email" onChange={(e) => setEmail(e.target.value)} />
        <Input label="Password" type="password" onChange={(e) => setPassword(e.target.value)} />

        <Button className="w-full mt-4" onClick={handleLogin}>Login</Button>
      </div>

      <Toast message={toast.message} type={toast.type} />
    </div>
  );
}
