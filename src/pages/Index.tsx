import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/home/HeroSection';
import { CategoryGrid } from '@/components/home/CategoryGrid';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { TrustSection } from '@/components/home/TrustSection';
import { PromotionalBanners } from '@/components/home/PromotionalBanners';
import { LocationContact } from '@/components/home/LocationContact';
import { AccessibilitySkipLinks } from '@/components/ui/accessibility-skip-links';
import { PerformanceMonitor } from '@/components/ui/performance-monitor';
import { SEOHead } from '@/components/ui/seo-head';
import { useCart } from '@/contexts/CartContext';

const Index = () => {
  const { state } = useCart();
  
  return (
    <>
      <SEOHead 
        title="Gacinia Pharmacy & Medical Supplies - Quality Healthcare in Mbeya"
        description="Your trusted pharmacy in Mbeya, Tanzania. Quality medicines, cosmetics, medical equipment and wholesale supplies. Licensed pharmacy with professional service."
        keywords={['pharmacy mbeya', 'medical supplies tanzania', 'prescription medicines', 'cosmetics', 'healthcare mbeya']}
        canonicalUrl="https://gacinia.co.tz"
      />
      <PerformanceMonitor />
      <AccessibilitySkipLinks />
      
      <div className="min-h-screen bg-background">
        <Navbar cartItemCount={state.totalItems} />
        <main id="main-content" role="main">
          <HeroSection />
          <CategoryGrid />
          <FeaturedProducts />
          <PromotionalBanners />
          <TrustSection />
          <LocationContact />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
