"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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

  // Load item WITHOUT calling /owner/items/{id}
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
    <div className="p-6 max-w-lg">
      <h1 className="text-xl font-bold mb-4">Edit Item</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Item name"
          className="w-full border p-2"
          required
        />

        <input
          name="price"
          type="number"
          value={form.price}
          onChange={handleChange}
          placeholder="Price"
          className="w-full border p-2"
          required
        />

        <input
          name="unit"
          value={form.unit}
          onChange={handleChange}
          placeholder="Unit"
          className="w-full border p-2"
          required
        />

        <label className="flex gap-2 items-center">
          <input
            type="checkbox"
            name="is_preorder"
            checked={form.is_preorder}
            onChange={handleChange}
          />
          Preorder
        </label>

        <label className="flex gap-2 items-center">
          <input
            type="checkbox"
            name="in_stock"
            checked={form.in_stock}
            onChange={handleChange}
          />
          In Stock
        </label>

       <Button type="submit" disabled={saving}>
  {saving ? "Saving..." : "Update Item"}
</Button>

      </form>
    </div>
  );
}
