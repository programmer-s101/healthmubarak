import RequireAuth from "@/app/components/RequireAuth";

export default function OwnerDashboard() {
  return (
    <RequireAuth role="owner">
      <h1>Owner Dashboard</h1>
    </RequireAuth>
  );
}
