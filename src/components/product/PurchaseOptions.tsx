import { useState } from 'react';
import { Minus, Plus, ShoppingCart, Zap, Upload, Truck, Shield, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Product } from '@/components/ui/product-card';
import { useToast } from '@/hooks/use-toast';

interface PurchaseOptionsProps {
  product: Product;
}

export function PurchaseOptions({ product }: PurchaseOptionsProps) {
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [prescriptionFile, setPrescriptionFile] = useState<File | null>(null);
  const { toast } = useToast();

  const maxQuantity = product.stockCount || 99;
  const totalPrice = quantity * product.price;
  const wholesaleTotal = product.wholesalePrice ? quantity * product.wholesalePrice : null;

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const increaseQuantity = () => {
    if (quantity < maxQuantity) setQuantity(quantity + 1);
  };

  const handleQuantityChange = (value: string) => {
    const num = parseInt(value);
    if (!isNaN(num) && num >= 1 && num <= maxQuantity) {
      setQuantity(num);
    }
  };

  const handleAddToCart = async () => {
    if (product.requiresPrescription && !prescriptionFile) {
      toast({
        title: "Prescription Required",
        description: "Please upload a valid prescription for this medicine.",
        variant: "destructive",
      });
      return;
    }

    setIsAddingToCart(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Added to Cart",
      description: `${quantity}x ${product.name} added to your cart.`,
    });
    
    setIsAddingToCart(false);
  };

  const handleBuyNow = () => {
    // Handle buy now logic
    toast({
      title: "Redirecting to Checkout",
      description: "Taking you to checkout...",
    });
  };

  const handlePrescriptionUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPrescriptionFile(file);
      toast({
        title: "Prescription Uploaded",
        description: "Your prescription has been uploaded successfully.",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Quantity Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Select Quantity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <Label htmlFor="quantity" className="text-sm font-medium">
              Quantity:
            </Label>
            <div className="flex items-center border rounded-md">
              <Button
                variant="ghost"
                size="sm"
                onClick={decreaseQuantity}
                disabled={quantity <= 1}
                className="h-8 w-8 p-0"
              >
                <Minus size={16} />
              </Button>
              <Input
                id="quantity"
                type="number"
                value={quantity}
                onChange={(e) => handleQuantityChange(e.target.value)}
                className="h-8 w-16 text-center border-0 focus-visible:ring-0"
                min="1"
                max={maxQuantity}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={increaseQuantity}
                disabled={quantity >= maxQuantity}
                className="h-8 w-8 p-0"
              >
                <Plus size={16} />
              </Button>
            </div>
            <span className="text-sm text-muted-foreground">
              (Max: {maxQuantity})
            </span>
          </div>

          {/* Price Summary */}
          <div className="space-y-2 p-3 bg-muted rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm">Retail Price:</span>
              <span className="font-semibold">TZS {totalPrice.toLocaleString()}</span>
            </div>
            {wholesaleTotal && quantity >= 10 && (
              <div className="flex justify-between items-center text-accent">
                <span className="text-sm">Wholesale Price:</span>
                <span className="font-semibold">TZS {wholesaleTotal.toLocaleString()}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Prescription Upload */}
      {product.requiresPrescription && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Upload size={20} />
              Prescription Required
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                This medicine requires a valid prescription. Please upload your prescription to proceed.
              </p>
              <div className="flex items-center gap-3">
                <Input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handlePrescriptionUpload}
                  className="flex-1"
                />
                {prescriptionFile && (
                  <Badge className="bg-success/10 text-success border-success/20">
                    Uploaded
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Purchase Buttons */}
      <div className="space-y-3">
        <Button
          onClick={handleAddToCart}
          disabled={!product.inStock || isAddingToCart}
          className="w-full"
          size="lg"
        >
          <ShoppingCart className="mr-2" size={20} />
          {isAddingToCart ? 'Adding...' : 'Add to Cart'}
        </Button>

        <Button
          onClick={handleBuyNow}
          disabled={!product.inStock}
          variant="outline"
          className="w-full"
          size="lg"
        >
          <Zap className="mr-2" size={20} />
          Buy Now
        </Button>
      </div>

      {/* Delivery Info */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Truck size={16} className="text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Delivery within Mbeya</p>
                <p className="text-xs text-muted-foreground">1-2 business days</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Shield size={16} className="text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Licensed Pharmacy</p>
                <p className="text-xs text-muted-foreground">Authorized by TMDA</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CreditCard size={16} className="text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Secure Payment</p>
                <p className="text-xs text-muted-foreground">M-Pesa, Bank Transfer, COD</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Wholesale Information */}
      {product.wholesaleAvailable && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Wholesale Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Special pricing available for bulk orders (10+ units)
              </p>
              {product.wholesalePrice && (
                <p className="text-sm">
                  Wholesale price: <span className="font-semibold text-accent">
                    TZS {product.wholesalePrice.toLocaleString()}
                  </span> per unit
                </p>
              )}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    Contact for Bulk Orders
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Bulk Order Inquiry</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      For bulk orders and special pricing, please contact our wholesale team:
                    </p>
                    <div className="space-y-2">
                      <p className="text-sm"><strong>Phone:</strong> +255 25 250 1234</p>
                      <p className="text-sm"><strong>Email:</strong> wholesale@gacinia.co.tz</p>
                      <p className="text-sm"><strong>WhatsApp:</strong> +255 754 123 456</p>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}