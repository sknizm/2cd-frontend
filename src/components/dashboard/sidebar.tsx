// src/components/dashboard/DashboardSidebar.tsx
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { X, Home,     BadgeCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

type DashboardSidebarProps = {
  className?: string;
  onClose?: () => void;
};

export const DashboardSidebar = ({ className, onClose }: DashboardSidebarProps) => {
  const location = useLocation();
const navItems = [
  { name: "Dashboard", href: "/dashboard/home", icon: Home },
  { name: "Premium", href: "/dashboard/membership", icon: BadgeCheck }, 
];

  return (
    <aside className={cn(
      "w-64 border-r border-gray-200 bg-white",
      className
    )}>
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
        <h1 className="text-xl font-semibold text-gray-900">MenuLink</h1>
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="md:hidden"
          >
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            onClick={onClose}
            className={cn(
              "flex items-center px-4 py-2 text-sm font-medium rounded-md",
              location.pathname === item.href
                ? "bg-amber-50 text-amber-600"
                : "text-gray-600 hover:bg-gray-100"
            )}
          >
            <item.icon className="w-5 h-5 mr-3" />
            {item.name}
          </Link>
        ))}
      </nav>
      {/* <Button onClick={logout}>Logout</Button> */}
    </aside>
  );
};