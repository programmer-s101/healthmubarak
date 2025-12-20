"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";

import Table from "../../components/ui/Table";
import Loader from "../../components/ui/Loader";
import Button from "../../components/ui/Button";

export default function OwnerUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/owner/users");
      setUsers(res.data || []);
    } catch (err) {
      console.error("Failed to load users", err);
      alert("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-100 p-8">

      {/* TOP BAR */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Users</h1>
          <p className="text-sm text-gray-600 mt-1">
            Registered customers using HealthMubarak
          </p>
        </div>

        <Link href="/owner/dashboard">
          <Button variant="secondary">← Dashboard</Button>
        </Link>
      </div>

      {/* CONTENT CARD */}
      <div className="rounded-2xl bg-white shadow-xl p-6">

        {users.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No users found
          </div>
        ) : (
          <Table
            columns={["Full Name", "Phone"]}
            data={users.map((user) => ({
              "Full Name": (
                <span className="font-medium text-gray-800">
                  {user.fullname}
                </span>
              ),
              Phone: (
                <span className="text-gray-700">
                  {user.phone}
                </span>
              ),
            }))}
          />
        )}

      </div>
    </div>
  );
}
