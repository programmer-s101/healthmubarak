"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

import Table from "../../components/ui/Table";
import Button from "../../components/ui/Button";
import Loader from "../../components/ui/Loader";

export default function OwnerItemsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load items (public list endpoint – correct)
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

  // Delete item (OWNER endpoint – correct)
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

  // Toggle stock (simple public toggle – correct)
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
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Items</h1>
        <Button onClick={() => (window.location.href = "/owner/items/add")}>
          + Add Item
        </Button>
      </div>

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
  );
}
