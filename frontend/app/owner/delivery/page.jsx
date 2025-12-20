"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-lime-100 p-8">

      {/* HEADER */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Delivery Team
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage your delivery workforce
          </p>
        </div>

        <div className="flex gap-3">
          <Link href="/owner/dashboard">
            <Button variant="secondary">← Dashboard</Button>
          </Link>

          <Button
            className="bg-gradient-to-b from-green-600 to-green-700 hover:brightness-110"
            onClick={() => (window.location.href = "/owner/delivery/add")}
          >
            + Add Delivery Boy
          </Button>
        </div>
      </div>

      {/* CONTENT CARD */}
      <div className="rounded-2xl bg-white shadow-xl p-6">

        {deliveryBoys.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No delivery boys added yet 🌱
          </div>
        ) : (
          <Table
            columns={["Full Name", "Phone"]}
            data={deliveryBoys.map((d) => ({
              "Full Name": d.fullname,
              Phone: d.phone,
            }))}
          />
        )}

      </div>
    </div>
  );
}
