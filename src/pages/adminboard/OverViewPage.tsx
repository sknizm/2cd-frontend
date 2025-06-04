export function OverviewPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Stats cards will go here */}
        <div className="bg-white p-6 rounded-lg shadow">Total Users</div>
        <div className="bg-white p-6 rounded-lg shadow">Active Restaurants</div>
        <div className="bg-white p-6 rounded-lg shadow">Revenue</div>
      </div>
    </div>
  );
}