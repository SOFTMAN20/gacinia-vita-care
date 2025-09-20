import { useState } from 'react';
import { X, ShoppingCart, Heart, Star, Plus, Minus } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Product } from '@/hooks/useProducts';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

interface ProductQuickViewProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductQuickView({ product, isOpen, onClose }: ProductQuickViewProps) {
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { addItem } = useCart();
  const { toast } = useToast();

  if (!product) return null;

  const discountPercentage = product.original_price 
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  const handleAddToCart = () => {
    addItem(product, quantity);
    toast({
      title: "Added to cart",
      description: `${product.name} (${quantity}) added to your cart`,
    });
    onClose();
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= (product.stock_count || 99)) {
      setQuantity(newQuantity);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          {/* Image Section */}
          <div className="space-y-4">
            <div className="aspect-square relative bg-muted rounded-lg overflow-hidden">
              <img
                src={product.image_url || '/placeholder.svg'}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              
              {/* Discount Badge */}
              {discountPercentage > 0 && (
                <Badge className="absolute top-2 left-2 bg-red-500">
                  -{discountPercentage}% OFF
                </Badge>
              )}
              
              <img
                src={product.image_url || '/placeholder.svg'}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Product Info Section */}
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold">{product.name}</h2>
              {product.requires_prescription && (
                <Badge variant="outline" className="mt-2 text-orange-600 border-orange-200">
                  Prescription Required
                </Badge>
              )}
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={16} 
                    className={i < Math.floor(product.rating || 0) ? 'fill-current' : ''} 
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {product.rating} ({product.review_count} reviews)
              </span>
              <Badge variant="secondary">{product.category?.name || 'General'}</Badge>
            </div>

            {/* Description */}
            <p className="text-muted-foreground">
              {product.description || 'No description available.'}
            </p>

            {/* Pricing */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold">
                  TZS {product.price.toLocaleString()}
                </span>
                {product.original_price && (
                  <span className="text-lg text-muted-foreground line-through">
                    TZS {product.original_price.toLocaleString()}
                  </span>
                )}
              </div>
              
              {product.wholesale_price && (
                <p className="text-sm text-muted-foreground">
                  Wholesale price: TZS {product.wholesale_price.toLocaleString()}
                </p>
              )}
            </div>

            {/* Stock Status */}
            <div className="space-y-2">
              {product.in_stock ? (
                <div className="flex items-center gap-2 text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">
                    In Stock ({product.stock_count} available)
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-red-600">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-sm">Out of Stock</span>
                </div>
              )}
            </div>

            {/* Key Features */}
            {product.key_features && product.key_features.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium">Key Features:</h4>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  {product.key_features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Quantity and Actions */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium">Quantity:</span>
                <div className="flex items-center border rounded">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                  >
                    <Minus size={16} />
                  </Button>
                  <Input
                    type="number"
                    value={quantity}
                    onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                    className="w-16 text-center border-0"
                    min={1}
                    max={product.stock_count || 99}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= (product.stock_count || 99)}
                  >
                    <Plus size={16} />
                  </Button>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleAddToCart}
                  disabled={!product.in_stock}
                  className="flex-1"
                >
                  <ShoppingCart size={16} className="mr-2" />
                  Add to Cart
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className="px-3"
                >
                  <Heart 
                    size={16} 
                    className={isWishlisted ? 'fill-current text-red-500' : ''} 
                  />
                </Button>
              </div>

              <Link to={`/products/${product.id}`}>
                <Button variant="outline" className="w-full">
                  View Full Details
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}