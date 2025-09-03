import { Grid, List, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductCard, Product } from '@/components/ui/product-card';
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
  isLoading?: boolean;
}

function ProductListItem({ 
  product, 
  onAddToCart, 
  onQuickView, 
  onToggleWishlist 
}: { 
  product: Product;
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
}) {
  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex gap-4">
          {/* Product Image */}
          <div className="relative w-32 h-32 flex-shrink-0">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover rounded-lg"
              loading="lazy"
            />
            {!product.inStock && (
              <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                <Badge variant="destructive" className="text-xs">
                  Out of Stock
                </Badge>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col h-full">
              <div className="flex-1">
                <h3 className="font-medium text-lg mb-2 line-clamp-2">
                  {product.name}
                </h3>
                
                <p className="text-sm text-muted-foreground capitalize mb-2">
                  {product.category.replace('-', ' ')}
                </p>

                {/* Badges */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {discountPercentage > 0 && (
                    <Badge className="bg-error text-error-foreground text-xs">
                      -{discountPercentage}%
                    </Badge>
                  )}
                  {product.requiresPrescription && (
                    <Badge variant="outline" className="text-xs">
                      Prescription Required
                    </Badge>
                  )}
                  {product.wholesaleAvailable && (
                    <Badge variant="outline" className="text-xs">
                      Wholesale
                    </Badge>
                  )}
                </div>

                {/* Rating */}
                {product.rating && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                    <span className="text-accent">★</span>
                    <span>{product.rating}</span>
                    {product.reviewCount && (
                      <span>({product.reviewCount} reviews)</span>
                    )}
                  </div>
                )}
              </div>

              {/* Price and Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-lg">
                    TZS {product.price.toLocaleString()}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-muted-foreground line-through">
                      TZS {product.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onQuickView(product)}
                  >
                    Quick View
                  </Button>
                  <Button
                    onClick={() => onAddToCart(product)}
                    disabled={!product.inStock}
                    size="sm"
                  >
                    {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState() {
  return (
    <div className="col-span-full text-center py-12">
      <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
      <h3 className="font-semibold text-lg mb-2">No products found</h3>
      <p className="text-muted-foreground mb-4">
        Try adjusting your filters or search terms
      </p>
      <Button variant="outline">
        Clear Filters
      </Button>
    </div>
  );
}

function LoadingSkeleton({ viewMode }: { viewMode: ViewMode }) {
  const items = Array.from({ length: viewMode === 'grid' ? 12 : 6 }, (_, i) => i);
  
  if (viewMode === 'list') {
    return (
      <>
        {items.map(i => (
          <Card key={i} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex gap-4">
                <div className="w-32 h-32 bg-muted rounded-lg animate-pulse" />
                <div className="flex-1 space-y-3">
                  <div className="h-4 bg-muted rounded animate-pulse" />
                  <div className="h-3 bg-muted rounded w-1/3 animate-pulse" />
                  <div className="h-3 bg-muted rounded w-1/2 animate-pulse" />
                  <div className="flex justify-between items-center mt-4">
                    <div className="h-5 bg-muted rounded w-20 animate-pulse" />
                    <div className="h-8 bg-muted rounded w-24 animate-pulse" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </>
    );
  }

  return (
    <>
      {items.map(i => (
        <Card key={i} className="overflow-hidden">
          <div className="aspect-square bg-muted animate-pulse" />
          <CardContent className="p-4 space-y-2">
            <div className="h-4 bg-muted rounded animate-pulse" />
            <div className="h-3 bg-muted rounded w-2/3 animate-pulse" />
            <div className="h-5 bg-muted rounded w-1/2 animate-pulse" />
            <div className="h-8 bg-muted rounded animate-pulse" />
          </CardContent>
        </Card>
      ))}
    </>
  );
}

export function ProductGrid({
  products,
  viewMode,
  onViewModeChange,
  onAddToCart,
  onQuickView,
  onToggleWishlist,
  isLoading = false
}: ProductGridProps) {
  if (isLoading) {
    return (
      <div className={`grid gap-6 ${
        viewMode === 'grid' 
          ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
          : 'grid-cols-1'
      }`}>
        <LoadingSkeleton viewMode={viewMode} />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="grid grid-cols-1">
        <EmptyState />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* View Mode Toggle */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          Showing {products.length} products
        </p>
        
        <div className="flex gap-1 border rounded-lg p-1">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('grid')}
            className="px-3"
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('list')}
            className="px-3"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Products Grid/List */}
      <div className={`grid gap-6 ${
        viewMode === 'grid' 
          ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
          : 'grid-cols-1'
      }`}>
        {viewMode === 'grid' ? (
          products.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              onQuickView={onQuickView}
              onToggleWishlist={onToggleWishlist}
            />
          ))
        ) : (
          products.map(product => (
            <ProductListItem
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              onQuickView={onQuickView}
              onToggleWishlist={onToggleWishlist}
            />
          ))
        )}
      </div>
    </div>
  );
}