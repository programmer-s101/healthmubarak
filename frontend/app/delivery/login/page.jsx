"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import Toast from "@/components/ui/toast";
import { loginDelivery } from "@/lib/api/auth";

export default function DeliveryLogin() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [toast, setToast] = useState({ message: "", type: "" });

  async function handleLogin() {
    try {
      const res = await loginDelivery({ phone, password });
      localStorage.setItem("token_delivery", res.data.token);
      router.push("/delivery/orders");
    } catch (err) {
      setToast({ message: "Invalid delivery login!", type: "error" });
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">

      <div className="bg-white shadow-lg rounded-xl p-8 w-96">
        <h1 className="text-2xl font-semibold text-center mb-6">
          Delivery Login
        </h1>

        <Input label="Phone Number" onChange={(e) => setPhone(e.target.value)} />
        <Input label="Password" type="password" onChange={(e) => setPassword(e.target.value)} />

        <Button className="w-full mt-4" onClick={handleLogin}>Login</Button>
      </div>

      <Toast message={toast.message} type={toast.type} />
    </div>
  );
}
