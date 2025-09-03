import { Heart, ShoppingCart, Eye, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  category: string;
  brand?: string;
  inStock: boolean;
  stockCount?: number;
  requiresPrescription?: boolean;
  wholesaleAvailable?: boolean;
  wholesalePrice?: number;
  rating?: number;
  reviewCount?: number;
  description?: string;
  keyFeatures?: string[];
  technicalSpecs?: Record<string, string>;
  usageInstructions?: string;
  dosage?: string;
  ingredients?: string;
  storageRequirements?: string;
  expiryDate?: string;
  batchNumber?: string;
  manufacturer?: string;
  sku?: string;
  weight?: string;
  dimensions?: string;
}

interface ProductCardProps {
  product: Product;
  className?: string;
  onAddToCart?: (product: Product) => void;
  onQuickView?: (product: Product) => void;
  onToggleWishlist?: (product: Product) => void;
  isWishlisted?: boolean;
}

import { useCart } from '@/contexts/CartContext';

export function ProductCard({ 
  product, 
  className,
  onAddToCart,
  onQuickView,
  onToggleWishlist,
  isWishlisted = false
}: ProductCardProps) {
  const { addItem } = useCart();
  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const isLowStock = product.stockCount !== undefined && product.stockCount <= 5 && product.stockCount > 0;

  return (
    <Card className={cn(
      "group relative overflow-hidden hover:shadow-lg transition-all duration-300 bg-surface",
      className
    )}>
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={product.name}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {discountPercentage > 0 && (
            <Badge className="bg-error text-error-foreground text-xs">
              -{discountPercentage}%
            </Badge>
          )}
          {product.requiresPrescription && (
            <Badge variant="outline" className="text-xs bg-warning/10 text-warning border-warning/20">
              Prescription Required
            </Badge>
          )}
          {product.wholesaleAvailable && (
            <Badge variant="outline" className="text-xs bg-accent/10 text-accent border-accent/20">
              Wholesale
            </Badge>
          )}
        </div>

        {/* Quick Action Buttons */}
        <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="sm"
            variant="secondary"
            className="w-8 h-8 p-0 bg-surface/90 hover:bg-surface"
            onClick={() => onToggleWishlist?.(product)}
          >
            <Heart 
              size={16} 
              className={cn(
                "transition-colors",
                isWishlisted ? "fill-error text-error" : "text-muted-foreground"
              )} 
            />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="w-8 h-8 p-0 bg-surface/90 hover:bg-surface"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onQuickView?.(product);
            }}
          >
            <Eye size={16} className="text-muted-foreground" />
          </Button>
        </div>

        {/* Stock Status Overlay */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="destructive" className="text-sm">
              Out of Stock
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-4">
        {/* Product Info */}
        <div className="space-y-2">
          <h3 className="font-medium text-sm line-clamp-2 text-foreground group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          
          <p className="text-xs text-muted-foreground capitalize">
            {product.category}
          </p>

          {/* Rating */}
          {product.rating && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span className="text-accent">★</span>
              <span>{product.rating}</span>
              {product.reviewCount && (
                <span>({product.reviewCount})</span>
              )}
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground">
              TZS {product.price.toLocaleString()}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-muted-foreground line-through">
                TZS {product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          {/* Stock Warning */}
          {isLowStock && (
            <div className="flex items-center gap-1 text-xs text-warning">
              <AlertCircle size={12} />
              <span>Only {product.stockCount} left</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-4 space-y-2">
          <Button
            onClick={() => {
              addItem(product, 1);
              onAddToCart?.(product);
            }}
            disabled={!product.inStock}
            className="w-full text-sm"
            size="sm"
          >
            <ShoppingCart size={16} className="mr-2" />
            {product.inStock ? 'Add to Cart' : 'Out of Stock'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}