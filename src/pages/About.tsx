import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SEOHead } from '@/components/ui/seo-head';
import { AccessibilitySkipLinks } from '@/components/ui/accessibility-skip-links';
import { useCart } from '@/contexts/CartContext';
import { 
  Heart,
  Shield,
  Users,
  Award,
  Clock,
  MapPin,
  Phone,
  Mail,
  Stethoscope,
  Building2,
  Target,
  CheckCircle,
  Star,
  Truck,
  UserCheck,
  Globe
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const About = () => {
  const { state } = useCart();
  const navigate = useNavigate();

  const values = [
    {
      icon: Heart,
      title: 'Patient Care First',
      titleSw: 'Utunzaji wa Mgonjwa Kwanza',
      description: 'Every decision we make is centered around improving patient health and wellbeing.',
      descriptionSw: 'Kila uamuzi tunaoufanya unazingatia kuboresha afya na ustawi wa mgonjwa.'
    },
    {
      icon: Shield,
      title: 'Quality Assurance',
      titleSw: 'Uhakikisho wa Ubora',
      description: 'We maintain the highest standards in pharmaceutical care and product quality.',
      descriptionSw: 'Tunadumisha viwango vya juu zaidi katika utunzaji wa dawa na ubora wa bidhaa.'
    },
    {
      icon: Users,
      title: 'Community Focus',
      titleSw: 'Umakini wa Jamii',
      description: 'Serving the Mbeya community with dedication and building lasting relationships.',
      descriptionSw: 'Kutumikia jamii ya Mbeya kwa bidii na kujenga mahusiano ya kudumu.'
    },
    {
      icon: Award,
      title: 'Professional Excellence',
      titleSw: 'Ubora wa Kitaaluma',
      description: 'Our team of qualified pharmacists ensures expert guidance and service.',
      descriptionSw: 'Timu yetu ya madaktari wa dawa wenye sifa inahakikisha uongozi wa kitaaluma na huduma.'
    }
  ];

  const services = [
    {
      icon: Stethoscope,
      title: 'Prescription Services',
      titleSw: 'Huduma za Dawa za Uwongozi',
      description: 'Expert prescription fulfillment with thorough consultation and guidance.',
      descriptionSw: 'Utimizaji wa dawa za uwongozi kwa ushauri wa kitaaluma na uongozi.'
    },
    {
      icon: Building2,
      title: 'Wholesale Supply',
      titleSw: 'Ugavi wa Jumla',
      description: 'Bulk pharmaceutical supplies for hospitals, clinics, and healthcare facilities.',
      descriptionSw: 'Ugavi wa dawa kwa wingi kwa hospitali, kliniki na vituo vya afya.'
    },
    {
      icon: Truck,
      title: 'Home Delivery',
      titleSw: 'Utoaji Nyumbani',
      description: 'Convenient delivery service within Mbeya region for your healthcare needs.',
      descriptionSw: 'Huduma ya utoaji wa urahisi ndani ya mkoa wa Mbeya kwa mahitaji yako ya afya.'
    },
    {
      icon: UserCheck,
      title: 'Health Consultations',
      titleSw: 'Ushauri wa Afya',
      description: 'Professional health advice and medication counseling from qualified pharmacists.',
      descriptionSw: 'Ushauri wa kitaaluma wa afya na ushauri wa dawa kutoka kwa madaktari wa dawa wenye sifa.'
    }
  ];

  const certifications = [
    {
      title: 'Licensed Pharmacy',
      titleSw: 'Duka la Dawa Lililoidhinishwa',
      authority: 'Tanzania Pharmacy Council',
      year: '2020'
    },
    {
      title: 'Quality Management System',
      titleSw: 'Mfumo wa Usimamizi wa Ubora',
      authority: 'ISO 9001:2015 Certified',
      year: '2022'
    },
    {
      title: 'Good Distribution Practice',
      titleSw: 'Mazoezi Mazuri ya Ugavi',
      authority: 'WHO-GDP Compliant',
      year: '2021'
    }
  ];

  const stats = [
    { number: '5000+', label: 'Happy Customers', labelSw: 'Wateja Wenye Furaha' },
    { number: '3+', label: 'Years of Service', labelSw: 'Miaka ya Huduma' },
    { number: '50+', label: 'Healthcare Partners', labelSw: 'Washirika wa Afya' },
    { number: '24/7', label: 'Emergency Support', labelSw: 'Msaada wa Dharura' }
  ];

  const language = 'en'; // This would come from language context

  return (
    <>
      <SEOHead 
        title="About Us - Gacinia Pharmacy & Medical Supplies"
        description="Learn about Gacinia Pharmacy's mission to provide quality healthcare services in Mbeya, Tanzania. Our story, values, and commitment to community health."
        keywords={['about gacinia pharmacy', 'mbeya pharmacy', 'healthcare mbeya', 'pharmacy mission', 'medical supplies tanzania']}
        canonicalUrl="https://gacinia.co.tz/about"
      />
      <AccessibilitySkipLinks />
      
      <div className="min-h-screen bg-background">
        <Navbar cartItemCount={state.totalItems} />
        
        <main id="main-content" role="main">
          {/* Hero Section */}
          <section className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-16">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                <Badge variant="secondary" className="mb-4">
                  {language === 'en' ? 'About Gacinia Pharmacy' : 'Kuhusu Gacinia Pharmacy'}
                </Badge>
                <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
                  {language === 'en' 
                    ? 'Your Trusted Healthcare Partner in Mbeya' 
                    : 'Mshirika Wako wa Kuaminika wa Afya Mbeya'
                  }
                </h1>
                <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                  {language === 'en'
                    ? 'Since 2020, Gacinia Pharmacy has been dedicated to providing quality pharmaceutical services, medical supplies, and healthcare solutions to the Mbeya community and beyond.'
                    : 'Tangu 2020, Gacinia Pharmacy imejitoa kutoa huduma za ubora za dawa, vifaa vya matibabu, na suluhisho za afya kwa jamii ya Mbeya na zaidi.'
                  }
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    size="lg" 
                    onClick={() => navigate('/products')}
                    className="bg-primary hover:bg-primary/90"
                  >
                    {language === 'en' ? 'Shop Our Products' : 'Nunua Bidhaa Zetu'}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg"
                    onClick={() => navigate('/contact')}
                  >
                    {language === 'en' ? 'Contact Us' : 'Wasiliana Nasi'}
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <section className="py-12 bg-primary text-primary-foreground">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                {stats.map((stat, index) => (
                  <div key={index} className="space-y-2">
                    <div className="text-3xl md:text-4xl font-bold">{stat.number}</div>
                    <div className="text-sm opacity-90">
                      {language === 'en' ? stat.label : stat.labelSw}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Our Story Section */}
          <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="font-heading text-3xl font-bold text-foreground mb-6">
                    {language === 'en' ? 'Our Story & Mission' : 'Hadithi na Dhamira Yetu'}
                  </h2>
                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      {language === 'en'
                        ? 'Founded in 2020, Gacinia Pharmacy began with a simple yet powerful vision: to make quality healthcare accessible to everyone in Mbeya and surrounding regions. Located strategically at Standi Kuu ya Mabasi opposite Agakhan Hospital, we serve as a vital healthcare hub for our community.'
                        : 'Ilianzishwa mnamo 2020, Gacinia Pharmacy ilianza na maono rahisi lakini yenye nguvu: kufanya huduma za afya za ubora zipatikane kwa kila mtu Mbeya na mikoa jirani. Iko mahali pazuri pa kimkakati katika Standi Kuu ya Mabasi mkabala na Hospitali ya Agakhan, tunatumika kama kituo muhimu cha afya kwa jamii yetu.'
                      }
                    </p>
                    <p>
                      {language === 'en'
                        ? 'Our mission is to bridge the gap between patients and quality healthcare by providing comprehensive pharmaceutical services, from individual prescriptions to bulk medical supplies for healthcare institutions. We believe that good health is a fundamental right, not a privilege.'
                        : 'Dhamira yetu ni kuunganisha pengo kati ya wagonjwa na huduma za afya za ubora kwa kutoa huduma kamili za dawa, kutoka dawa za uwongozi za mtu mmoja hadi vifaa vya matibabu vya wingi kwa taasisi za afya. Tunaamini kuwa afya njema ni haki ya kimsingi, si upendeleo.'
                      }
                    </p>
                    <p>
                      {language === 'en'
                        ? 'Today, we proudly serve over 5,000 customers and partner with more than 50 healthcare facilities across the region, maintaining our commitment to excellence, integrity, and compassionate care.'
                        : 'Leo, kwa kiburi tunatumikia zaidi ya wateja 5,000 na kushirikiana na zaidi ya vituo 50 vya afya kote mkoa, tukidumisha ahadi yetu ya ubora, uaminifu, na utunzaji wa huruma.'
                      }
                    </p>
                  </div>
                </div>
                <div>
                  <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-none">
                    <CardContent className="p-8">
                      <div className="space-y-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                            <Target className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground">
                              {language === 'en' ? 'Our Mission' : 'Dhamira Yetu'}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {language === 'en'
                                ? 'Providing accessible, quality healthcare solutions'
                                : 'Kutoa suluhisho za afya za ubora na za upatikanaji'
                              }
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
                            <Globe className="w-6 h-6 text-secondary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground">
                              {language === 'en' ? 'Our Vision' : 'Maono Yetu'}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {language === 'en'
                                ? 'Leading healthcare provider in East Africa'
                                : 'Mtoa huduma wa afya mkuu Afrika Mashariki'
                              }
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </section>

          {/* Values Section */}
          <section className="py-16 bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="font-heading text-3xl font-bold text-foreground mb-4">
                  {language === 'en' ? 'Our Core Values' : 'Maadili Yetu ya Msingi'}
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  {language === 'en'
                    ? 'These fundamental principles guide every aspect of our operations and interactions with the community.'
                    : 'Kanuni hizi za msingi zinaongoza kila kipengele cha shughuli zetu na mwingiliano na jamii.'
                  }
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {values.map((value, index) => (
                  <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <value.icon className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="font-semibold text-foreground mb-2">
                        {language === 'en' ? value.title : value.titleSw}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {language === 'en' ? value.description : value.descriptionSw}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Services Section */}
          <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="font-heading text-3xl font-bold text-foreground mb-4">
                  {language === 'en' ? 'Our Services' : 'Huduma Zetu'}
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  {language === 'en'
                    ? 'Comprehensive healthcare solutions tailored to meet the diverse needs of our community.'
                    : 'Suluhisho kamili za afya zilizoratibiwa kukidhi mahitaji mbalimbali ya jamii yetu.'
                  }
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {services.map((service, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <service.icon className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground mb-2">
                            {language === 'en' ? service.title : service.titleSw}
                          </h3>
                          <p className="text-muted-foreground">
                            {language === 'en' ? service.description : service.descriptionSw}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Certifications Section */}
          <section className="py-16 bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="font-heading text-3xl font-bold text-foreground mb-4">
                  {language === 'en' ? 'Certifications & Compliance' : 'Vyeti na Kufuata Sheria'}
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  {language === 'en'
                    ? 'Our commitment to quality and safety is validated by recognized industry certifications.'
                    : 'Ahadi yetu ya ubora na usalama inathibitishwa na vyeti vya kiwango cha kimataifa.'
                  }
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {certifications.map((cert, index) => (
                  <Card key={index} className="text-center">
                    <CardContent className="p-6">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                      </div>
                      <h3 className="font-semibold text-foreground mb-2">
                        {language === 'en' ? cert.title : cert.titleSw}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-1">
                        {cert.authority}
                      </p>
                      <Badge variant="outline" className="text-xs">
                        {cert.year}
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Contact CTA Section */}
          <section className="py-16 bg-primary text-primary-foreground">
            <div className="container mx-auto px-4 text-center">
              <h2 className="font-heading text-3xl font-bold mb-4">
                {language === 'en' ? 'Ready to Experience Quality Healthcare?' : 'Uko Tayari Kupata Huduma za Afya za Ubora?'}
              </h2>
              <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
                {language === 'en'
                  ? 'Visit our pharmacy today or explore our online catalog to discover how we can serve your healthcare needs.'
                  : 'Tembelea duka letu la dawa leo au chunguza katalogi yetu ya mtandaoni ili uone jinsi tunavyoweza kutumikia mahitaji yako ya afya.'
                }
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  variant="secondary" 
                  size="lg"
                  onClick={() => navigate('/products')}
                >
                  {language === 'en' ? 'Shop Now' : 'Nunua Sasa'}
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-primary"
                  onClick={() => navigate('/contact')}
                >
                  {language === 'en' ? 'Get in Touch' : 'Wasiliana Nasi'}
                </Button>
              </div>
              
              {/* Quick Contact Info */}
              <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="flex items-center justify-center gap-2">
                  <MapPin className="w-5 h-5" />
                  <span className="text-sm">
                    {language === 'en' 
                      ? 'Standi Kuu ya Mabasi, Mbeya' 
                      : 'Standi Kuu ya Mabasi, Mbeya'
                    }
                  </span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Phone className="w-5 h-5" />
                  <span className="text-sm">+255 621 624 287</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span className="text-sm">
                    {language === 'en' ? 'Mon-Sat 8AM-8PM' : 'Jumatatu-Jumamosi 8AM-8PM'}
                  </span>
                </div>
              </div>
            </div>
          </section>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default About;
