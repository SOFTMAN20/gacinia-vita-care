import { useState } from 'react';
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

const mockOrderData: OrderData = {
  id: '1',
  orderNumber: 'ORD-001',
  status: 'processing',
  paymentStatus: 'paid',
  paymentMethod: 'M-Pesa',
  customer: {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+255 123 456 789'
  },
  deliveryAddress: {
    street: '123 Main Street, Ilemela',
    city: 'Mwanza',
    region: 'Mwanza',
    postalCode: '33000'
  },
  items: [
    {
      id: '1',
      name: 'Panadol Extra',
      sku: 'PND-EXT-001',
      quantity: 2,
      unitPrice: 2500,
      totalPrice: 5000,
      image: '/placeholder-product.jpg'
    },
    {
      id: '2',
      name: 'Vitamin C Tablets',
      sku: 'VIT-C-001',
      quantity: 1,
      unitPrice: 15000,
      totalPrice: 15000,
      image: '/placeholder-product.jpg'
    }
  ],
  subtotal: 20000,
  tax: 0,
  shipping: 3000,
  total: 23000,
  createdAt: '2024-01-15T10:30:00Z',
  updatedAt: '2024-01-15T14:20:00Z',
  notes: 'Customer requested express delivery',
  trackingNumber: 'TRK123456789',
  statusHistory: [
    { status: 'pending', timestamp: '2024-01-15T10:30:00Z' },
    { status: 'confirmed', timestamp: '2024-01-15T11:00:00Z', notes: 'Payment confirmed' },
    { status: 'processing', timestamp: '2024-01-15T14:20:00Z', notes: 'Items being prepared' }
  ]
};

const statusConfig = {
  pending: { label: 'Pending', variant: 'secondary' as const, icon: Clock },
  confirmed: { label: 'Confirmed', variant: 'default' as const, icon: CheckCircle },
  processing: { label: 'Processing', variant: 'default' as const, icon: Package },
  shipped: { label: 'Shipped', variant: 'default' as const, icon: Truck },
  delivered: { label: 'Delivered', variant: 'default' as const, icon: CheckCircle },
  cancelled: { label: 'Cancelled', variant: 'destructive' as const, icon: XCircle }
};

export default function OrderDetail({ orderId, onBack }: OrderDetailProps) {
  const [order, setOrder] = useState<OrderData>(mockOrderData);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notes, setNotes] = useState(order.notes);
  const [trackingNumber, setTrackingNumber] = useState(order.trackingNumber || '');

  const handleStatusUpdate = (newStatus: OrderData['status']) => {
    setOrder(prev => ({
      ...prev,
      status: newStatus,
      updatedAt: new Date().toISOString(),
      statusHistory: [
        ...prev.statusHistory,
        {
          status: newStatus,
          timestamp: new Date().toISOString(),
          notes: `Status updated to ${newStatus}`
        }
      ]
    }));
  };

  const handleSaveNotes = () => {
    setOrder(prev => ({ ...prev, notes }));
    setIsEditingNotes(false);
  };

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
            <h2 className="text-2xl font-bold">Order {order.orderNumber}</h2>
            <p className="text-muted-foreground">
              Placed on {new Date(order.createdAt).toLocaleDateString()}
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
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                      {item.image ? (
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <Package className="w-6 h-6 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">SKU: {item.sku}</p>
                      <p className="text-sm">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">TSh {item.totalPrice.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">
                        TSh {item.unitPrice.toLocaleString()} each
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>TSh {order.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span>TSh {order.tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>TSh {order.shipping.toLocaleString()}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>TSh {order.total.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status History */}
          <Card>
            <CardHeader>
              <CardTitle>Order Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.statusHistory.map((entry, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                    <div className="flex-1">
                      <p className="font-medium capitalize">{entry.status}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(entry.timestamp).toLocaleString()}
                      </p>
                      {entry.notes && (
                        <p className="text-sm text-muted-foreground mt-1">{entry.notes}</p>
                      )}
                    </div>
                  </div>
                ))}
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
                    {order.customer.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-medium">{order.customer.name}</p>
                  <p className="text-sm text-muted-foreground">{order.customer.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4" />
                <span>{order.customer.phone}</span>
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
                  <p>{order.deliveryAddress.street}</p>
                  <p>{order.deliveryAddress.city}, {order.deliveryAddress.region}</p>
                  <p>{order.deliveryAddress.postalCode}</p>
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
                <span className="text-sm">{order.paymentMethod}</span>
              </div>
              <Badge variant={order.paymentStatus === 'paid' ? 'default' : 'secondary'}>
                {order.paymentStatus}
              </Badge>
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