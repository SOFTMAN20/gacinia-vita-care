import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pill, Sparkles, Stethoscope, Building2, ArrowRight } from 'lucide-react';
import categoryEquipment from '@/assets/category-equipment.jpg';
import categoryCosmetics from '@/assets/category-cosmetics.jpg';

export function CategoryGrid() {
  const language = 'en'; // This would come from global state

  const categories = [
    {
      id: 'medicines',
      name: language === 'en' ? 'Medicines' : 'Dawa',
      nameEn: 'Medicines',
      nameSw: 'Dawa',
      description: language === 'en' ? 'Prescription & OTC medications' : 'Dawa za uwongozi na za kawaida',
      descriptionEn: 'Prescription & OTC medications',
      descriptionSw: 'Dawa za uwongozi na za kawaida',
      icon: Pill,
      count: '500+',
      href: '/catalog/medicines',
      color: 'bg-primary',
      image: null, // Will use icon for this one
    },
    {
      id: 'cosmetics',
      name: language === 'en' ? 'Cosmetics' : 'Vipodozi',
      nameEn: 'Cosmetics',
      nameSw: 'Vipodozi',
      description: language === 'en' ? 'Beauty & personal care products' : 'Bidhaa za urembo na utunzaji wa kibinafsi',
      descriptionEn: 'Beauty & personal care products',
      descriptionSw: 'Bidhaa za urembo na utunzaji wa kibinafsi',
      icon: Sparkles,
      count: '200+',
      href: '/catalog/cosmetics',
      color: 'bg-secondary',
      image: categoryCosmetics,
    },
    {
      id: 'equipment',
      name: language === 'en' ? 'Medical Equipment' : 'Vifaa vya Matibabu',
      nameEn: 'Medical Equipment',
      nameSw: 'Vifaa vya Matibabu',
      description: language === 'en' ? 'Professional medical devices' : 'Vifaa vya kimatibabu vya kitaaluma',
      descriptionEn: 'Professional medical devices',
      descriptionSw: 'Vifaa vya kimatibabu vya kitaaluma',
      icon: Stethoscope,
      count: '150+',
      href: '/catalog/equipment',
      color: 'bg-accent',
      image: categoryEquipment,
    },
    {
      id: 'wholesale',
      name: language === 'en' ? 'Wholesale' : 'Jumla',
      nameEn: 'Wholesale',
      nameSw: 'Jumla',
      description: language === 'en' ? 'Bulk orders for healthcare facilities' : 'Mikataba ya jumla kwa vituo vya afya',
      descriptionEn: 'Bulk orders for healthcare facilities',
      descriptionSw: 'Mikataba ya jumla kwa vituo vya afya',
      icon: Building2,
      count: '1000+',
      href: '/wholesale',
      color: 'bg-gradient-secondary',
      image: null,
    },
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
            {language === 'en' ? 'Shop by Category' : 'Nunua kwa Jamii'}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {language === 'en' 
              ? 'Discover our comprehensive range of healthcare products and services'
              : 'Gundua mfumo wetu mkuu wa bidhaa na huduma za afya'
            }
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Card 
                key={category.id} 
                className="group relative overflow-hidden pharmacy-card border-0 shadow-lg hover:shadow-xl"
              >
                <div className="aspect-square relative">
                  {/* Background */}
                  <div className={`absolute inset-0 ${category.color} opacity-90`} />
                  
                  {/* Image or Icon */}
                  {category.image ? (
                    <>
                      <img
                        src={category.image}
                        alt={category.nameEn}
                        className="w-full h-full object-cover opacity-50"
                      />
                      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-black/20 to-black/40" />
                    </>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Icon size={80} className="text-white/90" />
                    </div>
                  )}

                  {/* Content Overlay */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-between text-white">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Icon size={24} className="opacity-90" />
                        <span className="text-sm font-medium bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                          {category.count}
                        </span>
                      </div>
                      <h3 className="font-heading text-xl font-bold mb-2">
                        {category.name}
                      </h3>
                      <p className="text-sm opacity-90 leading-relaxed">
                        {category.description}
                      </p>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="self-start mt-4 text-white border-white/30 hover:bg-white/20 hover:text-white group-hover:translate-x-1 transition-all"
                      asChild
                    >
                      <a href={category.href}>
                        {language === 'en' ? 'Explore' : 'Chunguza'}
                        <ArrowRight size={16} />
                      </a>
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <Button variant="pharmacy" size="lg" className="shadow-lg">
            {language === 'en' ? 'View All Products' : 'Ona Bidhaa Zote'}
            <ArrowRight size={20} />
          </Button>
        </div>
      </div>
    </section>
  );
}