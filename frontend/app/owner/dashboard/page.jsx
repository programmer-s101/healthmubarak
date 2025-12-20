import Link from "next/link";
import RequireAuth from "@/app/components/RequireAuth";

export default function OwnerDashboard() {
  return (
    <RequireAuth role="owner">
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 p-8">
        
        {/* HEADER */}
        <div className="mb-10 rounded-2xl bg-gradient-to-r from-green-700 to-green-600 p-8 text-white shadow-xl">
          <h1 className="text-4xl font-bold tracking-tight">
            Owner Dashboard
          </h1>
          <p className="mt-2 text-green-100">
            Control products, orders, users & delivery from one place
          </p>
        </div>

        {/* SECTION TITLE */}
        <h2 className="mb-4 text-xl font-semibold text-gray-800">
          Management
        </h2>

        {/* DASHBOARD GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <DashboardCard
            title="Items"
            description="Manage your products"
            href="/owner/items"
            accent="from-green-500 to-green-600"
          />

          <DashboardCard
            title="Orders"
            description="Track customer orders"
            href="/owner/orders"
            accent="from-blue-500 to-blue-600"
          />

          <DashboardCard
            title="Users"
            description="View registered users"
            href="/owner/users"
            accent="from-purple-500 to-purple-600"
          />

          <DashboardCard
            title="Delivery"
            description="Delivery partners"
            href="/owner/delivery"
            accent="from-orange-500 to-orange-600"
          />
        </div>
      </div>
    </RequireAuth>
  );
}

/* ---------------- DASHBOARD CARD ---------------- */

function DashboardCard({ title, description, href, accent }) {
  return (
    <Link href={href}>
      <div className="group relative cursor-pointer overflow-hidden rounded-2xl bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
        
        {/* Accent Bar */}
        <div
          className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${accent}`}
        />

        {/* Content */}
        <h3 className="text-xl font-bold text-gray-800 group-hover:text-green-700 transition">
          {title}
        </h3>

        <p className="mt-2 text-sm text-gray-600">
          {description}
        </p>

        {/* Action */}
        <div className="mt-6 text-sm font-semibold text-green-700">
          Open →
        </div>
      </div>
    </Link>
  );
}
