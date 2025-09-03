import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Warehouse, 
  BarChart3, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Cross
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AdminSidebarProps {
  className?: string;
}

export function AdminSidebar({ className }: AdminSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const menuItems = [
    { 
      name: 'Dashboard', 
      href: '/admin', 
      icon: LayoutDashboard,
      exact: true
    },
    { 
      name: 'Products', 
      href: '/admin/products', 
      icon: Package 
    },
    { 
      name: 'Orders', 
      href: '/admin/orders', 
      icon: ShoppingCart 
    },
    { 
      name: 'Customers', 
      href: '/admin/customers', 
      icon: Users 
    },
    { 
      name: 'Inventory', 
      href: '/admin/inventory', 
      icon: Warehouse 
    },
    { 
      name: 'Reports', 
      href: '/admin/reports', 
      icon: BarChart3 
    },
    { 
      name: 'Settings', 
      href: '/admin/settings', 
      icon: Settings 
    },
  ];

  const isActive = (href: string, exact?: boolean) => {
    if (exact) {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className={cn(
      "bg-surface border-r border-border h-screen flex flex-col transition-all duration-300 ease-smooth",
      collapsed ? "w-16" : "w-64",
      className
    )}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Cross className="text-white w-5 h-5" />
              </div>
              <div>
                <h2 className="font-heading text-lg font-bold text-primary">
                  Gacinia Admin
                </h2>
                <p className="text-xs text-muted-foreground">
                  Management Portal
                </p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className="ml-auto"
          >
            {collapsed ? (
              <ChevronRight size={16} />
            ) : (
              <ChevronLeft size={16} />
            )}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.href}
                className={({ isActive: linkActive }) => cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  (linkActive && item.exact) || (isActive(item.href, item.exact))
                    ? "bg-primary text-primary-foreground" 
                    : "text-foreground hover:bg-muted hover:text-primary",
                  collapsed && "justify-center"
                )}
                title={collapsed ? item.name : undefined}
              >
                <item.icon size={20} className="flex-shrink-0" />
                {!collapsed && <span>{item.name}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Info */}
      <div className="p-4 border-t border-border">
        {!collapsed ? (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">A</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                Admin User
              </p>
              <p className="text-xs text-muted-foreground truncate">
                admin@gacinia.co.tz
              </p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">A</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}