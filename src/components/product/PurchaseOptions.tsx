import { useState } from 'react';
import { Minus, Plus, ShoppingCart, Zap, Upload, Truck, Shield, CreditCard, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Product } from '@/hooks/useProducts';
import { useToast } from '@/hooks/use-toast';

interface PurchaseOptionsProps {
  product: Product;
}

export function PurchaseOptions({ product }: PurchaseOptionsProps) {
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { toast } = useToast();

  const maxQuantity = product.stock_count || 99;
  const totalPrice = product.price * quantity;
  const wholesaleTotal = product.wholesale_price ? product.wholesale_price * quantity : null;

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= maxQuantity) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    if (product.requires_prescription) {
      toast({
        title: "Prescription Required",
        description: "Please upload a valid prescription for this product.",
        variant: "destructive",
      });
      return;
    }

    setIsAddingToCart(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Added to cart",
      description: `${product.name} (${quantity}) added to your cart`,
    });
    setIsAddingToCart(false);
  };

  return (
    <div className="space-y-6">
      {/* Prescription Upload */}
      {product.requires_prescription && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-orange-800 flex items-center gap-2">
              <Upload size={20} />
              Prescription Required
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-orange-700 mb-3">
              This medication requires a valid prescription from a licensed healthcare provider.
            </p>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="border-orange-300 text-orange-700">
                  <Upload size={16} className="mr-2" />
                  Upload Prescription
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Upload Prescription</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-sm text-gray-600">
                      Click to upload or drag and drop your prescription
                    </p>
                    <input type="file" className="hidden" accept="image/*,.pdf" />
                  </div>
                  <Button className="w-full">
                    Upload Prescription
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      )}

      {/* Quantity Selection */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {/* Stock Status */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Availability:</span>
              <Badge variant={product.in_stock ? "default" : "secondary"}>
                {product.in_stock ? `${product.stock_count} in stock` : 'Out of stock'}
              </Badge>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                  className="h-10 w-10 p-0"
                >
                  <Minus size={16} />
                </Button>
                <Input
                  id="quantity"
                  type="number"
                  min={1}
                  max={maxQuantity}
                  value={quantity}
                  onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                  className="w-20 text-center"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= maxQuantity}
                  className="h-10 w-10 p-0"
                >
                  <Plus size={16} />
                </Button>
                <span className="text-sm text-muted-foreground">
                  (Max: {maxQuantity})
                </span>
              </div>
            </div>

            {/* Price Summary */}
            <div className="space-y-2 pt-2 border-t">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total Price:</span>
                <span className="text-xl font-bold">
                  TZS {totalPrice.toLocaleString()}
                </span>
              </div>
              {wholesaleTotal && (
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <span>Wholesale price:</span>
                  <span>TZS {wholesaleTotal.toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Purchase Actions */}
      <div className="space-y-3">
        <Button 
          className="w-full" 
          size="lg"
          onClick={handleAddToCart}
          disabled={!product.in_stock || isAddingToCart}
        >
          <ShoppingCart size={20} className="mr-2" />
          {isAddingToCart ? 'Adding...' : 'Add to Cart'}
        </Button>

        <Button 
          variant="outline" 
          className="w-full" 
          size="lg"
          disabled={!product.in_stock}
        >
          <Zap size={20} className="mr-2" />
          Buy Now
        </Button>
      </div>

      {/* Wholesale Options */}
      {product.wholesale_available && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-blue-800 flex items-center gap-2">
              <Building2 size={20} />
              Wholesale Available
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-blue-700 mb-3">
              Special pricing available for bulk orders and healthcare facilities.
            </p>
            {product.wholesale_price && (
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-medium">Wholesale price:</span>
                <span className="text-lg font-bold text-blue-800">
                  TZS {product.wholesale_price.toLocaleString()}
                </span>
              </div>
            )}
            <Button variant="outline" size="sm" className="border-blue-300 text-blue-700">
              Contact for Wholesale
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Delivery Information */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Truck className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Free Delivery</p>
                <p className="text-xs text-muted-foreground">Within Mbeya</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Shield className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Secure Payment</p>
                <p className="text-xs text-muted-foreground">100% Safe</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <CreditCard className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Multiple Payments</p>
                <p className="text-xs text-muted-foreground">M-Pesa, Cash</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}