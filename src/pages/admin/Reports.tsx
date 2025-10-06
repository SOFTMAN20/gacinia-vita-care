import { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  TrendingDown,
  DollarSign, 
  ShoppingCart, 
  Package, 
  Users,
  Calendar,
  Download,
  Filter,
  BarChart3,
  PieChart,
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useReportsData } from '@/hooks/useReportsData';

type DateRange = '7days' | '30days' | '90days' | 'year' | 'all';

export default function Reports() {
  const [dateRange, setDateRange] = useState<DateRange>('30days');
  const { 
    salesMetrics, 
    productMetrics, 
    customerMetrics,
    topProducts,
    topCategories,
    recentOrders,
    loading 
  } = useReportsData(dateRange);

  const dateRangeLabels = {
    '7days': 'Last 7 Days',
    '30days': 'Last 30 Days',
    '90days': 'Last 90 Days',
    'year': 'This Year',
    'all': 'All Time'
  };

  const handleExportReport = () => {
    const reportData = {
      dateRange: dateRangeLabels[dateRange],
      generatedAt: new Date().toISOString(),
      salesMetrics,
      productMetrics,
      customerMetrics,
      topProducts,
      topCategories
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `pharmacy-report-${dateRange}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const MetricCard = ({ 
    title, 
    value, 
    change, 
    icon: Icon, 
    trend,
    prefix = '',
    suffix = ''
  }: { 
    title: string;
    value: string | number;
    change?: number;
    icon: any;
    trend?: 'up' | 'down';
    prefix?: string;
    suffix?: string;
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-primary" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
        </div>
        {change !== undefined && (
          <div className="flex items-center gap-1 text-xs mt-1">
            {trend === 'up' ? (
              <>
                <ArrowUpRight className="h-3 w-3 text-success" />
                <span className="text-success">+{change.toFixed(1)}%</span>
              </>
            ) : (
              <>
                <ArrowDownRight className="h-3 w-3 text-destructive" />
                <span className="text-destructive">{change.toFixed(1)}%</span>
              </>
            )}
            <span className="text-muted-foreground">vs previous period</span>
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-2">
            <Activity className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading reports...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold">Reports & Analytics</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Comprehensive insights into your pharmacy performance
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Select value={dateRange} onValueChange={(value) => setDateRange(value as DateRange)}>
            <SelectTrigger className="w-full sm:w-40">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="90days">Last 90 Days</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleExportReport} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Revenue"
          value={salesMetrics.totalRevenue}
          change={salesMetrics.revenueChange}
          trend={salesMetrics.revenueChange >= 0 ? 'up' : 'down'}
          icon={DollarSign}
          prefix="TSh "
        />
        <MetricCard
          title="Total Orders"
          value={salesMetrics.totalOrders}
          change={salesMetrics.ordersChange}
          trend={salesMetrics.ordersChange >= 0 ? 'up' : 'down'}
          icon={ShoppingCart}
        />
        <MetricCard
          title="Average Order Value"
          value={salesMetrics.averageOrderValue}
          change={salesMetrics.aovChange}
          trend={salesMetrics.aovChange >= 0 ? 'up' : 'down'}
          icon={TrendingUp}
          prefix="TSh "
        />
        <MetricCard
          title="Active Customers"
          value={customerMetrics.activeCustomers}
          change={customerMetrics.customerGrowth}
          trend={customerMetrics.customerGrowth >= 0 ? 'up' : 'down'}
          icon={Users}
        />
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Sales Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Sales Performance
                </CardTitle>
                <CardDescription>Revenue breakdown by status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <span className="text-sm">Completed Orders</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">
                        TSh {salesMetrics.completedRevenue.toLocaleString()}
                      </span>
                      <Badge variant="default">{salesMetrics.completedOrders}</Badge>
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-success h-2 rounded-full" 
                      style={{ 
                        width: `${(salesMetrics.completedRevenue / salesMetrics.totalRevenue) * 100}%` 
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-warning" />
                      <span className="text-sm">Pending Orders</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">
                        TSh {salesMetrics.pendingRevenue.toLocaleString()}
                      </span>
                      <Badge variant="secondary">{salesMetrics.pendingOrders}</Badge>
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-warning h-2 rounded-full" 
                      style={{ 
                        width: `${(salesMetrics.pendingRevenue / salesMetrics.totalRevenue) * 100}%` 
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-destructive" />
                      <span className="text-sm">Cancelled Orders</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">
                        TSh {salesMetrics.cancelledRevenue.toLocaleString()}
                      </span>
                      <Badge variant="destructive">{salesMetrics.cancelledOrders}</Badge>
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-destructive h-2 rounded-full" 
                      style={{ 
                        width: `${(salesMetrics.cancelledRevenue / salesMetrics.totalRevenue) * 100}%` 
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top Categories */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Top Categories
                </CardTitle>
                <CardDescription>Best performing product categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topCategories.slice(0, 5).map((category, index) => (
                    <div key={category.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{category.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {category.productCount} products
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">TSh {category.revenue.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">{category.orders} orders</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Orders Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders Activity</CardTitle>
              <CardDescription>Latest transactions in your pharmacy</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentOrders.slice(0, 5).map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col">
                        <span className="font-medium">{order.orderNumber}</span>
                        <span className="text-sm text-muted-foreground">{order.customerName}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={
                        order.status === 'delivered' ? 'default' :
                        order.status === 'cancelled' ? 'destructive' : 'secondary'
                      }>
                        {order.status}
                      </Badge>
                      <span className="font-semibold">TSh {order.amount.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Products Tab */}
        <TabsContent value="products" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MetricCard
              title="Total Products"
              value={productMetrics.totalProducts}
              icon={Package}
            />
            <MetricCard
              title="Active Products"
              value={productMetrics.activeProducts}
              icon={CheckCircle}
            />
            <MetricCard
              title="Low Stock Items"
              value={productMetrics.lowStockProducts}
              icon={AlertCircle}
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Top Selling Products</CardTitle>
              <CardDescription>Best performers in {dateRangeLabels[dateRange].toLowerCase()}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div key={product.id} className="flex items-center gap-4 p-3 border rounded-lg">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-bold">
                      {index + 1}
                    </div>
                    {product.imageUrl && (
                      <img 
                        src={product.imageUrl} 
                        alt={product.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <p className="font-medium">{product.name}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{product.category}</span>
                        <span>•</span>
                        <span>{product.unitsSold} units sold</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">TSh {product.revenue.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">
                        TSh {product.price.toLocaleString()} each
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Customers Tab */}
        <TabsContent value="customers" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MetricCard
              title="Total Customers"
              value={customerMetrics.totalCustomers}
              change={customerMetrics.customerGrowth}
              trend={customerMetrics.customerGrowth >= 0 ? 'up' : 'down'}
              icon={Users}
            />
            <MetricCard
              title="New Customers"
              value={customerMetrics.newCustomers}
              icon={Users}
            />
            <MetricCard
              title="Repeat Customers"
              value={customerMetrics.repeatCustomers}
              icon={Users}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Customer Insights</CardTitle>
                <CardDescription>Understanding your customer base</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="text-sm font-medium">Average Orders per Customer</span>
                  <span className="text-lg font-bold">{customerMetrics.avgOrdersPerCustomer.toFixed(1)}</span>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="text-sm font-medium">Customer Retention Rate</span>
                  <span className="text-lg font-bold">{customerMetrics.retentionRate.toFixed(1)}%</span>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="text-sm font-medium">Average Customer Lifetime Value</span>
                  <span className="text-lg font-bold">TSh {customerMetrics.avgLifetimeValue.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Customer Distribution</CardTitle>
                <CardDescription>Breakdown by order frequency</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">First-time Buyers</span>
                    <Badge variant="secondary">{customerMetrics.firstTimeBuyers}</Badge>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ 
                        width: `${(customerMetrics.firstTimeBuyers / customerMetrics.totalCustomers) * 100}%` 
                      }}
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Repeat Customers</span>
                    <Badge variant="default">{customerMetrics.repeatCustomers}</Badge>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-success h-2 rounded-full" 
                      style={{ 
                        width: `${(customerMetrics.repeatCustomers / customerMetrics.totalCustomers) * 100}%` 
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Inventory Tab */}
        <TabsContent value="inventory" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <MetricCard
              title="Total Inventory Value"
              value={productMetrics.totalInventoryValue}
              icon={DollarSign}
              prefix="TSh "
            />
            <MetricCard
              title="In Stock Products"
              value={productMetrics.inStockProducts}
              icon={CheckCircle}
            />
            <MetricCard
              title="Out of Stock"
              value={productMetrics.outOfStockProducts}
              icon={AlertCircle}
            />
            <MetricCard
              title="Low Stock Alerts"
              value={productMetrics.lowStockProducts}
              icon={AlertCircle}
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Inventory Health</CardTitle>
              <CardDescription>Stock status overview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg bg-success/5">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-success" />
                    <div>
                      <p className="font-medium">Well Stocked</p>
                      <p className="text-sm text-muted-foreground">Products above minimum level</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold">{productMetrics.wellStockedProducts}</span>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg bg-warning/5">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="h-5 w-5 text-warning" />
                    <div>
                      <p className="font-medium">Low Stock</p>
                      <p className="text-sm text-muted-foreground">Below minimum stock level</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold">{productMetrics.lowStockProducts}</span>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg bg-destructive/5">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="h-5 w-5 text-destructive" />
                    <div>
                      <p className="font-medium">Out of Stock</p>
                      <p className="text-sm text-muted-foreground">Requires immediate restocking</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold">{productMetrics.outOfStockProducts}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
