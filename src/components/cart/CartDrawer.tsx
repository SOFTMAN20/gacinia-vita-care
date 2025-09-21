import { Minus, Plus, X, ShoppingBag, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useCart } from '@/contexts/CartContext';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

export function CartDrawer() {
  const { state, removeItem, updateQuantity, setCartOpen } = useCart();

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  return (
    <Sheet open={state.isOpen} onOpenChange={setCartOpen}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag size={20} />
            Shopping Cart ({state.totalItems})
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {state.items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center space-y-4">
              <ShoppingBag size={64} className="text-muted-foreground" />
              <div className="text-center space-y-2">
                <h3 className="font-medium text-lg">Your cart is empty</h3>
                <p className="text-muted-foreground text-sm">
                  Add some products to get started
                </p>
              </div>
              <Button onClick={() => setCartOpen(false)} asChild>
                <Link to="/products">Browse Products</Link>
              </Button>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <ScrollArea className="flex-1 -mx-6 px-6">
                <div className="space-y-4 py-4">
                  {state.items.map((item) => (
                    <div key={item.id} className="flex gap-4 p-4 border rounded-lg">
                      <img
                        src={item.product.image_url || '/placeholder.svg'}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                      
                      <div className="flex-1 space-y-2">
                        <div className="flex justify-between">
                          <h4 className="font-medium text-sm line-clamp-2">
                            {item.product.name}
                          </h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.id)}
                            className="h-6 w-6 p-0 hover:text-destructive"
                          >
                            <X size={12} />
                          </Button>
                        </div>

                        {item.product.requires_prescription && (
                          <Badge variant="outline" className="text-xs">
                            Prescription Required
                          </Badge>
                        )}

                        <div className="flex items-center justify-between">
                          <div className="flex items-center border rounded">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              className="h-7 w-7 p-0"
                            >
                              <Minus size={12} />
                            </Button>
                            <span className="w-8 text-center text-sm">{item.quantity}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              className="h-7 w-7 p-0"
                              disabled={item.quantity >= (item.product.stock_count || 99)}
                            >
                              <Plus size={12} />
                            </Button>
                          </div>
                          
                          <div className="text-right">
                            <p className="font-medium text-sm">
                              TZS {(item.product.price * item.quantity).toLocaleString()}
                            </p>
                            {item.product.original_price && (
                              <p className="text-xs text-muted-foreground line-through">
                                TZS {(item.product.original_price * item.quantity).toLocaleString()}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Cart Summary */}
              <div className="border-t pt-4 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>TZS {state.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Delivery:</span>
                    <span>TZS {state.deliveryFee.toLocaleString()}</span>
                  </div>
                  {state.discount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount:</span>
                      <span>-TZS {state.discount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-semibold text-lg border-t pt-2">
                    <span>Total:</span>
                    <span>TZS {state.total.toLocaleString()}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button className="w-full" asChild>
                    <Link to="/checkout" onClick={() => setCartOpen(false)}>
                      Proceed to Checkout
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/products" onClick={() => setCartOpen(false)}>
                      Continue Shopping
                    </Link>
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}