import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { CartPreview } from './CartPreview';

export function CartIcon() {
  const { state, toggleCart } = useCart();

  return (
    <CartPreview>
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleCart}
        className="relative"
      >
        <ShoppingCart size={20} />
        {state.totalItems > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
          >
            {state.totalItems > 99 ? '99+' : state.totalItems}
          </Badge>
        )}
      </Button>
    </CartPreview>
  );
}