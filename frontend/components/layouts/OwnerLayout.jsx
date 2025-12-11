export default function OwnerLayout({ children }) {
  return (
    <div className="flex">
      <aside className="w-64 h-screen bg-gray-900 text-white p-5">
        <h2 className="text-xl mb-6">Owner Panel</h2>
        <nav className="flex flex-col gap-2">
          <a href="/owner/dashboard">Dashboard</a>
          <a href="/owner/items">Items</a>
          <a href="/owner/orders">Orders</a>
          <a href="/owner/payments">Payments</a>
          <a href="/owner/subscriptions">Subscriptions</a>
          <a href="/owner/reports">Reports</a>
        </nav>
      </aside>

      <main className="p-6 w-full bg-gray-100">{children}</main>
    </div>
  );
}
