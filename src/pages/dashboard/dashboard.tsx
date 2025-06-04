
import { Outlet } from 'react-router-dom';
import { DashboardHeader } from '@/components/dashboard/header';
import { DashboardSidebar } from '@/components/dashboard/sidebar';
import { useMobileSidebar } from '@/hooks/useMobileSidebar';

export default function DashboardPage() {
  const { isOpen, onOpen, onClose } = useMobileSidebar();
  
  

  

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <DashboardSidebar className="hidden md:block" onClose={onClose} />

      {/* Mobile Sidebar */}
      <DashboardSidebar
        className={`md:hidden fixed inset-y-0 z-50 ${isOpen ? 'block' : 'hidden'}`}
        onClose={onClose}
      />

      <div className="flex flex-col flex-1 overflow-hidden">
        <DashboardHeader onOpen={onOpen} />

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
