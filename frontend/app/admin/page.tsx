export default function AdminHome() {
    return (
      <div>
        <h1 className="text-3xl font-bold">Owner Dashboard</h1>
  
        <div className="mt-6 grid grid-cols-3 gap-6">
          <div className="p-6 bg-white shadow rounded-xl">
            <h3 className="text-xl font-semibold">Total Customers</h3>
          </div>
  
          <div className="p-6 bg-white shadow rounded-xl">
            <h3 className="text-xl font-semibold">Pending Orders</h3>
          </div>
  
          <div className="p-6 bg-white shadow rounded-xl">
            <h3 className="text-xl font-semibold">Total Revenue</h3>
          </div>
        </div>
      </div>
    );
  }
  