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

  // Quantity config (UI only – backend safe)
  const [baseQty, setBaseQty] = useState("1");
  const [minQty, setMinQty] = useState("1");
  const [maxQty, setMaxQty] = useState("");
  const [stepQty, setStepQty] = useState("1");

  // ✅ Image upload (NEW – SAFE)
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const submit = async () => {
    if (!name || !price) {
      alert("Name and price required");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);
      formData.append("unit", unit);
      formData.append("is_preorder", isPreorder);

      // image is OPTIONAL
      if (image) {
        formData.append("image", image);
      }

      await api.post("/items/add", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Item added");
      window.location.href = "/owner/items";
    } catch (err) {
      console.error(err);
      alert("Failed to add item");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 flex items-center justify-center p-8">
      <div className="w-full max-w-lg rounded-3xl bg-white shadow-2xl p-8 animate-fade-in">

        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Add New Item</h1>
          <p className="text-sm text-gray-600 mt-1">
            Define pricing and quantity rules for customers
          </p>
        </div>

        {/* BASIC INFO */}
        <div className="space-y-4">
          <LabeledInput
            label="Item Name"
            placeholder="e.g. Organic Apples"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <LabeledInput
            label="Price (₹)"
            placeholder="Price for base quantity"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          <LabeledInput
            label="Unit"
            placeholder="pcs / kg / g / ml"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
          />
        </div>

        {/* IMAGE UPLOAD */}
        <div className="mt-6 space-y-2">
          <label className="text-xs font-medium text-gray-600">
            Item Image (optional)
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              setImage(file);
              setImagePreview(URL.createObjectURL(file));
            }}
            className="block w-full text-sm text-gray-600
                       file:mr-4 file:rounded-lg file:border-0
                       file:bg-green-100 file:px-4 file:py-2
                       file:text-green-700 hover:file:bg-green-200"
          />

          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="mt-2 h-32 w-full object-contain rounded-lg border"
            />
          )}
        </div>

        {/* QUANTITY CONFIG */}
        <div className="mt-6 border-t pt-4 space-y-4">
          <h3 className="text-sm font-semibold text-gray-700">
            Quantity Configuration
          </h3>

          <LabeledInput
            label="Base Quantity"
            placeholder="e.g. 1 (price applies to this quantity)"
            type="number"
            value={baseQty}
            onChange={(e) => setBaseQty(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-3">
            <LabeledInput
              label="Minimum Order Quantity"
              placeholder="e.g. 0.5"
              type="number"
              value={minQty}
              onChange={(e) => setMinQty(e.target.value)}
            />

            <LabeledInput
              label="Maximum Order Quantity"
              placeholder="e.g. 10"
              type="number"
              value={maxQty}
              onChange={(e) => setMaxQty(e.target.value)}
            />
          </div>

          <LabeledInput
            label="Step Size"
            placeholder="e.g. 0.25 (increment step)"
            type="number"
            value={stepQty}
            onChange={(e) => setStepQty(e.target.value)}
          />
        </div>

        {/* PREORDER */}
        <label className="flex items-center gap-3 mt-4 text-gray-700">
          <input
            type="checkbox"
            checked={isPreorder}
            onChange={(e) => setIsPreorder(e.target.checked)}
            className="accent-green-600 w-4 h-4"
          />
          <span className="text-sm">Available for Pre-Order</span>
        </label>

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

/* ---------- UI HELPERS ---------- */

function LabeledInput({ label, ...props }) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-gray-600">{label}</label>
      <Input {...props} />
    </div>
  );
}
