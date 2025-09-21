import { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Printer, 
  Mail, 
  Truck, 
  CheckCircle, 
  XCircle, 
  Clock,
  Package,
  MapPin,
  Phone,
  CreditCard,
  Edit,
  Save,
  X
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAdminOrders, type AdminOrder } from '@/hooks/useAdminOrders';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface OrderDetailProps {
  orderId: string;
  onBack: () => void;
}

interface OrderItem {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  image?: string;
}

interface OrderData {
  id: string;
  orderNumber: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  deliveryAddress: {
    street: string;
    city: string;
    region: string;
    postalCode: string;
  };
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  createdAt: string;
  updatedAt: string;
  notes: string;
  trackingNumber?: string;
  statusHistory: Array<{
    status: string;
    timestamp: string;
    notes?: string;
  }>;
}



const statusConfig = {
  pending: { label: 'Pending', variant: 'secondary' as const, icon: Clock },
  confirmed: { label: 'Confirmed', variant: 'default' as const, icon: CheckCircle },
  processing: { label: 'Processing', variant: 'default' as const, icon: Package },
  shipped: { label: 'Shipped', variant: 'default' as const, icon: Truck },
  delivered: { label: 'Delivered', variant: 'default' as const, icon: CheckCircle },
  cancelled: { label: 'Cancelled', variant: 'destructive' as const, icon: XCircle }
};

