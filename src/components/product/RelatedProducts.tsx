import { useState, useEffect } from 'react';
import { ProductCard } from '@/components/ui/product-card';
import { Product } from '@/hooks/useProducts';
import { useCart } from '@/contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface RelatedProductsProps {
  currentProductId: string;
  categoryId: string;
  limit?: number;
}

export function RelatedProducts({ 
  currentProductId, 
  categoryId, 
  limit = 4 
}: RelatedProductsProps) {
  const { addItem } = useCart();
  const navigate = useNavigate();
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRelatedProducts();
  }, [categoryId, currentProductId]);

  const fetchRelatedProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch products from the same category, excluding the current product
      const { data, error: fetchError } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(*)
        `)
        .eq('category_id', categoryId)
        .eq('is_active', true)
        .neq('id', currentProductId) // Exclude current product
        .order('created_at', { ascending: false })
        .limit(limit);

      if (fetchError) {
        throw fetchError;
      }

      setRelatedProducts(data || []);
    } catch (err) {
      console.error('Error fetching related products:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch related products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product: Product) => {
    addItem(product, 1);
  };

  const handleQuickView = (product: Product) => {
    navigate(`/products/${product.id}`);
  };

  const handleToggleWishlist = (product: Product) => {
    // TODO: Implement wishlist functionality
    console.log('Toggle wishlist for product:', product.id);
  };

  if (loading) {
    return (
      <div className="py-8">
        <h3 className="text-xl font-semibold mb-6">Related Products</h3>
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8">
        <h3 className="text-xl font-semibold mb-6">Related Products</h3>
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">{error}</p>
          <button 
            onClick={fetchRelatedProducts}
            className="text-primary hover:underline"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (relatedProducts.length === 0) {
    return (
      <div className="py-8">
        <h3 className="text-xl font-semibold mb-6">Related Products</h3>
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            No related products found in this category.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <h3 className="text-xl font-semibold mb-6">Related Products</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {relatedProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={handleAddToCart}
            onQuickView={handleQuickView}
            onToggleWishlist={handleToggleWishlist}
            className="h-full"
          />
        ))}
      </div>
    </div>
  );
}