"use client";

import { useState } from "react";
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
    <div className="p-6 max-w-md">
      <h1 className="text-xl font-bold mb-4">Add Item</h1>

      <Input placeholder="Item name" value={name} onChange={e => setName(e.target.value)} />
      <Input placeholder="Price" type="number" value={price} onChange={e => setPrice(e.target.value)} />
      <Input placeholder="Unit (pcs/kg/ml)" value={unit} onChange={e => setUnit(e.target.value)} />

      <label className="block mt-2">
        <input type="checkbox" checked={isPreorder} onChange={e => setIsPreorder(e.target.checked)} />
        <span className="ml-2">Preorder</span>
      </label>

      <Button className="mt-4" onClick={submit}>Add Item</Button>
    </div>
  );
}