export default function OrderDetail({ orderId, onBack }: OrderDetailProps) {
  const { updateOrderStatus } = useAdminOrders();
  const { toast } = useToast();
  const [order, setOrder] = useState<AdminOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notes, setNotes] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [isEditingPaymentStatus, setIsEditingPaymentStatus] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<AdminOrder['payment_status']>('pending');

  // Fetch order data on component mount and set up real-time subscription
  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('orders')
          .select(`
            *,
            profiles!orders_user_id_fkey (
              full_name,
              phone
            ),
            order_items (
              id,
              quantity,
              unit_price,
              total_price,
              products (
                id,
                name,
                image_url
              )
            )
          `)
          .eq('id', orderId)
          .single();

        if (fetchError) throw fetchError;

        setOrder(data);
        setNotes(data.notes || '');
        setPaymentStatus(data.payment_status || 'pending');
        
      } catch (err) {
        console.error('Error fetching order:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch order');
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrderData();

      // Set up real-time subscription for this specific order
      const channel = supabase
        .channel(`order-${orderId}`)
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'orders',
            filter: `id=eq.${orderId}`
          },
          (payload) => {
            console.log('Real-time order update received:', payload);
            
            // Update the order state with new data
            if (payload.new) {
              const oldPaymentStatus = order?.payment_status;
              const newPaymentStatus = payload.new.payment_status;
              
              setOrder(prev => prev ? { ...prev, ...payload.new } : null);
              setPaymentStatus(newPaymentStatus || 'pending');
              setNotes(payload.new.notes || '');
              
              // Show toast notification for payment status changes
              if (oldPaymentStatus && oldPaymentStatus !== newPaymentStatus) {
                toast({
                  title: "Payment Status Updated",
                  description: `Payment status changed from "${oldPaymentStatus}" to "${newPaymentStatus}"`,
                  duration: 3000,
                });
              }
            }
          }
        )
        .subscribe();

      // Cleanup subscription on unmount
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [orderId, order?.payment_status, toast]);

  const handleStatusUpdate = async (newStatus: AdminOrder['status']) => {
    if (!order) return;
    
    try {
      await updateOrderStatus(order.id, newStatus);
      setOrder(prev => prev ? { ...prev, status: newStatus } : null);
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handleSaveNotes = async () => {
    if (!order) return;
    
    try {
      const { error } = await supabase
        .from('orders')
        .update({ notes })
        .eq('id', order.id);
        
      if (error) throw error;
        
        setOrder(prev => prev ? { ...prev, notes } : null);
    setIsEditingNotes(false);
      } catch (error) {
        console.error('Error updating notes:', error);
      }
    };

    const handleSavePaymentStatus = async () => {
      if (!order) return;
      
      try {
        const { error } = await supabase
          .from('orders')
          .update({ payment_status: paymentStatus })
          .eq('id', order.id);
        
        if (error) throw error;
        
        setOrder(prev => prev ? { ...prev, payment_status: paymentStatus as AdminOrder['payment_status'] } : null);
        setIsEditingPaymentStatus(false);
      } catch (error) {
        console.error('Error updating payment status:', error);
      }
    };

    const handleCancelPaymentStatusEdit = () => {
      setPaymentStatus(order?.payment_status || 'pending');
      setIsEditingPaymentStatus(false);
    };

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Orders
          </Button>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading order details...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !order) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Orders
          </Button>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="text-destructive">
              {error || 'Order not found'}
            </p>
            <Button variant="outline" className="mt-4" onClick={onBack}>
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handleSaveTracking = () => {
    setOrder(prev => ({ ...prev, trackingNumber }));
  };

  const StatusIcon = statusConfig[order.status].icon;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Orders
          </Button>
          <div>
            <h2 className="text-2xl font-bold">Order {order.order_number || `ORD-${order.id.slice(-8)}`}</h2>
            <p className="text-muted-foreground">
              Placed on {new Date(order.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
          <Button variant="outline">
            <Mail className="w-4 h-4 mr-2" />
            Email Customer
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              {order.order_items && order.order_items.length > 0 ? (
              <div className="space-y-4">
                  {order.order_items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                      {item.products?.image_url ? (
                        <img 
                          src={item.products.image_url} 
                          alt={item.products.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <Package className="w-6 h-6 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{item.products?.name || 'Product'}</h4>
                      <p className="text-sm text-muted-foreground">Product ID: {item.products?.id || 'N/A'}</p>
                      <p className="text-sm">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">TSh {item.total_price.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">
                        TSh {item.unit_price.toLocaleString()} each
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No items in this order</p>
                </div>
              )}

              <Separator className="my-4" />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>TSh {order.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span>TSh {order.tax_amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee:</span>
                  <span>TSh {order.delivery_fee.toLocaleString()}</span>
                </div>
                {order.discount_amount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount:</span>
                    <span>-TSh {order.discount_amount.toLocaleString()}</span>
                </div>
                )}
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>TSh {order.total_amount.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Status */}
          <Card>
            <CardHeader>
              <CardTitle>Order Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                    <div className="flex-1">
                    <p className="font-medium capitalize">{order.status}</p>
                    <p className="text-sm text-muted-foreground">
                      Last updated: {new Date(order.updated_at).toLocaleString()}
                    </p>
                      <p className="text-sm text-muted-foreground">
                      Created: {new Date(order.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Status */}
          <Card>
            <CardHeader>
              <CardTitle>Order Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <StatusIcon className="w-5 h-5" />
                <Badge variant={statusConfig[order.status].variant} className="text-sm">
                  {statusConfig[order.status].label}
                </Badge>
              </div>

              <div className="space-y-2">
                <Label>Update Status</Label>
                <Select value={order.status} onValueChange={handleStatusUpdate}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Tracking Number</Label>
                <div className="flex gap-2">
                  <Input
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="Enter tracking number"
                  />
                  <Button size="sm" onClick={handleSaveTracking}>
                    <Save className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium">
                    {(typeof order.delivery_address === 'object' && order.delivery_address?.fullName) 
                      ? order.delivery_address.fullName.charAt(0)
                      : (order.profiles?.full_name?.charAt(0) || 'U')}
                  </span>
                </div>
                <div>
                  <p className="font-medium">
                    {(typeof order.delivery_address === 'object' && order.delivery_address?.fullName) || 
                     order.profiles?.full_name || 
                     'Unknown Customer'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {(typeof order.delivery_address === 'object' && order.delivery_address?.email) || 'No email'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4" />
                <span>
                  {(typeof order.delivery_address === 'object' && order.delivery_address?.phone) || 
                   order.profiles?.phone || 
                   'No phone'}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Delivery Address */}
          <Card>
            <CardHeader>
              <CardTitle>Delivery Address</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-1" />
                <div className="text-sm">
                  {typeof order.delivery_address === 'object' && order.delivery_address ? (
                    <>
                      <p>{order.delivery_address.address || 'No address'}</p>
                      <p>{order.delivery_address.city || 'No city'}, {order.delivery_address.region || 'No region'}</p>
                      <p>{order.delivery_address.postalCode || 'No postal code'}</p>
                      <p className="mt-2 text-muted-foreground">
                        Delivery Type: {order.delivery_address.deliveryType || 'Not specified'}
                      </p>
                      {order.delivery_address.instructions && (
                        <p className="mt-1 text-muted-foreground">
                          Instructions: {order.delivery_address.instructions}
                        </p>
                      )}
                    </>
                  ) : (
                    <p>No delivery address provided</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Information */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                <span className="text-sm">{order.payment_method || 'Not specified'}</span>
              </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Payment Status:</span>
                    {!isEditingPaymentStatus && (
                      <div className="flex items-center gap-2">
                        <Badge variant={order.payment_status === 'paid' ? 'default' : 'secondary'}>
                          {order.payment_status}
              </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setIsEditingPaymentStatus(true)}
                          className="h-6 w-6 p-0"
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  {isEditingPaymentStatus && (
                    <div className="flex items-center gap-2">
                      <Select value={paymentStatus} onValueChange={(value) => setPaymentStatus(value as AdminOrder['payment_status'])}>
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue placeholder="Select payment status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="paid">Paid</SelectItem>
                          <SelectItem value="failed">Failed</SelectItem>
                          <SelectItem value="refunded">Refunded</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleSavePaymentStatus}
                        className="h-6 w-6 p-0"
                      >
                        <Save className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCancelPaymentStatusEdit}
                        className="h-6 w-6 p-0"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  )}

                  {/* Show COD specific message when payment method is COD */}
                  {order.payment_method === 'cash_on_delivery' && order.payment_status === 'pending' && (
                    <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded-md">
                      <p className="text-xs text-amber-700">
                        💰 Cash on Delivery: Update payment status to "Paid" after customer receives order and pays.
                      </p>
                    </div>
                  )}

                  {/* Show confirmation message when COD is marked as paid */}
                  {order.payment_method === 'cash_on_delivery' && order.payment_status === 'paid' && (
                    <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md">
                      <p className="text-xs text-green-700">
                        ✅ Payment received via Cash on Delivery
                      </p>
                    </div>
                  )}
                </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Notes</CardTitle>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => setIsEditingNotes(!isEditingNotes)}
                >
                  {isEditingNotes ? <X className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isEditingNotes ? (
                <div className="space-y-2">
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add notes about this order..."
                    rows={3}
                  />
                  <Button size="sm" onClick={handleSaveNotes}>
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                </div>
              ) : (
                <p className="text-sm">{order.notes || 'No notes added'}</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}