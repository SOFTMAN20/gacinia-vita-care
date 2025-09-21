import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCategories } from '@/hooks/useCategories';
import { Pill, Sparkles, Stethoscope, Building2, ArrowRight, LucideIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import categoryEquipment from '@/assets/category-equipment.jpg';
import categoryCosmetics from '@/assets/category-cosmetics.jpg';
import categoryMedicines from '@/assets/category-medicines.jpg';
import categoryWholesale from '@/assets/category-wholesale.jpg';

// Fallback images for categories without database images
const fallbackImages: Record<string, string> = {
  'prescription-medicines': categoryMedicines,
  'over-the-counter': categoryMedicines,
  'cosmetics-personal-care': categoryCosmetics,
  'first-aid-wellness': categoryEquipment,
  'medical-equipment': categoryEquipment,
};

const categoryIcons: Record<string, LucideIcon> = {
  'prescription-medicines': Pill,
  'over-the-counter': Pill,
  'cosmetics-personal-care': Sparkles,
  'first-aid-wellness': Stethoscope,
  'medical-equipment': Stethoscope,
};

export function CategoryGrid() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { categories, loading, error } = useCategories();

  if (loading) {
    return (
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading categories...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <p className="text-destructive">{error}</p>
            <Button 
              variant="outline" 
              onClick={() => window.location.reload()} 
              className="mt-4"
            >
              Try Again
            </Button>
          </div>
        </div>
      </section>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <p className="text-muted-foreground">No categories available at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t('shopByCategory', 'Shop by Category')}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t('categoryDescription', 'Discover our comprehensive range of healthcare products and services')}
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.map((category) => {
            const Icon = categoryIcons[category.slug] || Pill;
            return (
              <Card 
                key={category.id}
                className="group relative overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
                onClick={() => navigate(`/products?category=${category.slug}`)}
              >
                <div className="aspect-square relative">
                  <img 
                    src={category.image_url || fallbackImages[category.slug] || categoryMedicines} 
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <div className="flex items-center mb-2">
                      <Icon size={20} className="opacity-90 mr-2" />
                    </div>
                    <h3 className="font-semibold text-lg">{category.name}</h3>
                    <p className="text-sm opacity-90">{category.name_swahili}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <Button 
            variant="default" 
            size="lg" 
            className="shadow-lg"
            onClick={() => navigate('/products')}
          >
            {t('viewAllProducts', 'View All Products')}
            <ArrowRight size={20} />
          </Button>
        </div>
      </div>
    </section>
  );
}