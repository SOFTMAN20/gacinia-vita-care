import { ProductCard, Product } from '@/components/ui/product-card';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';
import productsShowcase from '@/assets/products-showcase.jpg';


export function FeaturedProducts() {
  const language = 'en'; // This would come from global state
  const { addItem } = useCart();

  // Mock product data - in real app this would come from API
  const products: Product[] = [
    {
      id: '1',
      name: 'Paracetamol 500mg',
      price: 2500,
      originalPrice: 3000,
      rating: 4.8,
      reviewCount: 124,
      category: 'Pain Relief',
      inStock: true,
      requiresPrescription: false,
      image: productsShowcase,
      wholesaleAvailable: true,
    },
    {
      id: '2',
      name: 'Vitamin C Tablets',
      price: 1800,
      rating: 4.6,
      reviewCount: 89,
      category: 'Vitamins',
      inStock: true,
      requiresPrescription: false,
      image: productsShowcase,
      wholesaleAvailable: true,
    },
    {
      id: '3',
      name: 'Antibacterial Hand Sanitizer',
      price: 3500,
      rating: 4.9,
      reviewCount: 156,
      category: 'Personal Care',
      inStock: true,
      image: productsShowcase,
    },
    {
      id: '4',
      name: 'Digital Thermometer',
      price: 15000,
      originalPrice: 18000,
      rating: 4.7,
      reviewCount: 67,
      category: 'Medical Equipment',
      inStock: true,
      image: productsShowcase,
      wholesaleAvailable: true,
    },
    {
      id: '5',
      name: 'Moisturizing Cream',
      price: 4200,
      rating: 4.5,
      reviewCount: 93,
      category: 'Cosmetics',
      inStock: true,
      image: productsShowcase,
    },
    {
      id: '6',
      name: 'Blood Pressure Monitor',
      price: 85000,
      rating: 4.8,
      reviewCount: 45,
      category: 'Medical Equipment',
      inStock: true,
      requiresPrescription: false,
      image: productsShowcase,
      wholesaleAvailable: true,
    },
    {
      id: '7',
      name: 'Cough Syrup',
      price: 5500,
      rating: 4.4,
      reviewCount: 78,
      category: 'Respiratory',
      inStock: false,
      requiresPrescription: true,
      image: productsShowcase,
    },
    {
      id: '8',
      name: 'First Aid Kit',
      price: 12000,
      originalPrice: 15000,
      rating: 4.9,
      reviewCount: 112,
      category: 'Emergency Care',
      inStock: true,
      image: productsShowcase,
      wholesaleAvailable: true,
    },
  ];

  const handleAddToCart = (product: Product) => {
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
            {language === 'en' ? 'Featured Products' : 'Bidhaa Maalum'}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {language === 'en' 
              ? 'Discover our most popular and trusted healthcare products'
              : 'Gundua bidhaa zetu maarufu na za kuaminika za afya'
            }
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            {language === 'en' ? 'View All Products' : 'Ona Bidhaa Zote'}
          </Button>
        </div>
      </div>
    </section>
  );
}