import { ProductCard, Product } from '@/components/ui/product-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef } from 'react';

interface RelatedProductsProps {
  currentProductId: string;
  category: string;
}

// Sample related products - in real app, this would come from an API
const sampleRelatedProducts: Product[] = [
  {
    id: '101',
    name: 'Paracetamol 500mg Tablets',
    price: 1500,
    originalPrice: 2000,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400',
    category: 'over-the-counter',
    inStock: true,
    stockCount: 25,
    rating: 4.5,
    reviewCount: 32,
    brand: 'Generic'
  },
  {
    id: '102',
    name: 'Ibuprofen 400mg Tablets',
    price: 3000,
    image: 'https://images.unsplash.com/photo-1585435557343-3b092031d8df?w=400',
    category: 'over-the-counter',
    inStock: true,
    stockCount: 15,
    rating: 4.2,
    reviewCount: 28,
    brand: 'Advil'
  },
  {
    id: '103',
    name: 'Aspirin 325mg Tablets',
    price: 2200,
    originalPrice: 2800,
    image: 'https://images.unsplash.com/photo-1576671081837-49000212a370?w=400',
    category: 'over-the-counter',
    inStock: true,
    stockCount: 30,
    rating: 4.3,
    reviewCount: 45,
    brand: 'Bayer'
  },
  {
    id: '104',
    name: 'Vitamin C Tablets',
    price: 4500,
    image: 'https://images.unsplash.com/photo-1550572017-edd951aa8cc0?w=400',
    category: 'wellness',
    inStock: true,
    stockCount: 20,
    rating: 4.7,
    reviewCount: 56,
    brand: 'Nature\'s Way'
  }
];

export function RelatedProducts({ currentProductId, category }: RelatedProductsProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  // Filter out current product and limit to 4 products
  const relatedProducts = sampleRelatedProducts
    .filter(product => product.id !== currentProductId)
    .slice(0, 4);

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">You Might Also Like</CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={scrollLeft}
                className="w-8 h-8 p-0"
              >
                <ChevronLeft size={16} />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={scrollRight}
                className="w-8 h-8 p-0"
              >
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide pb-4"
            style={{ scrollSnapType: 'x mandatory' }}
          >
            {relatedProducts.map((product) => (
              <div
                key={product.id}
                className="flex-shrink-0 w-64"
                style={{ scrollSnapAlign: 'start' }}
              >
                <ProductCard
                  product={product}
                  onAddToCart={(product) => {
                    console.log('Add to cart:', product);
                  }}
                  onQuickView={(product) => {
                    console.log('Quick view:', product);
                  }}
                  onToggleWishlist={(product) => {
                    console.log('Toggle wishlist:', product);
                  }}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Frequently Bought Together */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Frequently Bought Together</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=100"
                  alt="Current product"
                  className="w-16 h-16 object-cover rounded"
                />
                <span className="text-2xl text-muted-foreground">+</span>
                <img
                  src={relatedProducts[0]?.image}
                  alt={relatedProducts[0]?.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <span className="text-2xl text-muted-foreground">+</span>
                <img
                  src={relatedProducts[1]?.image}
                  alt={relatedProducts[1]?.name}
                  className="w-16 h-16 object-cover rounded"
                />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-2">
                  Total bundle price: <span className="text-lg font-semibold text-primary">
                    TZS 8,500
                  </span>
                  <span className="text-sm text-muted-foreground line-through ml-2">
                    TZS 9,500
                  </span>
                </p>
                <Button className="w-full">
                  Add Bundle to Cart
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}