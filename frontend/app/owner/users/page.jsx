"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

import Table from "../../components/ui/Table";
import Loader from "../../components/ui/Loader";

export default function OwnerUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    try {
      setLoading(true);

      // 🔴 CHANGE THIS URL ONLY if your swagger differs
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
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Users</h1>

      <Table
  columns={["Full Name", "Phone"]}
  data={users.map((user) => ({
    "Full Name": user.fullname,
    Phone: user.phone,
  }))}
/>

    </div>
  );
}
