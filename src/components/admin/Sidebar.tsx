import { Link, useLocation } from "react-router-dom";
import { Button } from "../ui/button";
import { 
  LayoutDashboard,
  Users,
  Utensils,
  CreditCard,
  Settings,
  Gem,
  ChevronLeft,
  ChevronRight,
  Menu
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(true); // Changed default to open
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: "Overview", path: "overview", icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: "All Users", path: "users", icon: <Users className="w-5 h-5" /> },
    { name: "Restaurants", path: "restaurants", icon: <Utensils className="w-5 h-5" /> },
    { name: "Memberships", path: "memberships", icon: <Gem className="w-5 h-5" /> },
    { name: "Payments", path: "payments", icon: <CreditCard className="w-5 h-5" /> },
    { name: "Settings", path: "settings", icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        <Menu className="w-6 h-6" />
        <span className="sr-only">Toggle sidebar</span>
      </Button>

      {/* Overlay for mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-screen bg-background border-r z-40 transition-all duration-300 ease-in-out",
          isOpen ? "w-64" : "w-20",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo and toggle */}
          <div className="flex items-center justify-between p-4 border-b">
            {isOpen && (
              <h1 className="text-xl font-bold whitespace-nowrap">Admin Panel</h1>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="hidden lg:flex"
            >
              {isOpen ? (
                <ChevronLeft className="w-5 h-5" />
              ) : (
                <ChevronRight className="w-5 h-5" />
              )}
              <span className="sr-only">Toggle sidebar</span>
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Button
                    asChild
                    variant={
                      location.pathname.endsWith(item.path) ? "secondary" : "ghost"
                    }
                    className={cn(
                      "w-full justify-start gap-3",
                      !isOpen && "justify-center"
                    )}
                  >
                    <Link 
                      to={item.path}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex items-center",
                        !isOpen ? "px-0" : "px-4"
                      )}
                    >
                      {item.icon}
                      {isOpen && <span className="ml-2">{item.name}</span>}
                    </Link>
                  </Button>
                </li>
              ))}
            </ul>
          </nav>

          {/* User section */}
          <div className="p-4 border-t">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
                <Users className="w-4 h-4" />
              </div>
              {isOpen && (
                <div className="truncate">
                  <p className="font-medium">Admin User</p>
                  <p className="text-xs text-muted-foreground">admin@example.com</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}