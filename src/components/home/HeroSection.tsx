import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ShoppingBag, Building2 } from 'lucide-react';
import heroImage from '@/assets/hero-pharmacy.jpg';

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Your Trusted Healthcare Partner",
      subtitle: "Quality medicines, cosmetics & medical equipment for everyone",
      titleSw: "Mshirika wako wa Afya wa Kuaminika",
      subtitleSw: "Dawa za ubora, vipodozi na vifaa vya matibabu kwa kila mtu",
      cta1: "Shop Now",
      cta1Sw: "Nunua Sasa",
      cta2: "Wholesale Portal",
      cta2Sw: "Jumla",
    },
    {
      title: "Professional Medical Supplies",
      subtitle: "Serving hospitals, clinics & healthcare facilities across Mbeya",
      titleSw: "Vifaa vya Kimatibabu vya Kitaaluma",
      subtitleSw: "Kutumikia hospitali, kliniki na vituo vya afya kote Mbeya",
      cta1: "Browse Catalog",
      cta1Sw: "Tazama Katalogi",
      cta2: "Contact Us",
      cta2Sw: "Wasiliana Nasi",
    },
    {
      title: "Fast & Reliable Delivery",
      subtitle: "Same-day delivery within Mbeya region for your convenience",
      titleSw: "Utoaji wa Haraka na wa Kutegemewa",
      subtitleSw: "Utoaji wa siku moja ndani ya eneo la Mbeya kwa urahisi wako",
      cta1: "Order Now",
      cta1Sw: "Agiza Sasa",
      cta2: "Learn More",
      cta2Sw: "Jua Zaidi",
    },
  ];

  const [language] = useState<'en' | 'sw'>('en'); // This would come from global state

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const currentSlideData = slides[currentSlide];

  return (
    <section className="relative h-[70vh] min-h-[500px] overflow-hidden bg-gradient-hero">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Gacinia Pharmacy Interior"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/60 to-secondary/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
        <div className="max-w-3xl text-white">
          <h1 className="font-heading text-4xl md:text-6xl font-bold mb-6 leading-tight">
            {language === 'en' ? currentSlideData.title : currentSlideData.titleSw}
          </h1>
          <p className="text-lg md:text-xl mb-8 opacity-90 leading-relaxed">
            {language === 'en' ? currentSlideData.subtitle : currentSlideData.subtitleSw}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="hero" size="lg" className="text-base px-8">
              <ShoppingBag size={20} />
              {language === 'en' ? currentSlideData.cta1 : currentSlideData.cta1Sw}
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-base px-8 border-white text-white hover:bg-white hover:text-primary"
            >
              <Building2 size={20} />
              {language === 'en' ? currentSlideData.cta2 : currentSlideData.cta2Sw}
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 flex flex-wrap items-center gap-6 text-sm opacity-80">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-accent rounded-full"></div>
              <span>{language === 'en' ? 'Licensed Pharmacy' : 'Duka la Dawa Lililoidhinishwa'}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-accent rounded-full"></div>
              <span>{language === 'en' ? 'Quality Assured' : 'Ubora Unahakikishwa'}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-accent rounded-full"></div>
              <span>{language === 'en' ? 'Fast Delivery' : 'Utoaji wa Haraka'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-2 rounded-full transition-all"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-2 rounded-full transition-all"
      >
        <ChevronRight size={24} />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide 
                ? 'bg-white' 
                : 'bg-white/40 hover:bg-white/60'
            }`}
          />
        ))}
      </div>
    </section>
  );
}