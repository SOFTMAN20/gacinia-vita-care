import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Heart, Star, Pill } from 'lucide-react';
import productsShowcase from '@/assets/products-showcase.jpg';

interface Product {
  id: string;
  name: string;
  nameSw: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  category: string;
  categorySw: string;
  inStock: boolean;
  isNew?: boolean;
  isPrescriptionRequired?: boolean;
  image: string;
  wholesaleAvailable?: boolean;
}

export function FeaturedProducts() {
  const language = 'en'; // This would come from global state

  // Mock product data - in real app this would come from API
  const products: Product[] = [
    {
      id: '1',
      name: 'Paracetamol 500mg',
      nameSw: 'Paracetamol 500mg',
      price: 2500,
      originalPrice: 3000,
      rating: 4.8,
      reviews: 124,
      category: 'Pain Relief',
      categorySw: 'Kupunguza Maumivu',
      inStock: true,
      isNew: true,
      isPrescriptionRequired: false,
      image: productsShowcase,
      wholesaleAvailable: true,
    },
    {
      id: '2',
      name: 'Vitamin C Tablets',
      nameSw: 'Tembe za Vitamini C',
      price: 1800,
      rating: 4.6,
      reviews: 89,
      category: 'Vitamins',
      categorySw: 'Vitamini',
      inStock: true,
      isPrescriptionRequired: false,
      image: productsShowcase,
      wholesaleAvailable: true,
    },
    {
      id: '3',
      name: 'Antibacterial Hand Sanitizer',
      nameSw: 'Sabuni ya Mikono Inayoua Vijidudu',
      price: 3500,
      rating: 4.9,
      reviews: 156,
      category: 'Personal Care',
      categorySw: 'Utunzaji wa Kibinafsi',
      inStock: true,
      image: productsShowcase,
    },
    {
      id: '4',
      name: 'Digital Thermometer',
      nameSw: 'Kipima Joto cha Kidijitali',
      price: 15000,
      originalPrice: 18000,
      rating: 4.7,
      reviews: 67,
      category: 'Medical Equipment',
      categorySw: 'Vifaa vya Matibabu',
      inStock: true,
      image: productsShowcase,
      wholesaleAvailable: true,
    },
    {
      id: '5',
      name: 'Moisturizing Cream',
      nameSw: 'Mafuta ya Kunyesha Ngozi',
      price: 4200,
      rating: 4.5,
      reviews: 93,
      category: 'Cosmetics',
      categorySw: 'Vipodozi',
      inStock: true,
      isNew: true,
      image: productsShowcase,
    },
    {
      id: '6',
      name: 'Blood Pressure Monitor',
      nameSw: 'Kipima Shinikizo la Damu',
      price: 85000,
      rating: 4.8,
      reviews: 45,
      category: 'Medical Equipment',
      categorySw: 'Vifaa vya Matibabu',
      inStock: true,
      isPrescriptionRequired: false,
      image: productsShowcase,
      wholesaleAvailable: true,
    },
    {
      id: '7',
      name: 'Cough Syrup',
      nameSw: 'Dawa ya Kikohozi',
      price: 5500,
      rating: 4.4,
      reviews: 78,
      category: 'Respiratory',
      categorySw: 'Upumuaji',
      inStock: false,
      isPrescriptionRequired: true,
      image: productsShowcase,
    },
    {
      id: '8',
      name: 'First Aid Kit',
      nameSw: 'Sanduku la Huduma za Kwanza',
      price: 12000,
      originalPrice: 15000,
      rating: 4.9,
      reviews: 112,
      category: 'Emergency Care',
      categorySw: 'Huduma za Dharura',
      inStock: true,
      image: productsShowcase,
      wholesaleAvailable: true,
    },
  ];

  const formatPrice = (price: number) => {
    return `TSh ${price.toLocaleString()}`;
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
            <Card 
              key={product.id} 
              className="group relative overflow-hidden pharmacy-card border shadow-md hover:shadow-lg"
            >
              <CardContent className="p-0">
                {/* Product Image */}
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={product.image}
                    alt={language === 'en' ? product.name : product.nameSw}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {product.isNew && (
                      <Badge className="bg-accent text-accent-foreground text-xs">
                        {language === 'en' ? 'New' : 'Mpya'}
                      </Badge>
                    )}
                    {product.originalPrice && (
                      <Badge className="bg-error text-error-foreground text-xs">
                        {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                      </Badge>
                    )}
                    {product.wholesaleAvailable && (
                      <Badge variant="outline" className="bg-white/90 text-xs">
                        {language === 'en' ? 'Wholesale' : 'Jumla'}
                      </Badge>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="bg-white/90 text-foreground hover:bg-white hover:text-error w-8 h-8"
                    >
                      <Heart size={16} />
                    </Button>
                  </div>

                  {/* Stock Status */}
                  {!product.inStock && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Badge className="bg-error text-error-foreground">
                        {language === 'en' ? 'Out of Stock' : 'Haijapatikana'}
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <div className="mb-2">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">
                      {language === 'en' ? product.category : product.categorySw}
                    </p>
                    <h3 className="font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                      {language === 'en' ? product.name : product.nameSw}
                    </h3>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-3">
                    <div className="flex items-center">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={12}
                          className={i < Math.floor(product.rating) 
                            ? 'fill-accent text-accent' 
                            : 'text-muted-foreground'
                          }
                        />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      ({product.reviews})
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="font-bold text-foreground">
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>

                  {/* Prescription Badge */}
                  {product.isPrescriptionRequired && (
                    <div className="flex items-center gap-1 mb-3 text-xs text-warning">
                      <Pill size={12} />
                      <span>{language === 'en' ? 'Prescription Required' : 'Inayohitaji Uwongozi'}</span>
                    </div>
                  )}

                  {/* Add to Cart Button */}
                  <Button
                    variant="pharmacy"
                    size="sm"
                    className="w-full"
                    disabled={!product.inStock}
                  >
                    <ShoppingCart size={16} />
                    {language === 'en' ? 'Add to Cart' : 'Ongeza Kikabuni'}
                  </Button>
                </div>
              </CardContent>
            </Card>
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