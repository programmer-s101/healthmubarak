"use client";

import { useEffect, useState } from "react";
import {
  ownerListItems,
  ownerCreateItem,
  ownerUpdateItem,
  ownerDeleteItem,
  ownerToggleStock,
} from "@/services/ownerService";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function OwnerItemsPage() {
  const [items, setItems] = useState([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [form, setForm] = useState({ name: "", price: "", unit: "pcs", is_preorder: false, in_stock: true });
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    loadItems();
  }, []);

 async function loadItems() {
  const res = await ownerListItems();
  setItems(res.data || []);  // Extract the array properly
}


  async function handleAdd() {
    await ownerCreateItem({
      name: form.name,
      price: Number(form.price),
      unit: form.unit,
      is_preorder: form.is_preorder,
      in_stock: form.in_stock,
    });
    setOpenAdd(false);
    setForm({ name: "", price: "", unit: "pcs", is_preorder: false, in_stock: true });
    loadItems();
  }

  async function startEdit(item) {
    setEditing(item);
    setForm({ name: item.name, price: item.price, unit: item.unit, is_preorder: item.is_preorder, in_stock: item.in_stock });
    setOpenAdd(true);
  }

  async function handleSaveEdit() {
    await ownerUpdateItem(editing.id, {
      name: form.name,
      price: Number(form.price),
      unit: form.unit,
      is_preorder: form.is_preorder,
      in_stock: form.in_stock,
    });
    setEditing(null);
    setOpenAdd(false);
    loadItems();
  }

  async function handleDelete(id) {
    if (!confirm("Delete this item?")) return;
    await ownerDeleteItem(id);
    loadItems();
  }

  async function toggleStockNow(item) {
    await ownerToggleStock(item.id, !item.in_stock);
    loadItems();
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Items</h1>
        <Button onClick={() => setOpenAdd(true)}>+ Add Item</Button>
      </div>

      <div className="bg-white shadow rounded">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Price</th>
              <th className="p-3">Unit</th>
              <th className="p-3">Preorder</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it.id} className="border-b">
                <td className="p-3">{it.name}</td>
                <td className="p-3">₹{it.price}</td>
                <td className="p-3">{it.unit}</td>
                <td className="p-3">{it.is_preorder ? "Yes" : "No"}</td>
                <td className="p-3">{it.in_stock ? "In Stock" : "Out"}</td>
                <td className="p-3 flex gap-2">
                  <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={() => startEdit(it)}>Edit</button>
                  <button className="px-3 py-1 bg-yellow-500 text-white rounded" onClick={() => toggleStockNow(it)}>{it.in_stock ? "Set Out" : "Set In"}</button>
                  <button className="px-3 py-1 bg-red-600 text-white rounded" onClick={() => handleDelete(it.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={openAdd} onClose={() => { setOpenAdd(false); setEditing(null); }}>
        <h2 className="text-lg font-semibold mb-3">{editing ? "Edit Item" : "Add Item"}</h2>

        <Input label="Name" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} />
        <Input label="Price" value={form.price} onChange={(e) => setForm({...form, price: e.target.value})} />
        <Input label="Unit (kg/litre/pcs)" value={form.unit} onChange={(e) => setForm({...form, unit: e.target.value})} />
        <div className="flex gap-4 items-center mb-4">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={form.is_preorder} onChange={(e) => setForm({...form, is_preorder: e.target.checked})} />
            Preorder
          </label>

          <label className="flex items-center gap-2">
            <input type="checkbox" checked={form.in_stock} onChange={(e) => setForm({...form, in_stock: e.target.checked})} />
            In Stock
          </label>
        </div>

        {!editing && <Button onClick={handleAdd} className="mr-2">Create</Button>}
        {editing && <Button onClick={handleSaveEdit} className="mr-2">Save</Button>}
      </Modal>
    </div>
  );
}
