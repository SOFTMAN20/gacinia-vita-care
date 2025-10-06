import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, ShoppingCart, Calendar, DollarSign, Package } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface CustomerOrdersDialogProps {
  customer: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Order {
  id: string;
  order_number: string;
  total_amount: number;
  status: string;
  created_at: string;
  order_items?: Array<{
    quantity: number;
    unit_price: number;
    products: {
      name: string;
    };
  }>;
}

const statusConfig: Record<string, { label: string; variant: any }> = {
  pending: { label: 'Pending', variant: 'secondary' },
  confirmed: { label: 'Confirmed', variant: 'default' },
  processing: { label: 'Processing', variant: 'default' },
  shipped: { label: 'Shipped', variant: 'default' },
  delivered: { label: 'Delivered', variant: 'default' },
  cancelled: { label: 'Cancelled', variant: 'destructive' }
};

export function CustomerOrdersDialog({ customer, open, onOpenChange }: CustomerOrdersDialogProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && customer) {
      fetchOrders();
    }
  }, [open, customer]);

  const fetchOrders = async () => {
    if (!customer) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          id,
          order_number,
          total_amount,
          status,
          created_at,
          order_items(
            quantity,
            unit_price,
            products(name)
          )
        `)
        .eq('user_id', customer.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!customer) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Order History - {customer.name}</DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[500px] pr-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <ShoppingCart className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No orders found for this customer</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{order.order_number || `ORD-${order.id.slice(-8)}`}</h4>
                        <Badge variant={statusConfig[order.status]?.variant || 'secondary'}>
                          {statusConfig[order.status]?.label || order.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(order.created_at).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Package className="w-3 h-3" />
                          {order.order_items?.length || 0} items
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-lg font-bold">
                        <DollarSign className="w-4 h-4" />
                        TSh {order.total_amount.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {order.order_items && order.order_items.length > 0 && (
                    <>
                      <Separator className="my-2" />
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground mb-2">Order Items:</p>
                        {order.order_items.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">
                              {item.quantity}x {item.products?.name || 'Unknown Product'}
                            </span>
                            <span className="font-medium">
                              TSh {(item.quantity * item.unit_price).toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
