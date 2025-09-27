import { Heart, ShoppingCart, Eye, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { ShareProduct } from './share-product';
import { Product } from '@/hooks/useProducts';
import { useCart } from '@/contexts/CartContext';

interface ProductCardProps {
  product: Product;
  className?: string;
  onAddToCart?: (product: Product) => void;
  onQuickView?: (product: Product) => void;
  onToggleWishlist?: (product: Product) => void;
  isWishlisted?: boolean;
}

export function ProductCard({
  product,
  className,
  onAddToCart,
  onQuickView,
  onToggleWishlist,
  isWishlisted = false
}: ProductCardProps) {
  const { addItem } = useCart();
  const navigate = useNavigate();
  const discountPercentage = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  const isLowStock = product.stock_count !== undefined && product.stock_count <= 5 && product.stock_count > 0;

  const handleImageClick = () => {
    navigate(`/products/${product.id}`);
  };

  const handleQuickViewClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onQuickView) {
      onQuickView(product);
    }
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleWishlist?.(product);
  };

  return (
    <Card className={cn(
      "group relative overflow-hidden hover:shadow-xl transition-all duration-300 bg-white border border-gray-100 rounded-lg",
      className
    )}>
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-50 p-4 cursor-pointer" onClick={handleImageClick}>
        <img
          src={product.image_url || '/placeholder.svg'}
          alt={product.name}
          className="object-contain w-full h-full transition-transform duration-300 hover:scale-105"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {discountPercentage > 0 && (
            <Badge className="bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full">
              SAVE
            </Badge>
          )}
          {product.requires_prescription && (
            <Badge variant="outline" className="text-xs bg-orange-50 text-orange-600 border-orange-200 rounded-full">
              Rx
            </Badge>
          )}
        </div>

        {/* Quick Action Buttons */}
        <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Button
            size="sm"
            variant="outline"
            className="w-8 h-8 p-0 bg-white/90 hover:bg-white shadow-sm rounded-full"
            onClick={handleWishlistClick}
          >
            <Heart
              size={14}
              className={cn(
                "transition-colors",
                isWishlisted ? "fill-red-500 text-red-500" : "text-gray-400"
              )}
            />
          </Button>

          <div onClick={(e) => e.stopPropagation()}>
            <ShareProduct
              product={product}
              variant="outline"
              size="icon"
              className="w-8 h-8 p-0 bg-white/90 hover:bg-white shadow-sm rounded-full [&>svg]:text-green-600 [&>svg]:hover:text-green-700"
            />
          </div>

          <Button
            size="sm"
            variant="outline"
            className="w-8 h-8 p-0 bg-white/90 hover:bg-white shadow-sm rounded-full"
            onClick={handleQuickViewClick}
          >
            <Eye
              size={14}
              className="text-blue-600 hover:text-blue-700 transition-colors"
            />
          </Button>
        </div>

        {/* Stock Status Overlay */}
        {!product.in_stock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
            <Badge variant="destructive" className="text-sm bg-red-500 text-white">
              Out of Stock
            </Badge>
          </div>
        )}

        {/* Delivery Icons */}
        <div className="absolute bottom-2 right-2 flex gap-1">
          <div className="bg-green-100 p-1 rounded-full">
            <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">✓</span>
            </div>
          </div>
        </div>
      </div>

      <CardContent className="p-4 space-y-3">
        {/* Price - moved to top */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg text-gray-900">
              TZS {product.price.toLocaleString()}
            </span>
            {product.original_price && (
              <span className="text-sm text-gray-400 line-through">
                TZS {product.original_price.toLocaleString()}
              </span>
            )}
          </div>
          {discountPercentage > 0 && (
            <span className="text-xs text-red-500 font-medium">
              -{discountPercentage}%
            </span>
          )}
        </div>

        {/* Product Name */}
        <h3 className="font-medium text-sm text-gray-800 line-clamp-2 leading-tight">
          {product.name}
        </h3>

        {/* Stock Warning */}
        {isLowStock && (
          <div className="flex items-center gap-1 text-xs text-orange-600">
            <AlertCircle size={12} />
            <span>Only {product.stock_count} left</span>
          </div>
        )}

        {/* Add to Cart Button - Always visible on mobile, hidden on desktop until hover */}
        <div className="opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-200 transform translate-y-0 md:translate-y-2 md:group-hover:translate-y-0">
          <Button
            onClick={() => {
              if (onAddToCart) {
                onAddToCart(product);
              } else {
                addItem(product, 1);
              }
            }}
            disabled={!product.in_stock}
            className="w-full bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
            size="sm"
          >
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}