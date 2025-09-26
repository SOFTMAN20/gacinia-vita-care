import { useState } from 'react';
import { 
  Users, 
  Package, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  Plus,
  ExternalLink,
  RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import ProductForm from '@/components/admin/ProductForm';
import { useAdminDashboard } from '@/hooks/useAdminDashboard';
import { useLowStockAlerts, type LowStockProduct } from '@/hooks/useLowStockAlerts';
import { RestockDialog } from '@/components/admin/RestockDialog';

// Mock data for admin dashboard
const dashboardData = {
  kpis: [
    {
      title: 'Total Revenue',
      value: 'TSh 2,450,000',
      change: '+12.5%',
      icon: DollarSign,
      trend: 'up'
    },
    {
      title: 'Orders Today',
      value: '43',
      change: '+8.2%',
      icon: ShoppingCart,
      trend: 'up'
    },
    {
      title: 'Active Customers',
      value: '1,247',
      change: '+15.3%',
      icon: Users,
      trend: 'up'
    },
    {
      title: 'Products',
      value: '856',
      change: '+5.1%',
      icon: Package,
      trend: 'up'
    }
  ],
  recentOrders: [
    {
      id: 'ORD-001',
      customer: 'John Mwangi',
      amount: 'TSh 45,000',
      status: 'pending',
      date: '2024-01-10'
    },
    {
      id: 'ORD-002', 
      customer: 'Mary Kassim',
      amount: 'TSh 78,500',
      status: 'confirmed',
      date: '2024-01-10'
    },
    {
      id: 'ORD-003',
      customer: 'Peter Mgoma',
      amount: 'TSh 32,000',
      status: 'shipped',
      date: '2024-01-09'
    },
    {
      id: 'ORD-004',
      customer: 'Grace Mduma',
      amount: 'TSh 156,000',
      status: 'delivered',
      date: '2024-01-09'
    },
    {
      id: 'ORD-005',
      customer: 'James Kileo',
      amount: 'TSh 89,000',
      status: 'cancelled',
      date: '2024-01-08'
    }
  ],
  lowStockAlerts: [
    { name: 'Panadol Extra', current: 8, minimum: 20, category: 'Pain Relief' },
    { name: 'Blood Pressure Monitor', current: 2, minimum: 5, category: 'Equipment' },
    { name: 'Amoxicillin 500mg', current: 15, minimum: 50, category: 'Antibiotics' },
    { name: 'Vitamin C Tablets', current: 12, minimum: 30, category: 'Supplements' }
  ],
  pendingPrescriptions: [
    { id: 'RX-001', patient: 'Ahmed Hassan', medication: 'Insulin Glargine', submitted: '2 hours ago' },
    { id: 'RX-002', patient: 'Fatuma Ally', medication: 'Metformin 850mg', submitted: '4 hours ago' },
    { id: 'RX-003', patient: 'Robert Mushi', medication: 'Lisinopril 10mg', submitted: '6 hours ago' }
  ]
};

const getStatusBadge = (status: string) => {
  const statusConfig = {
    pending: { label: 'Pending', variant: 'secondary' as const, icon: Clock },
    confirmed: { label: 'Confirmed', variant: 'default' as const, icon: CheckCircle },
    shipped: { label: 'Shipped', variant: 'default' as const, icon: TrendingUp },
    delivered: { label: 'Delivered', variant: 'default' as const, icon: CheckCircle },
    cancelled: { label: 'Cancelled', variant: 'destructive' as const, icon: XCircle }
  };
  
  const config = statusConfig[status as keyof typeof statusConfig];
  const Icon = config.icon;
  
  return (
    <Badge variant={config.variant} className="flex items-center gap-1">
      <Icon size={12} />
      {config.label}
    </Badge>
  );
};

// Low Stock Alerts Component
const LowStockAlertsSection = () => {
  const { lowStockProducts, loading, error, refetch } = useLowStockAlerts();
  const [selectedProduct, setSelectedProduct] = useState<LowStockProduct | null>(null);
  const [restockDialogOpen, setRestockDialogOpen] = useState(false);

  const handleRestockClick = (product: LowStockProduct) => {
    setSelectedProduct(product);
    setRestockDialogOpen(true);
  };

  const handleRestockSuccess = () => {
    refetch();
    setSelectedProduct(null);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-warning">
            <AlertTriangle size={20} />
            Low Stock Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-4">
            <RefreshCw className="h-4 w-4 animate-spin mr-2" />
            Loading alerts...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-destructive">
              <AlertTriangle size={20} />
              Low Stock Alerts
            </div>
            <Button variant="outline" size="sm" onClick={refetch}>
              <RefreshCw className="h-4 w-4 mr-1" />
              Retry
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive text-center py-4">
            Failed to load low stock alerts. Please try again.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-warning">
            <AlertTriangle size={20} />
            Low Stock Alerts
            {lowStockProducts.length > 0 && (
              <Badge variant="destructive" className="ml-2">
                {lowStockProducts.length}
              </Badge>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={refetch}>
              <RefreshCw className="h-4 w-4 mr-1" />
              Refresh
            </Button>
            <Button variant="outline" size="sm">
              <ExternalLink className="h-4 w-4 mr-1" />
              View All
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {lowStockProducts.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="h-12 w-12 text-success mx-auto mb-2" />
            <p className="text-lg font-medium text-success">All products are well stocked!</p>
            <p className="text-muted-foreground">No low stock alerts at this time.</p>
          </div>
        ) : (
          <div className="space-y-4 overflow-hidden">
            {lowStockProducts.slice(0, 5).map((product) => (
              <div 
                key={product.id}
                className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 border rounded-lg bg-card hover:bg-accent/50 transition-colors min-w-0"
              >
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  <div className="relative flex-shrink-0">
                    {product.image_url ? (
                      <img 
                        src={product.image_url} 
                        alt={product.name}
                        className="h-12 w-12 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
                        <Package className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                    {product.stock_count === 0 && (
                      <div className="absolute -top-1 -right-1 h-4 w-4 bg-destructive rounded-full flex items-center justify-center">
                        <span className="text-[10px] text-destructive-foreground font-bold">!</span>
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-medium truncate">{product.name}</h4>
                    <div className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
                      {product.sku && <span className="truncate">SKU: {product.sku}</span>}
                      {product.category_name && (
                        <>
                          <span className="hidden sm:inline">•</span>
                          <span className="truncate">{product.category_name}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
                  <div className="text-left sm:text-right flex-shrink-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium whitespace-nowrap">
                        Stock: {product.stock_count}
                      </span>
                      <Badge 
                        variant={product.stock_count === 0 ? "destructive" : "secondary"}
                        className="text-xs whitespace-nowrap"
                      >
                        {product.stock_count === 0 ? "OUT OF STOCK" : "LOW STOCK"}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Min: {product.min_stock_level}
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleRestockClick(product)}
                    className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100 w-full sm:w-auto flex-shrink-0"
                  >
                    Restock
                  </Button>
                </div>
              </div>
            ))}
            
            {lowStockProducts.length > 5 && (
              <div className="text-center pt-2">
                <Button variant="ghost" size="sm">
                  <ExternalLink className="h-4 w-4 mr-1" />
                  View {lowStockProducts.length - 5} more alerts
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
      
      <RestockDialog
        product={selectedProduct}
        open={restockDialogOpen}
        onOpenChange={setRestockDialogOpen}
        onSuccess={handleRestockSuccess}
      />
    </Card>
  );
};

export default function AdminDashboard() {
  const [showProductForm, setShowProductForm] = useState(false);
  const { data: dashboardData, loading, error } = useAdminDashboard();

  const handleProductSubmit = (data: Record<string, unknown> & { images: string[] }) => {
    console.log('Product submitted:', data);
    setShowProductForm(false);
    // Here you would typically make an API call to save the product
  };

  const handleProductCancel = () => {
    setShowProductForm(false);
  };

  // If product form is open, show it instead of dashboard
  if (showProductForm) {
    return (
      <ProductForm
        onSubmit={handleProductSubmit}
        onCancel={handleProductCancel}
        isLoading={false}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Dashboard Overview</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Welcome back, Admin. Here's what's happening with your pharmacy today.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-2">
          <Button onClick={() => setShowProductForm(true)} className="w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            <span className="sm:hidden">Add Product</span>
            <span className="hidden sm:inline">Add Product</span>
          </Button>
          <Button variant="outline" className="w-full sm:w-auto">
            <span className="sm:hidden">Reports</span>
            <span className="hidden sm:inline">View Reports</span>
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          // Loading skeleton
          Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="pharmacy-card animate-pulse">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 bg-muted rounded w-20"></div>
                <div className="h-4 w-4 bg-muted rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded w-16 mb-2"></div>
                <div className="h-4 bg-muted rounded w-24"></div>
              </CardContent>
            </Card>
          ))
        ) : error ? (
          <div className="col-span-4 text-center text-destructive p-4">
            Error loading dashboard data: {error}
          </div>
        ) : dashboardData ? (
          <>
            <Card className="pharmacy-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Revenue
                </CardTitle>
                <DollarSign className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  TSh {dashboardData.totalRevenue.toLocaleString()}
                </div>
                <p className="text-xs text-success flex items-center gap-1">
                  <TrendingUp size={12} />
                  All time
                </p>
              </CardContent>
            </Card>

            <Card className="pharmacy-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Orders Today
                </CardTitle>
                <ShoppingCart className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {dashboardData.ordersToday}
                </div>
                <p className="text-xs text-success flex items-center gap-1">
                  <TrendingUp size={12} />
                  Today's orders
                </p>
              </CardContent>
            </Card>

            <Card className="pharmacy-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Active Customers
                </CardTitle>
                <Users className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {dashboardData.activeCustomers}
                </div>
                <p className="text-xs text-success flex items-center gap-1">
                  <TrendingUp size={12} />
                  Total customers
                </p>
              </CardContent>
            </Card>

            <Card className="pharmacy-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Products
                </CardTitle>
                <Package className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {dashboardData.totalProducts}
                </div>
                <p className="text-xs text-success flex items-center gap-1">
                  <TrendingUp size={12} />
                  Active products
                </p>
              </CardContent>
            </Card>
          </>
        ) : null}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Recent Orders
              <Button variant="ghost" size="sm">View All</Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loading ? (
                // Loading skeleton for recent orders
                Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg animate-pulse">
                    <div className="flex-1">
                      <div className="h-4 bg-muted rounded w-20 mb-2"></div>
                      <div className="h-3 bg-muted rounded w-32 mb-1"></div>
                      <div className="h-3 bg-muted rounded w-24"></div>
                    </div>
                    <div className="h-4 bg-muted rounded w-16"></div>
                  </div>
                ))
              ) : error ? (
                <div className="text-center text-muted-foreground p-4">
                  Unable to load recent orders
                </div>
              ) : dashboardData?.recentOrders?.length ? (
                dashboardData.recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium text-foreground">{order.order_number}</p>
                        {getStatusBadge(order.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">{order.customer_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground">
                        TSh {order.total_amount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-muted-foreground p-4">
                  No recent orders found
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Alerts */}
        <LowStockAlertsSection />
      </div>

      {/* Pending Prescriptions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Pending Prescription Approvals
            <Badge variant="secondary">0</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground p-4">
            Prescription management feature coming soon
          </div>
        </CardContent>
      </Card>
    </div>
  );
}