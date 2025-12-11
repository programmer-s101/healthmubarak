export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white p-6 space-y-6">
        <h2 className="text-2xl font-bold">HealthMubarak Admin</h2>

        <nav className="space-y-4">
          <a href="/admin" className="block">Dashboard</a>
          <a href="/admin/items" className="block">Items</a>
          <a href="/admin/orders" className="block">Orders</a>
          <a href="/admin/customers" className="block">Customers</a>
          <a href="/admin/payments" className="block">Payments</a>
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1 bg-gray-100 p-8">{children}</div>
    </div>
  );
}
