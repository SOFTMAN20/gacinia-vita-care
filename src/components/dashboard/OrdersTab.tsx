import { useState } from 'react';
import { useUserOrders, OrderWithItems } from '@/hooks/useUserDashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { 
  Package, 
  Search, 
  Filter, 
  Download, 
  RefreshCw,
  Truck,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';

export const OrdersTab = () => {
  const { data: orders = [], isLoading, refetch } = useUserOrders();
  const { addItem } = useCart();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-500 hover:bg-green-600';
      case 'shipped':
        return 'bg-blue-500 hover:bg-blue-600';
      case 'processing':
        return 'bg-yellow-500 hover:bg-yellow-600';
      case 'confirmed':
        return 'bg-purple-500 hover:bg-purple-600';
      case 'pending':
        return 'bg-orange-500 hover:bg-orange-600';
      case 'cancelled':
        return 'bg-red-500 hover:bg-red-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="w-4 h-4" />;
      case 'shipped':
        return <Truck className="w-4 h-4" />;
      case 'processing':
      case 'confirmed':
        return <Package className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = searchQuery === '' || 
      order.order_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleReorder = async (order: OrderWithItems) => {
    try {
      for (const item of order.order_items) {
        await addItem(item.product as any, item.quantity);
      }
      toast({
        title: "Success",
        description: "Items added to cart for reorder",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add items to cart",
        variant: "destructive",
      });
    }
  };

  const handleDownloadInvoice = (orderId: string) => {
    // TODO: Implement invoice download
    toast({
      title: "Info",
      description: "Invoice download feature coming soon",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Package className="h-12 w-12 animate-pulse mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search orders by number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => refetch()}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No orders found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : "You haven't placed any orders yet"
                }
              </p>
              {!searchQuery && statusFilter === 'all' && (
                <Button asChild>
                  <a href="/products">Start Shopping</a>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-lg">
                      {order.order_number || `Order #${order.id.slice(0, 8)}`}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Placed on {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={`${getStatusColor(order.status)} text-white`}>
                      {getStatusIcon(order.status)}
                      <span className="ml-1 capitalize">{order.status}</span>
                    </Badge>
                    <Badge variant="outline">
                      {order.payment_status.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Order Items */}
                  <div className="space-y-2">
                    {order.order_items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between py-2">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center">
                            <Package className="w-6 h-6 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="font-medium">{item.product.name}</p>
                            <p className="text-sm text-muted-foreground">
                              Quantity: {item.quantity}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">TZS {item.total_price.toLocaleString()}</p>
                          <p className="text-sm text-muted-foreground">
                            TZS {item.unit_price.toLocaleString()} each
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Order Summary */}
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">
                        Subtotal: TZS {order.subtotal.toLocaleString()}
                      </p>
                      {order.tax_amount > 0 && (
                        <p className="text-sm text-muted-foreground">
                          Tax: TZS {order.tax_amount.toLocaleString()}
                        </p>
                      )}
                      {order.delivery_fee > 0 && (
                        <p className="text-sm text-muted-foreground">
                          Delivery: TZS {order.delivery_fee.toLocaleString()}
                        </p>
                      )}
                      {order.discount_amount > 0 && (
                        <p className="text-sm text-green-600">
                          Discount: -TZS {order.discount_amount.toLocaleString()}
                        </p>
                      )}
                      <p className="font-semibold">
                        Total: TZS {order.total_amount.toLocaleString()}
                      </p>
                    </div>

                    <div className="flex flex-col md:flex-row gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadInvoice(order.id)}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Invoice
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReorder(order)}
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Reorder
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};