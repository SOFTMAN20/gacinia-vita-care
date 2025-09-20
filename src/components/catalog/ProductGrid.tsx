import { useState } from 'react';
import { Grid, List, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/ui/product-card';
import { Product } from '@/hooks/useProducts';
import { ProductQuickView } from '@/components/product/ProductQuickView';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export type ViewMode = 'grid' | 'list';

interface ProductGridProps {
  products: Product[];
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
}

export function ProductGrid({
  products,
  viewMode,
  onViewModeChange,
  onAddToCart,
  onQuickView,
  onToggleWishlist
}: ProductGridProps) {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const discountPercentage = (product: Product) => {
    return product.original_price 
      ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
      : 0;
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <img
          src="/placeholder.svg"
          alt="No products found"
          className="mx-auto w-48 h-48 object-cover opacity-50"
        />
        <h3 className="text-lg font-medium text-muted-foreground mt-4">No products found</h3>
        <p className="text-sm text-muted-foreground mt-2">
          Try adjusting your search criteria or filters
        </p>
      </div>
    );
  }

  if (viewMode === 'list') {
    return (
      <div className="space-y-4">
        {products.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex gap-6">
                <img
                  src={product.image_url || '/placeholder.svg'}
                  alt={product.name}
                  className="w-32 h-32 object-cover rounded-lg"
                />
                
                <div className="flex-1 space-y-4">
                  {/* Top Row */}
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{product.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {product.category?.name?.replace(/([A-Z])/g, ' $1').trim()}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge variant={product.in_stock ? "default" : "secondary"}>
                        {product.in_stock ? 'In Stock' : 'Out of Stock'}
                      </Badge>
                      {product.requires_prescription && (
                        <Badge variant="outline" className="text-orange-600 border-orange-200">
                          Prescription Required
                        </Badge>
                      )}
                      {product.wholesale_available && (
                        <Badge variant="outline" className="text-blue-600 border-blue-200">
                          Wholesale Available
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {product.description || 'No description available'}
                  </p>

                  {/* Rating and Reviews */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={i < Math.floor(product.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}>
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {product.rating} ({product.review_count} reviews)
                      </span>
                    </div>
                  </div>

                  {/* Bottom Row */}
                  <div className="flex justify-between items-center">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xl">
                          TZS {product.price.toLocaleString()}
                        </span>
                        {product.original_price && (
                          <span className="text-sm text-muted-foreground line-through">
                            TZS {product.original_price.toLocaleString()}
                          </span>
                        )}
                        {discountPercentage(product) > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            -{discountPercentage(product)}%
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onQuickView(product)}
                        disabled={!product.in_stock}
                      >
                        Quick View
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => onAddToCart(product)}
                        disabled={!product.in_stock}
                      >
                        {product.in_stock ? 'Add to Cart' : 'Out of Stock'}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        <ProductQuickView
          product={quickViewProduct}
          isOpen={!!quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
          onQuickView={onQuickView}
          onToggleWishlist={onToggleWishlist}
        />
      ))}

      <ProductQuickView
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
}