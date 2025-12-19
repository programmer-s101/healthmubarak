"use client";

import { useState } from "react";
import api from "@/lib/api";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";

export default function AddDeliveryBoy() {
  const [fullname, setFullname] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
     await api.post(
  "/owner/add-delivery-boy",
  null,
  {
    params: {
      fullname,
      phone,
      password,
    },
  }
);


      alert("Delivery boy added");
      window.location.href = "/owner/delivery";
    } catch (err) {
      console.error(err);
      alert("Failed to add delivery boy");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 max-w-md">
      <h1 className="text-xl font-bold mb-4">Add Delivery Boy</h1>

      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          placeholder="Full Name"
          value={fullname}
          onChange={(e) => setFullname(e.target.value)}
          required
        />

        <Input
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />

        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <Button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Add Delivery Boy"}
        </Button>
      </form>
    </div>
  );
}
