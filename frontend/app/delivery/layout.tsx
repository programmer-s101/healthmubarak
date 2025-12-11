export default function DeliveryLayout({ children }) {
  return (
    <div className="flex">
      
      <div className="w-48 bg-gray-100 p-4 h-screen">
        <a href="/delivery/dashboard" className="block mt-4">
          Dashboard
        </a>

        <a href="/delivery/history" className="block mt-4">
          History
        </a>

        <a href="/logout" className="block mt-4 text-red-600">
          Logout
        </a>
      </div>

      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}
