"use client";

import { useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";

export default function AddItemPage() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [unit, setUnit] = useState("pcs");
  const [isPreorder, setIsPreorder] = useState(false);

  const submit = async () => {
    if (!name || !price) {
      alert("Name and price required");
      return;
    }

    try {
      await api.post(
        `/items/add?name=${name}&price=${price}&unit=${unit}&is_preorder=${isPreorder}`
      );

      alert("Item added");
      window.location.href = "/owner/items";
    } catch (err) {
      alert("Failed to add item");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 flex items-center justify-center p-8">

      {/* CARD */}
      <div className="w-full max-w-lg rounded-3xl bg-white shadow-2xl p-8 animate-fade-in">

        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Add New Item
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Add a fresh organic product to your inventory
          </p>
        </div>

        {/* FORM */}
        <div className="space-y-4">
          <Input
            placeholder="Item name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Input
            placeholder="Price (₹)"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          <Input
            placeholder="Unit (pcs / kg / ml)"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
          />

          {/* PREORDER */}
          <label className="flex items-center gap-3 mt-2 text-gray-700">
            <input
              type="checkbox"
              checked={isPreorder}
              onChange={(e) => setIsPreorder(e.target.checked)}
              className="accent-green-600 w-4 h-4"
            />
            <span className="text-sm">Available for Pre-Order</span>
          </label>
        </div>

        {/* ACTIONS */}
        <div className="mt-8 flex gap-3">
          <Link href="/owner/items" className="flex-1">
            <Button variant="secondary" className="w-full">
              Cancel
            </Button>
          </Link>

          <Button
            className="flex-1 bg-gradient-to-b from-green-600 to-green-700 hover:brightness-110"
            onClick={submit}
          >
            Add Item
          </Button>
        </div>
      </div>
    </div>
  );
}
