import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/home/HeroSection';
import { CategoryGrid } from '@/components/home/CategoryGrid';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { TrustSection } from '@/components/home/TrustSection';
import { PromotionalBanners } from '@/components/home/PromotionalBanners';
import { LocationContact } from '@/components/home/LocationContact';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar cartItemCount={3} />
      <main>
        <HeroSection />
        <CategoryGrid />
        <FeaturedProducts />
        <PromotionalBanners />
        <TrustSection />
        <LocationContact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
