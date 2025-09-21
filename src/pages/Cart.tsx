import { Minus, Plus, Heart, Trash2, ShoppingBag, Gift } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useCart } from '@/contexts/CartContext';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

const Cart = () => {
  const { state, removeItem, updateQuantity, clearCart, applyDiscount } = useCart();
  const [promoCode, setPromoCode] = useState('');
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);
  const { toast } = useToast();

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleApplyPromoCode = async () => {
    if (!promoCode.trim()) return;
    
    setIsApplyingPromo(true);
    
    // Simulate API call for promo code validation
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock promo codes
    const validPromoCodes = {
      'SAVE10': 10000, // TZS 10,000 off
      'WELCOME': 5000,  // TZS 5,000 off
      'HEALTH20': state.subtotal * 0.2 // 20% off
    };

    const discount = validPromoCodes[promoCode.toUpperCase() as keyof typeof validPromoCodes];
    
    if (discount) {
      applyDiscount(discount);
      setPromoCode('');
    } else {
      toast({
        title: "Invalid Promo Code",
        description: "The promo code you entered is not valid.",
        variant: "destructive",
      });
    }
    
    setIsApplyingPromo(false);
  };

  const handleMoveToWishlist = (productId: string) => {
    // In a real app, this would move the item to wishlist
    removeItem(productId);
    toast({
      title: "Moved to Wishlist",
      description: "Item moved to your wishlist.",
    });
  };

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar cartItemCount={state.totalItems} />
        
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <ShoppingBag size={80} className="mx-auto text-muted-foreground" />
              <h1 className="text-3xl font-bold">Your cart is empty</h1>
              <p className="text-muted-foreground text-lg">
                Looks like you haven't added any items to your cart yet.
              </p>
            </div>

            <div className="space-y-4">
              <Button asChild size="lg">
                <Link to="/products">Start Shopping</Link>
              </Button>
              
              <div className="grid gap-4 mt-8">
                <h3 className="font-semibold text-lg">Popular Categories</h3>
                <div className="grid grid-cols-2 gap-4">
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4 text-center">
                      <h4 className="font-medium">Medicines</h4>
                      <p className="text-sm text-muted-foreground">Over 500 products</p>
                    </CardContent>
                  </Card>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4 text-center">
                      <h4 className="font-medium">Personal Care</h4>
                      <p className="text-sm text-muted-foreground">Beauty & wellness</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar cartItemCount={state.totalItems} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold">Shopping Cart ({state.totalItems} items)</h1>
            <Button variant="outline" onClick={clearCart}>
              <Trash2 size={16} className="mr-2" />
              Clear Cart
            </Button>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {state.items.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <img
                        src={item.product.image_url}
                        alt={item.product.name}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                      
                      <div className="flex-1 space-y-3">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="font-medium text-lg">{item.product.name}</h3>
                            <p className="text-muted-foreground capitalize">
                              {item.product.category?.name || 'General'}
                            </p>
                            
                            <div className="flex gap-2 mt-2">
                              {item.product.requires_prescription && (
                                <Badge variant="outline" className="text-xs">
                                  Prescription Required
                                </Badge>
                              )}
                              {item.product.brand && (
                                <Badge variant="outline" className="text-xs">
                                  {item.product.brand}
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <p className="font-semibold text-lg">
                              TZS {(item.product.price * item.quantity).toLocaleString()}
                            </p>
                            {item.product.original_price && (
                              <p className="text-sm text-muted-foreground line-through">
                                TZS {(item.product.original_price * item.quantity).toLocaleString()}
                              </p>
                            )}
                            <p className="text-xs text-muted-foreground">
                              TZS {item.product.price.toLocaleString()} each
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center border rounded-md">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                className="h-8 w-8 p-0"
                              >
                                <Minus size={14} />
                              </Button>
                              <span className="w-12 text-center text-sm font-medium">
                                {item.quantity}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                className="h-8 w-8 p-0"
                                disabled={item.quantity >= (item.product.stock_count || 99)}
                              >
                                <Plus size={14} />
                              </Button>
                            </div>
                            
                            {item.product.stock_count && item.product.stock_count <= 5 && (
                              <span className="text-xs text-warning">
                                Only {item.product.stock_count} left
                              </span>
                            )}
                          </div>

                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleMoveToWishlist(item.id)}
                            >
                              <Heart size={16} className="mr-1" />
                              Save for Later
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeItem(item.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 size={16} className="mr-1" />
                              Remove
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              {/* Promo Code */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Gift size={20} />
                    Promo Code
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter promo code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                    />
                    <Button
                      onClick={handleApplyPromoCode}
                      disabled={!promoCode.trim() || isApplyingPromo}
                    >
                      {isApplyingPromo ? 'Applying...' : 'Apply'}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Try: SAVE10, WELCOME, or HEALTH20
                  </p>
                </CardContent>
              </Card>

              {/* Order Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Subtotal ({state.totalItems} items):</span>
                      <span>TZS {state.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax (18% VAT):</span>
                      <span>TZS {state.tax.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery Fee:</span>
                      <span>TZS {state.deliveryFee.toLocaleString()}</span>
                    </div>
                    {state.discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount:</span>
                        <span>-TZS {state.discount.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="border-t pt-3">
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Total:</span>
                        <span>TZS {state.total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Button className="w-full" size="lg" asChild>
                      <Link to="/checkout">
                        Proceed to Checkout
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full" asChild>
                      <Link to="/products">
                        Continue Shopping
                      </Link>
                    </Button>
                  </div>

                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>• Free delivery on orders over TZS 50,000</p>
                    <p>• All medicines are sourced from licensed suppliers</p>
                    <p>• Secure payment processing</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Cart;