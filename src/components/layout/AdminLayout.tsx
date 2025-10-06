import { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { 
  Search, 
  Settings,
  User,
  LogOut,
  Menu,
  X,
  Store,
  Package,
  ShoppingCart,
  Users as UsersIcon,
  Loader2,
  ArrowRight
} from 'lucide-react';
import { NotificationCenter } from '@/components/ui/notification-center';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';

interface AdminLayoutProps {
  children?: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, profile } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  // Global search with Cmd/Ctrl + K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Perform search
  useEffect(() => {
    const performSearch = async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        return;
      }

      setSearching(true);
      try {
        const query = searchQuery.toLowerCase();

        // Search products
        const { data: products } = await supabase
          .from('products')
          .select('id, name, sku, price, stock_count')
          .or(`name.ilike.%${query}%,sku.ilike.%${query}%`)
          .limit(5);

        // Search orders
        const { data: orders } = await supabase
          .from('orders')
          .select('id, order_number, total_amount, status, profiles(full_name)')
          .or(`order_number.ilike.%${query}%`)
          .limit(5);

        // Search customers
        const { data: customers } = await supabase
          .from('profiles')
          .select('id, full_name, phone, username')
          .or(`full_name.ilike.%${query}%,phone.ilike.%${query}%,username.ilike.%${query}%`)
          .limit(5);

        const results = [
          ...(products || []).map(p => ({ type: 'product', data: p })),
          ...(orders || []).map(o => ({ type: 'order', data: o })),
          ...(customers || []).map(c => ({ type: 'customer', data: c })),
        ];

        setSearchResults(results);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setSearching(false);
      }
    };

    const debounce = setTimeout(performSearch, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery]);

  const handleResultClick = (result: any) => {
    setSearchOpen(false);
    setSearchQuery('');
    
    if (result.type === 'product') {
      navigate(`/admin/products`);
    } else if (result.type === 'order') {
      navigate(`/admin/orders`);
    } else if (result.type === 'customer') {
      navigate(`/admin/customers`);
    }
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'product':
        return <Package className="w-4 h-4" />;
      case 'order':
        return <ShoppingCart className="w-4 h-4" />;
      case 'customer':
        return <UsersIcon className="w-4 h-4" />;
      default:
        return <Search className="w-4 h-4" />;
    }
  };

  const getResultLabel = (result: any) => {
    if (result.type === 'product') {
      return result.data.name;
    } else if (result.type === 'order') {
      return result.data.order_number || `Order #${result.data.id.slice(-8)}`;
    } else if (result.type === 'customer') {
      return result.data.full_name || result.data.username;
    }
    return '';
  };

  const getResultSubtext = (result: any) => {
    if (result.type === 'product') {
      return `SKU: ${result.data.sku || 'N/A'} • Stock: ${result.data.stock_count} • TSh ${result.data.price.toLocaleString()}`;
    } else if (result.type === 'order') {
      return `${result.data.profiles?.full_name || 'Unknown'} • TSh ${result.data.total_amount.toLocaleString()} • ${result.data.status}`;
    } else if (result.type === 'customer') {
      return result.data.phone || result.data.username || 'No contact info';
    }
    return '';
  };

  // Generate breadcrumbs based on current path
  const generateBreadcrumbs = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs = [];

    // Add admin root
    breadcrumbs.push({
      label: 'Admin',
      href: '/admin',
      current: pathSegments.length === 1
    });

    // Add sub-pages
    if (pathSegments.length > 1) {
      const subPage = pathSegments[1];
      const pageLabels: Record<string, string> = {
        'products': 'Products',
        'orders': 'Orders',
        'customers': 'Customers',
        'inventory': 'Inventory',
        'reports': 'Reports',
        'settings': 'Settings'
      };

      breadcrumbs.push({
        label: pageLabels[subPage] || subPage,
        href: `/admin/${subPage}`,
        current: true
      });
    }

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <div className="min-h-screen bg-background">
      <div className="flex w-full">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div className={`
          fixed inset-y-0 left-0 z-50 lg:relative lg:z-auto
          transform transition-transform duration-300 ease-in-out lg:transform-none
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <AdminSidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Header */}
          <header className="bg-surface border-b border-border h-16 flex items-center justify-between px-4 lg:px-6">
            <div className="flex items-center gap-4">
              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </Button>

              {/* Breadcrumbs */}
              <Breadcrumb className="hidden sm:flex">
                <BreadcrumbList>
                  {breadcrumbs.map((crumb, index) => (
                    <div key={crumb.href} className="flex items-center">
                      {index > 0 && <BreadcrumbSeparator />}
                      <BreadcrumbItem>
                        {crumb.current ? (
                          <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink href={crumb.href}>
                            {crumb.label}
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                    </div>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="hidden md:flex relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search... (Ctrl+K)"
                  className="pl-10 pr-4 cursor-pointer"
                  onClick={() => setSearchOpen(true)}
                  readOnly
                />
                <kbd className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                  <span className="text-xs">⌘</span>K
                </kbd>
              </div>

              {/* Notifications */}
              <NotificationCenter />

              {/* Admin User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">A</span>
                    </div>
                    <div className="hidden sm:block text-left">
                      <p className="text-sm font-medium">{profile?.full_name || 'Admin User'}</p>
                      <p className="text-xs text-muted-foreground">{profile?.role || 'Administrator'}</p>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={() => navigate('/')}>
                    <Store className="w-4 h-4 mr-2" />
                    View Store
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                    <User className="w-4 h-4 mr-2" />
                    My Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/admin/settings')}>
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive" onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 p-4 lg:p-6 overflow-auto">
            {children || <Outlet />}
          </main>
        </div>
      </div>

      {/* Global Search Dialog */}
      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="sm:max-w-2xl p-0">
          <DialogHeader className="px-4 pt-4 pb-0">
            <DialogTitle className="sr-only">Search</DialogTitle>
          </DialogHeader>
          <div className="flex items-center border-b px-4 pb-4">
            <Search className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
            <Input
              placeholder="Search products, orders, customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              autoFocus
            />
            {searching && <Loader2 className="ml-2 h-4 w-4 animate-spin text-muted-foreground" />}
          </div>
          <ScrollArea className="max-h-[400px]">
            {searchQuery && searchResults.length === 0 && !searching && (
              <div className="py-6 text-center text-sm text-muted-foreground">
                No results found for "{searchQuery}"
              </div>
            )}
            {searchResults.length > 0 && (
              <div className="p-2">
                {searchResults.map((result, index) => (
                  <button
                    key={`${result.type}-${result.data.id}-${index}`}
                    onClick={() => handleResultClick(result)}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left hover:bg-accent transition-colors"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted">
                      {getResultIcon(result.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium truncate">
                          {getResultLabel(result)}
                        </p>
                        <Badge variant="outline" className="text-xs capitalize">
                          {result.type}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {getResultSubtext(result)}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </button>
                ))}
              </div>
            )}
            {!searchQuery && (
              <div className="p-4 space-y-4">
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">Quick Actions</p>
                  <div className="space-y-1">
                    <button
                      onClick={() => {
                        setSearchOpen(false);
                        navigate('/admin/products');
                      }}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left hover:bg-accent transition-colors"
                    >
                      <Package className="h-4 w-4" />
                      <span className="text-sm">View All Products</span>
                    </button>
                    <button
                      onClick={() => {
                        setSearchOpen(false);
                        navigate('/admin/orders');
                      }}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left hover:bg-accent transition-colors"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      <span className="text-sm">View All Orders</span>
                    </button>
                    <button
                      onClick={() => {
                        setSearchOpen(false);
                        navigate('/admin/customers');
                      }}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left hover:bg-accent transition-colors"
                    >
                      <UsersIcon className="h-4 w-4" />
                      <span className="text-sm">View All Customers</span>
                    </button>
                  </div>
                </div>
                <div className="pt-2 border-t">
                  <p className="text-xs text-muted-foreground">
                    <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium">
                      ⌘K
                    </kbd>{' '}
                    to open search •{' '}
                    <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium">
                      ESC
                    </kbd>{' '}
                    to close
                  </p>
                </div>
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}