import { Sidebar } from "@/components/admin/Sidebar";
import { Outlet } from "react-router-dom";

export function AdminPage() {
  return (
    <div className="flex min-h-screen bg-gray-50/50">
      <Sidebar />
      <main className="flex-1 lg:pl-20 lg:pt-0 pt-16">
        <div className="p-4 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}