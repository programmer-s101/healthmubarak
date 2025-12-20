"use client";

import { useState } from "react";
import Link from "next/link";
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-lime-100 flex items-center justify-center p-6">

      {/* CARD */}
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl p-8">

        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Add Delivery Boy
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Create delivery access for logistics
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">

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

          <Button
            type="submit"
            disabled={saving}
            className="w-full bg-gradient-to-b from-green-600 to-green-700 hover:brightness-110"
          >
            {saving ? "Saving..." : "Add Delivery Boy"}
          </Button>
        </form>

        {/* FOOTER */}
        <div className="mt-6 text-center">
          <Link
            href="/owner/delivery"
            className="text-sm text-green-700 hover:underline"
          >
            ← Back to Delivery List
          </Link>
        </div>

      </div>
    </div>
  );
}
