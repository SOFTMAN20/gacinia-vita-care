import { ProductCard } from '@/components/ui/product-card';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useFeaturedProducts } from '@/hooks/useProducts';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import productsShowcase from '@/assets/products-showcase.jpg';

export function FeaturedProducts() {
  const { t } = useTranslation();
  const { addItem } = useCart();
  const navigate = useNavigate();
  const { products: featuredProducts, loading, error } = useFeaturedProducts();

  const handleAddToCart = (product: any) => {
    addItem(product, 1);
    toast.success(`${product.name} added to cart`);
  };

  const handleQuickView = (product: any) => {
    navigate(`/products/${product.id}`);
  };

  if (loading) {
    return (
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading featured products...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <p className="text-destructive">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t('featuredProducts', 'Featured Products')}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t('featuredProductsDescription', 'Discover our most popular healthcare products trusted by thousands of customers')}
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
              onQuickView={handleQuickView}
            />
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => navigate('/products')}
          >
            {t('viewAllProducts', 'View All Products')}
          </Button>
        </div>
      </div>
    </section>
  );
}