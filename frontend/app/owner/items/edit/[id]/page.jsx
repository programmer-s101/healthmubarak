"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";

import Button from "../../../../components/ui/Button";
import Loader from "../../../../components/ui/Loader";

export default function EditItemPage() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    price: "",
    unit: "",
    is_preorder: false,
    in_stock: true,
  });

  useEffect(() => {
    const loadItem = async () => {
      try {
        const res = await api.get("/items/list");
        const item = res.data.find((i) => i.id === Number(id));

        if (!item) {
          alert("Item not found");
          router.push("/owner/items");
          return;
        }

        setForm({
          name: item.name,
          price: item.price,
          unit: item.unit,
          is_preorder: item.is_preorder,
          in_stock: item.in_stock,
        });
      } catch (err) {
        console.error(err);
        alert("Failed to load item");
      } finally {
        setLoading(false);
      }
    };

    loadItem();
  }, [id, router]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await api.put(`/owner/items/${id}`, null, {
        params: {
          name: form.name,
          price: form.price,
          unit: form.unit,
          is_preorder: form.is_preorder,
          in_stock: form.in_stock,
        },
      });

      alert("Item updated");
      router.push("/owner/items");
    } catch (err) {
      console.error(err);
      alert("Failed to update item");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-lime-100 flex items-center justify-center p-8 animate-fade-in">

      {/* CARD */}
      <div className="w-full max-w-xl rounded-3xl bg-[#fdfefe] shadow-2xl p-8">

        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Edit Item
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Update product details and availability
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">

          <InputField
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Item name"
          />

          <InputField
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            placeholder="Price (₹)"
          />

          <InputField
            name="unit"
            value={form.unit}
            onChange={handleChange}
            placeholder="Unit (pcs / kg / ml)"
          />

          {/* CHECKBOXES */}
          <div className="space-y-2 pt-2">
            <Checkbox
              label="Available for Pre-Order"
              name="is_preorder"
              checked={form.is_preorder}
              onChange={handleChange}
            />
            <Checkbox
              label="Currently In Stock"
              name="in_stock"
              checked={form.in_stock}
              onChange={handleChange}
            />
          </div>

          {/* ACTIONS */}
          <div className="pt-6 flex gap-3">
            <Link href="/owner/items" className="flex-1">
              <Button variant="secondary" className="w-full">
                Cancel
              </Button>
            </Link>

            <Button
              type="submit"
              disabled={saving}
              className="flex-1 bg-gradient-to-b from-green-600 to-green-700 hover:brightness-110"
            >
              {saving ? "Saving..." : "Update Item"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ---------- UI HELPERS (no logic) ---------- */

function InputField({ name, value, onChange, placeholder, type = "text" }) {
  return (
    <input
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required
      className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-800
                 focus:outline-none focus:ring-2 focus:ring-green-600 bg-white"
    />
  );
}

function Checkbox({ label, name, checked, onChange }) {
  return (
    <label className="flex items-center gap-3 text-gray-700">
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        className="accent-green-600 w-4 h-4"
      />
      <span className="text-sm">{label}</span>
    </label>
  );
}
