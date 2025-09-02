import { Card, CardContent } from '@/components/ui/card';
import { Shield, Award, Truck, Clock, Users, CheckCircle } from 'lucide-react';

export function TrustSection() {
  const language = 'en'; // This would come from global state

  const trustFactors = [
    {
      icon: Shield,
      title: language === 'en' ? 'Licensed & Certified' : 'Imeidi hishwa na Kuthibitishwa',
      titleEn: 'Licensed & Certified',
      titleSw: 'Imeidi hishwa na Kuthibitishwa',
      description: language === 'en' 
        ? 'Fully licensed pharmacy with certified pharmacists on staff'
        : 'Duka la dawa lililoidhinishwa kikamilifu na madaktari wa dawa walioidhinishwa',
      descriptionEn: 'Fully licensed pharmacy with certified pharmacists on staff',
      descriptionSw: 'Duka la dawa lililoidhinishwa kikamilifu na madaktari wa dawa walioidhinishwa',
    },
    {
      icon: Award,
      title: language === 'en' ? 'Quality Guaranteed' : 'Ubora Unahakikishwa',
      titleEn: 'Quality Guaranteed',
      titleSw: 'Ubora Unahakikishwa',
      description: language === 'en'
        ? 'All products sourced from reputable manufacturers and suppliers'
        : 'Bidhaa zote zinapatikana kutoka kwa wauzaji na wauzaji wenye sifa nzuri',
      descriptionEn: 'All products sourced from reputable manufacturers and suppliers',
      descriptionSw: 'Bidhaa zote zinapatikana kutoka kwa wauzaji na wauzaji wenye sifa nzuri',
    },
    {
      icon: Truck,
      title: language === 'en' ? 'Fast Delivery' : 'Utoaji wa Haraka',
      titleEn: 'Fast Delivery',
      titleSw: 'Utoaji wa Haraka',
      description: language === 'en'
        ? 'Same-day delivery within Mbeya region for urgent medical needs'
        : 'Utoaji wa siku ile ile ndani ya eneo la Mbeya kwa mahitaji ya haraka ya matibabu',
      descriptionEn: 'Same-day delivery within Mbeya region for urgent medical needs',
      descriptionSw: 'Utoaji wa siku ile ile ndani ya eneo la Mbeya kwa mahitaji ya haraka ya matibabu',
    },
    {
      icon: Clock,
      title: language === 'en' ? '24/7 Support' : 'Msaada wa Siku 24',
      titleEn: '24/7 Support',
      titleSw: 'Msaada wa Siku 24',
      description: language === 'en'
        ? 'Round-the-clock customer support for medical emergencies'
        : 'Msaada wa wateja wa siku nzima kwa dharura za matibabu',
      descriptionEn: 'Round-the-clock customer support for medical emergencies',
      descriptionSw: 'Msaada wa wateja wa siku nzima kwa dharura za matibabu',
    },
    {
      icon: Users,
      title: language === 'en' ? 'Expert Staff' : 'Wafanyakazi Wataalamu',
      titleEn: 'Expert Staff',
      titleSw: 'Wafanyakazi Wataalamu',
      description: language === 'en'
        ? 'Experienced pharmacists ready to provide professional consultation'
        : 'Madaktari wa dawa wenye uzoefu tayari kutoa ushauri wa kitaaluma',
      descriptionEn: 'Experienced pharmacists ready to provide professional consultation',
      descriptionSw: 'Madaktari wa dawa wenye uzoefu tayari kutoa ushauri wa kitaaluma',
    },
    {
      icon: CheckCircle,
      title: language === 'en' ? 'Secure Payments' : 'Malipo Salama',
      titleEn: 'Secure Payments',
      titleSw: 'Malipo Salama',
      description: language === 'en'
        ? 'Multiple secure payment options including mobile money and cash'
        : 'Chaguo mbalimbali za malipo salama ikiwa ni pamoja na pesa za simu na taslimu',
      descriptionEn: 'Multiple secure payment options including mobile money and cash',
      descriptionSw: 'Chaguo mbalimbali za malipo salama ikiwa ni pamoja na pesa za simu na taslimu',
    },
  ];

  const stats = [
    {
      number: '10,000+',
      label: language === 'en' ? 'Happy Customers' : 'Wateja wenye Furaha',
      labelEn: 'Happy Customers',
      labelSw: 'Wateja wenye Furaha',
    },
    {
      number: '5+',
      label: language === 'en' ? 'Years Experience' : 'Miaka ya Uzoefu',
      labelEn: 'Years Experience',
      labelSw: 'Miaka ya Uzoefu',
    },
    {
      number: '1000+',
      label: language === 'en' ? 'Products Available' : 'Bidhaa Zinazopatikana',
      labelEn: 'Products Available',
      labelSw: 'Bidhaa Zinazopatikana',
    },
    {
      number: '24/7',
      label: language === 'en' ? 'Customer Support' : 'Msaada wa Wateja',
      labelEn: 'Customer Support',
      labelSw: 'Msaada wa Wateja',
    },
  ];

  return (
    <section className="py-16 bg-muted/50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
            {language === 'en' ? 'Why Choose Gacinia?' : 'Kwa Nini Uchague Gacinia?'}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {language === 'en' 
              ? 'Your health is our priority. We are committed to providing the highest quality healthcare products and services.'
              : 'Afya yako ni kipaumbele chetu. Tumejitolea kutoa bidhaa na huduma za afya za ubora wa juu.'
            }
          </p>
        </div>

        {/* Trust Factors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {trustFactors.map((factor, index) => {
            const Icon = factor.icon;
            return (
              <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-all duration-300 pharmacy-card">
                <CardContent className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                    <Icon size={32} className="text-primary" />
                  </div>
                  <h3 className="font-heading text-lg font-semibold mb-3 text-foreground">
                    {factor.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {factor.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Statistics */}
        <div className="bg-gradient-primary rounded-2xl p-8 text-white">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold mb-2">
                  {stat.number}
                </div>
                <div className="text-sm opacity-90">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            {language === 'en' ? 'Certified & Licensed by:' : 'Imethibitishwa na Kuidi hinishwa na:'}
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="text-xs font-medium">
              {language === 'en' ? 'Tanzania Pharmacy Council' : 'Baraza la Maduka ya Dawa Tanzania'}
            </div>
            <div className="text-xs font-medium">
              {language === 'en' ? 'Ministry of Health' : 'Wizara ya Afya'}
            </div>
            <div className="text-xs font-medium">
              {language === 'en' ? 'ISO 9001:2015' : 'ISO 9001:2015'}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}