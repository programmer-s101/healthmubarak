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

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [form, setForm] = useState({
    name: "",
    price: "",
    unit: "",
    is_preorder: false,
    in_stock: true,
    base_qty: 1,
    min_qty: 1,
    max_qty: 10,
    step_qty: 1,
  });

  /* ---------------- LOAD ITEM ---------------- */
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
          base_qty: item.base_qty ?? 1,
          min_qty: item.min_qty ?? 1,
          max_qty: item.max_qty ?? 10,
          step_qty: item.step_qty ?? 1,
        });

        if (item.image_path) {
          setImagePreview(`http://localhost:8000/${item.image_path}`);
        }
      } finally {
        setLoading(false);
      }
    };

    loadItem();
  }, [id, router]);

  /* ---------------- HANDLERS ---------------- */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (imageFile) fd.append("image", imageFile);

    try {
      await api.put(`/items/update/${id}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Item updated");
      router.push("/owner/items");
    } catch {
      alert("Failed to update item");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen bg-green-50 flex justify-center p-8">
      <div className="max-w-xl w-full bg-white p-8 rounded-2xl shadow">
        <h1 className="text-2xl font-bold mb-6">Edit Item</h1>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* IMAGE */}
          <Section title="Item Image">
            {imagePreview && (
              <img
                src={imagePreview}
                className="w-full h-48 object-cover rounded-xl border"
                alt="Item"
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-2"
            />
            <p className="text-xs text-gray-500">
              Leave empty to keep existing image
            </p>
          </Section>

          {/* BASIC INFO */}
          <Section title="Basic Information">
            <LabeledInput
              label="Item Name"
              name="name"
              value={form.name}
              onChange={handleChange}
            />
            <LabeledInput
              label="Price (₹)"
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
            />
            <LabeledInput
              label="Unit"
              name="unit"
              value={form.unit}
              onChange={handleChange}
              placeholder="pcs / kg / g / ml"
            />
          </Section>

          {/* QUANTITY */}
          <Section title="Quantity Configuration">
            <LabeledInput
              label="Base Quantity"
              name="base_qty"
              type="number"
              value={form.base_qty}
              onChange={handleChange}
            />
            <LabeledInput
              label="Minimum Quantity"
              name="min_qty"
              type="number"
              value={form.min_qty}
              onChange={handleChange}
            />
            <LabeledInput
              label="Maximum Quantity"
              name="max_qty"
              type="number"
              value={form.max_qty}
              onChange={handleChange}
            />
            <LabeledInput
              label="Step Size"
              name="step_qty"
              type="number"
              value={form.step_qty}
              onChange={handleChange}
            />
          </Section>

          {/* FLAGS */}
          <Section title="Availability">
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
          </Section>

          {/* ACTIONS */}
          <div className="flex gap-3 pt-4">
            <Link href="/owner/items" className="flex-1">
              <Button variant="secondary" className="w-full">
                Cancel
              </Button>
            </Link>
           <Button
  type="submit"
  className="flex-1"
  disabled={saving}
>
  {saving ? "Saving..." : "Update Item"}
</Button>

          </div>
        </form>
      </div>
    </div>
  );
}

/* ---------------- UI HELPERS ---------------- */

function Section({ title, children }) {
  return (
    <div className="space-y-3 border-t pt-4">
      <p className="text-sm font-semibold text-gray-800">{title}</p>
      {children}
    </div>
  );
}

function LabeledInput({ label, ...props }) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-gray-600">{label}</label>
      <input
        {...props}
        className="w-full rounded-xl border px-4 py-3 focus:ring-2 focus:ring-green-600"
        required
      />
    </div>
  );
}

function Checkbox({ label, ...props }) {
  return (
    <label className="flex items-center gap-3 text-gray-700">
      <input type="checkbox" {...props} className="accent-green-600 w-4 h-4" />
      <span className="text-sm">{label}</span>
    </label>
  );
}
