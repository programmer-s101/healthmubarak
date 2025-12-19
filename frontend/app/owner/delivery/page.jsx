"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import Table from "../../components/ui/Table";
import Loader from "../../components/ui/Loader";
import Button from "../../components/ui/Button";

export default function OwnerDeliveryPage() {
  const [deliveryBoys, setDeliveryBoys] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadDeliveryBoys = async () => {
    try {
const res = await api.get("/owner/delivery-boys");
      setDeliveryBoys(res.data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load delivery boys");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDeliveryBoys();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Delivery Boys</h1>
        <Button onClick={() => (window.location.href = "/owner/delivery/add")}>
          + Add Delivery Boy
        </Button>
      </div>

      <Table
        columns={["Full Name", "Phone"]}
        data={deliveryBoys.map((d) => ({
          "Full Name": d.fullname,
          Phone: d.phone,
        }))}
      />
    </div>
  );
}
