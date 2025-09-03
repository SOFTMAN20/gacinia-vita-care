import { useState } from 'react';
import { X, ShoppingCart, Heart, Star, Plus, Minus } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Product } from '@/components/ui/product-card';
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
  const { addItem } = useCart();
  const { toast } = useToast();

  if (!product) return null;

  const handleAddToCart = () => {
    addItem(product, quantity);
    toast({
      title: "Added to Cart",
      description: `${quantity}x ${product.name} added to your cart.`,
    });
    onClose();
  };

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="absolute right-4 top-4 z-10"
        >
          <X size={16} />
        </Button>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="aspect-square bg-muted rounded-lg overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Additional images placeholder */}
            <div className="flex gap-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-16 h-16 bg-muted rounded border opacity-50">
                  <img
                    src={product.image}
                    alt={`${product.name} view ${i}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                {product.brand && (
                  <Badge variant="outline">{product.brand}</Badge>
                )}
                {product.requiresPrescription && (
                  <Badge className="bg-warning/10 text-warning border-warning/20">
                    Prescription Required
                  </Badge>
                )}
                {discountPercentage > 0 && (
                  <Badge className="bg-error text-error-foreground">
                    -{discountPercentage}% OFF
                  </Badge>
                )}
              </div>

              <h2 className="text-2xl font-bold">{product.name}</h2>
              
              <p className="text-muted-foreground capitalize">
                {product.category}
              </p>

              {/* Rating */}
              {product.rating && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={`${
                          i < Math.floor(product.rating!)
                            ? 'fill-accent text-accent'
                            : 'text-muted-foreground'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {product.rating} ({product.reviewCount} reviews)
                  </span>
                </div>
              )}
            </div>

            {/* Price */}
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-primary">
                  TZS {product.price.toLocaleString()}
                </span>
                {product.originalPrice && (
                  <span className="text-lg text-muted-foreground line-through">
                    TZS {product.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>
              
              {product.wholesalePrice && (
                <p className="text-sm text-muted-foreground">
                  Wholesale: TZS {product.wholesalePrice.toLocaleString()} (bulk orders)
                </p>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              {product.inStock ? (
                <>
                  <div className="w-2 h-2 rounded-full bg-success"></div>
                  <span className="text-sm text-success font-medium">In Stock</span>
                  {product.stockCount && product.stockCount <= 5 && (
                    <span className="text-sm text-warning">
                      (Only {product.stockCount} left)
                    </span>
                  )}
                </>
              ) : (
                <>
                  <div className="w-2 h-2 rounded-full bg-error"></div>
                  <span className="text-sm text-error font-medium">Out of Stock</span>
                </>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div className="space-y-2">
                <h4 className="font-medium">Description</h4>
                <p className="text-muted-foreground text-sm line-clamp-3">
                  {product.description}
                </p>
              </div>
            )}

            {/* Key Features */}
            {product.keyFeatures && product.keyFeatures.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium">Key Features</h4>
                <ul className="space-y-1">
                  {product.keyFeatures.slice(0, 3).map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0"></div>
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="font-medium">Quantity:</span>
                <div className="flex items-center border rounded-md">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="h-8 w-8 p-0"
                  >
                    <Minus size={14} />
                  </Button>
                  <Input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="h-8 w-16 text-center border-0 focus-visible:ring-0"
                    min="1"
                    max={product.stockCount || 99}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.min((product.stockCount || 99), quantity + 1))}
                    className="h-8 w-8 p-0"
                  >
                    <Plus size={14} />
                  </Button>
                </div>
              </div>

              <p className="text-sm text-muted-foreground">
                Total: TZS {(product.price * quantity).toLocaleString()}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="w-full"
                size="lg"
              >
                <ShoppingCart className="mr-2" size={20} />
                Add to Cart
              </Button>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" asChild>
                  <Link to={`/products/${product.id}`}>
                    View Full Details
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="w-12">
                  <Heart size={16} />
                </Button>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="text-xs text-muted-foreground space-y-1 pt-3 border-t">
              <p>✓ Authentic products from licensed suppliers</p>
              <p>✓ Secure payment & fast delivery</p>
              <p>✓ Professional consultation available</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}