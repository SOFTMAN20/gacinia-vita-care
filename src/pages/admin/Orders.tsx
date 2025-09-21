import { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Truck,
  Package,
  Calendar,
  DollarSign,
  MoreHorizontal,
  Loader2
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAdminOrders, type AdminOrder } from '@/hooks/useAdminOrders';
import OrderDetail from '@/components/admin/OrderDetail';


const statusConfig = {
  pending: { label: 'Pending', variant: 'secondary' as const, icon: Clock },
  confirmed: { label: 'Confirmed', variant: 'default' as const, icon: CheckCircle },
  processing: { label: 'Processing', variant: 'default' as const, icon: Package },
  shipped: { label: 'Shipped', variant: 'default' as const, icon: Truck },
  delivered: { label: 'Delivered', variant: 'default' as const, icon: CheckCircle },
  cancelled: { label: 'Cancelled', variant: 'destructive' as const, icon: XCircle }
};

const paymentStatusConfig = {
  pending: { label: 'Pending', variant: 'secondary' as const },
  paid: { label: 'Paid', variant: 'default' as const },
  failed: { label: 'Failed', variant: 'destructive' as const },
  refunded: { label: 'Refunded', variant: 'outline' as const },
  cash_on_delivery: { label: 'Cash on Delivery', variant: 'outline' as const }
};

export default function OrdersPage() {
  const { orders, loading, error, updateOrderStatus } = useAdminOrders();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [showOrderDetail, setShowOrderDetail] = useState(false);

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const customerName = order.profiles?.full_name || 'Unknown Customer';
      const orderNumber = order.order_number || '';
      
      const matchesSearch = orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           customerName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      const matchesPayment = paymentFilter === 'all' || order.payment_status === paymentFilter;
      
      return matchesSearch && matchesStatus && matchesPayment;
    });
  }, [orders, searchTerm, statusFilter, paymentFilter]);

  const handleStatusUpdate = (orderId: string, newStatus: AdminOrder['status']) => {
    updateOrderStatus(orderId, newStatus);
  };

  const handleViewDetails = (orderId: string) => {
    setSelectedOrderId(orderId);
    setShowOrderDetail(true);
  };

  const handleBackToOrders = () => {
    setSelectedOrderId(null);
    setShowOrderDetail(false);
  };

  const handleExport = () => {
    const csvHeaders = [
      'Order #',
      'Customer',
      'Items',
      'Status',
      'Payment Status',
      'Total (TSh)',
      'Date',
      'Customer Phone',
      'Delivery Address'
    ];

    const csvData = filteredOrders.map(order => {
      const deliveryAddress = typeof order.delivery_address === 'object' ? order.delivery_address : null;
      const customerName = deliveryAddress?.fullName || 
                         order.profiles?.full_name || 
                         `User ID: ${order.user_id}`;
      const customerPhone = deliveryAddress?.phone || order.profiles?.phone || '';
      const fullAddress = deliveryAddress ? 
        `${deliveryAddress.address || ''}, ${deliveryAddress.city || ''}` : '';
      
      return [
        order.order_number || `ORD-${order.id.slice(-8)}`,
        customerName,
        order.order_items?.length || 0,
        order.status,
        order.payment_status,
        order.total_amount,
        new Date(order.created_at).toLocaleDateString(),
        customerPhone,
        fullAddress
      ];
    });

    const csvContent = [csvHeaders, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `gacinia-orders-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalRevenue = orders.reduce((sum, order) => sum + order.total_amount, 0);
  const todayOrders = orders.filter(order => {
    const today = new Date().toDateString();
    const orderDate = new Date(order.created_at).toDateString();
    return today === orderDate;
  }).length;

  const OrdersTable = () => (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Orders Management</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-64"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Payment" />
                  </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Payments</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
                </Select>
                <Button variant="outline" className="touch-target" onClick={handleExport}>
                  <Download className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Export</span>
                </Button>
              </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-3 sm:p-6">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            <span>Loading orders...</span>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-destructive">Error loading orders: {error}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order #</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      No orders found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order) => {
                    const StatusIcon = statusConfig[order.status].icon;
                    
                    // Get customer name from delivery address (checkout form) first, then fallback to profile
                    const deliveryAddress = typeof order.delivery_address === 'object' ? order.delivery_address : null;
                    const customerName = deliveryAddress?.fullName || 
                                       order.profiles?.full_name || 
                                       `User ID: ${order.user_id}`;
                    const customerPhone = deliveryAddress?.phone || 
                                        order.profiles?.phone || '';
                    const customerEmail = deliveryAddress?.email || '';
                    const itemsCount = order.order_items?.length || 0;
                    
                    return (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.order_number}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{customerName}</div>
                            {customerPhone && (
                              <div className="text-sm text-muted-foreground">{customerPhone}</div>
                            )}
                            {customerEmail && (
                              <div className="text-sm text-muted-foreground">{customerEmail}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {itemsCount} item{itemsCount !== 1 ? 's' : ''}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={statusConfig[order.status].variant} className="flex items-center gap-1 w-fit">
                            <StatusIcon className="w-3 h-3" />
                            {statusConfig[order.status].label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={paymentStatusConfig[order.payment_status].variant}>
                            {paymentStatusConfig[order.payment_status].label}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">
                          TSh {order.total_amount.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          {new Date(order.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewDetails(order.id)}>
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleStatusUpdate(order.id, 'confirmed')}
                                disabled={order.status !== 'pending'}
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Confirm Order
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleStatusUpdate(order.id, 'processing')}
                                disabled={order.status !== 'confirmed'}
                              >
                                <Package className="w-4 h-4 mr-2" />
                                Start Processing
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleStatusUpdate(order.id, 'shipped')}
                                disabled={order.status !== 'processing'}
                              >
                                <Truck className="w-4 h-4 mr-2" />
                                Mark as Shipped
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleStatusUpdate(order.id, 'delivered')}
                                disabled={order.status !== 'shipped'}
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Mark as Delivered
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleStatusUpdate(order.id, 'cancelled')}
                                disabled={['delivered', 'cancelled'].includes(order.status)}
                              >
                                <XCircle className="w-4 h-4 mr-2" />
                                Cancel Order
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const OrderAnalytics = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.length}</div>
            <p className="text-xs text-muted-foreground">
              +{todayOrders} today
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">TSh {totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <Clock className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {orders.filter(o => o.status === 'pending').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Needs attention
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivered Orders</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {orders.filter(o => o.status === 'delivered').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Success rate: 95%
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Order Status Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(statusConfig).map(([status, config]) => {
              const count = orders.filter(o => o.status === status).length;
              const percentage = orders.length > 0 ? (count / orders.length) * 100 : 0;
              
              return (
                <div key={status} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <config.icon className="w-4 h-4" />
                    <span className="capitalize">{config.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground w-12 text-right">
                      {count} ({percentage.toFixed(0)}%)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Show order detail view if an order is selected
  if (showOrderDetail && selectedOrderId) {
    return <OrderDetail orderId={selectedOrderId} onBack={handleBackToOrders} />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Orders Management</h2>
        <p className="text-muted-foreground">
          Process and track customer orders
        </p>
      </div>

      <Tabs defaultValue="orders" className="space-y-4">
        <TabsList>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="orders">
          <OrdersTable />
        </TabsContent>
        
        <TabsContent value="analytics">
          <OrderAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
}