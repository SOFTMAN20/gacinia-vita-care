import { useState, useEffect } from 'react';
import { Product } from '@/hooks/useProducts';
import { ProductCard } from '@/components/ui/product-card';
import { useCart } from '@/contexts/CartContext';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';

interface RelatedProductsProps {
  currentProductId: string;
  category: string;
}

export function RelatedProducts({ currentProductId, category }: RelatedProductsProps) {
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addItem } = useCart();

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        // First, get the category ID from the category slug
        const { data: categoryData, error: categoryError } = await supabase
          .from('categories')
          .select('id')
          .eq('slug', category)
          .maybeSingle();

        if (categoryError) throw categoryError;
        if (!categoryData) {
          setRelatedProducts([]);
          return;
        }

        // Fetch products from the same category, excluding current product
        const { data: products, error: productsError } = await supabase
          .from('products')
          .select(`
            *,
            category:categories(*)
          `)
          .eq('category_id', categoryData.id)
          .eq('is_active', true)
          .neq('id', currentProductId)
          .limit(6);

        if (productsError) throw productsError;

        setRelatedProducts(products || []);
      } catch (err) {
        console.error('Error fetching related products:', err);
        setError('Failed to load related products');
      } finally {
        setLoading(false);
      }
    };

    if (category) {
      fetchRelatedProducts();
    }
  }, [category, currentProductId]);

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
      quantity: 1
    });
  };

  const handleQuickView = (product: Product) => {
    // Navigate to product detail page
    window.location.href = `/products/${product.id}`;
  };

  if (loading) {
    return (
      <div className="py-8">
        <h3 className="text-xl font-semibold mb-6">Related Products</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="space-y-3">
              <Skeleton className="aspect-[3/4] w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8">
        <h3 className="text-xl font-semibold mb-4">Related Products</h3>
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  if (relatedProducts.length === 0) {
    return (
      <div className="py-8">
        <h3 className="text-xl font-semibold mb-4">Related Products</h3>
        <p className="text-muted-foreground">
          No related products found in this category.
        </p>
      </div>
    );
  }

  return (
    <div className="py-8">
      <h3 className="text-xl font-semibold mb-6">Related Products</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {relatedProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={handleAddToCart}
            onQuickView={handleQuickView}
          />
        ))}
      </div>
    </div>
  );
}