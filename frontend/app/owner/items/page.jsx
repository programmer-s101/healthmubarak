"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";

import Table from "../../components/ui/Table";
import Button from "../../components/ui/Button";
import Loader from "../../components/ui/Loader";

export default function OwnerItemsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadItems = async () => {
    try {
      setLoading(true);
      const res = await api.get("/items/list");
      setItems(res.data || []);
    } catch (err) {
      console.error("Failed to load items", err);
      alert("Failed to load items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this item?")) return;

    try {
      await api.delete(`/owner/items/${id}`);
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete item");
    }
  };

  const toggleStock = async (item) => {
    try {
      await api.post(`/items/toggle-stock`, null, {
        params: { item_id: item.id },
      });

      setItems((prev) =>
        prev.map((i) =>
          i.id === item.id ? { ...i, in_stock: !i.in_stock } : i
        )
      );
    } catch (err) {
      console.error(err);
      alert("Failed to toggle stock");
    }
  };

  if (loading) return <Loader />;

return (
  <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 p-8 animate-fade-in">

    {/* HEADER */}
    <div className="mb-8 flex items-center justify-between">
      <div>
        <h1 className="text-4xl font-bold text-gray-800">Items</h1>
        <p className="text-gray-600 mt-1">
          Control your organic product inventory
        </p>
      </div>

      <div className="flex gap-3">
        <Link href="/owner/dashboard">
          <Button variant="secondary">← Dashboard</Button>
        </Link>

        <Button onClick={() => (window.location.href = "/owner/items/add")}>
          + Add Item
        </Button>
      </div>
    </div>

    {/* STATS */}
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
      <StatCard
        label="Total Items"
        value={items.length}
      />
      <StatCard
        label="In Stock"
        value={items.filter(i => i.in_stock).length}
      />
      <StatCard
        label="Out of Stock"
        value={items.filter(i => !i.in_stock).length}
      />
    </div>

    {/* TABLE PANEL */}
    <div className="rounded-3xl bg-white shadow-2xl p-6">
      <Table
        columns={["Name", "Price", "Unit", "Stock", "Actions"]}
        data={items.map((item) => ({
          Name: item.name,
          Price: `₹${item.price}`,
          Unit: item.unit,
          Stock: (
            <Button
              variant={item.in_stock ? "success" : "danger"}
              onClick={() => toggleStock(item)}
            >
              {item.in_stock ? "In Stock" : "Out"}
            </Button>
          ),
          Actions: (
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() =>
                  (window.location.href = `/owner/items/edit/${item.id}`)
                }
              >
                Edit
              </Button>
              <Button
                size="sm"
                variant="danger"
                onClick={() => handleDelete(item.id)}
              >
                Delete
              </Button>
            </div>
          ),
        }))}
      />
    </div>
  </div>
);

}
function StatCard({ label, value }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-md hover:shadow-xl transition transform hover:-translate-y-1">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-2 text-3xl font-bold text-green-700">
        {value}
      </p>
    </div>
  );
}

