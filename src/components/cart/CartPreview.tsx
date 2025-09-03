import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { ShoppingCart, Eye, Package, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';

interface CartPreviewProps {
  children: React.ReactNode;
}

export function CartPreview({ children }: CartPreviewProps) {
  const { state, removeItem } = useCart();

  if (state.totalItems === 0) {
    return (
      <HoverCard>
        <HoverCardTrigger asChild>
          {children}
        </HoverCardTrigger>
        <HoverCardContent className="w-80" side="bottom" align="end">
          <div className="text-center py-6">
            <ShoppingCart size={32} className="mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">Your cart is empty</p>
          </div>
        </HoverCardContent>
      </HoverCard>
    );
  }

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        {children}
      </HoverCardTrigger>
      <HoverCardContent className="w-80" side="bottom" align="end">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Cart ({state.totalItems} items)</h4>
            <Badge variant="secondary">
              TZS {state.total.toLocaleString()}
            </Badge>
          </div>

          <div className="space-y-3 max-h-60 overflow-y-auto">
            {state.items.slice(0, 3).map((item) => (
              <div key={item.id} className="flex gap-3">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-12 h-12 object-cover rounded"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium line-clamp-1">
                    {item.product.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {item.quantity}x TZS {item.product.price.toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-xs text-muted-foreground hover:text-destructive"
                >
                  Remove
                </button>
              </div>
            ))}
            
            {state.items.length > 3 && (
              <p className="text-xs text-muted-foreground text-center">
                +{state.items.length - 3} more items
              </p>
            )}
          </div>

          <div className="space-y-2 pt-3 border-t">
            <div className="flex justify-between text-sm">
              <span>Subtotal:</span>
              <span>TZS {state.subtotal.toLocaleString()}</span>
            </div>
            {state.deliveryFee > 0 && (
              <div className="flex justify-between text-sm">
                <span>Delivery:</span>
                <span>TZS {state.deliveryFee.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between font-medium">
              <span>Total:</span>
              <span>TZS {state.total.toLocaleString()}</span>
            </div>
          </div>

          <div className="space-y-2">
            <Button className="w-full" size="sm">
              <Package className="mr-2" size={14} />
              View Cart
            </Button>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock size={12} />
              <span>Free delivery on orders over TZS 50,000</span>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}