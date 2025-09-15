import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SEOHead } from '@/components/ui/seo-head';
import { AccessibilitySkipLinks } from '@/components/ui/accessibility-skip-links';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/components/ui/use-toast';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  MessageCircle,
  Navigation,
  Calendar,
  Send,
  CheckCircle,
  AlertCircle,
  Building2,
  Users,
  Truck,
  HeartHandshake,
  Globe,
  Facebook,
  Instagram,
  Twitter
} from 'lucide-react';

const Contact = () => {
  const { state } = useCart();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    inquiryType: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const language = 'en'; // This would come from language context

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      toast({
        title: language === 'en' ? "Message Sent!" : "Ujumbe Umetumwa!",
        description: language === 'en' 
          ? "Thank you for contacting us. We'll get back to you within 24 hours."
          : "Asante kwa kuwasiliana nasi. Tutakujibu ndani ya masaa 24.",
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        inquiryType: 'general'
      });
      setIsSubmitting(false);
    }, 2000);
  };

  const inquiryTypes = [
    { value: 'general', label: 'General Inquiry', labelSw: 'Hoja ya Kawaida' },
    { value: 'prescription', label: 'Prescription Question', labelSw: 'Swali la Dawa za Uwongozi' },
    { value: 'wholesale', label: 'Wholesale Inquiry', labelSw: 'Hoja ya Jumla' },
    { value: 'delivery', label: 'Delivery Service', labelSw: 'Huduma ya Utoaji' },
    { value: 'complaint', label: 'Complaint/Feedback', labelSw: 'Malalamiko/Maoni' }
  ];

  const contactMethods = [
    {
      icon: Phone,
      title: 'Phone',
      titleSw: 'Simu',
      value: '+255 621 624 287',
      description: 'Call us for immediate assistance',
      descriptionSw: 'Tupigie simu kwa msaada wa haraka',
      action: () => window.open('tel:+255621624287')
    },
    {
      icon: MessageCircle,
      title: 'WhatsApp',
      titleSw: 'WhatsApp',
      value: '+255 621 624 287',
      description: 'Chat with us on WhatsApp',
      descriptionSw: 'Ongea nasi kwenye WhatsApp',
      action: () => window.open('https://wa.me/255621624287')
    },
    {
      icon: Mail,
      title: 'Email',
      titleSw: 'Barua Pepe',
      value: 'info@gaciniapharmacy.co.tz',
      description: 'Send us an email inquiry',
      descriptionSw: 'Tutumie hoja kwa barua pepe',
      action: () => window.open('mailto:info@gaciniapharmacy.co.tz')
    }
  ];

  const businessHours = [
    { day: 'Monday - Friday', daySw: 'Jumatatu - Ijumaa', hours: '8:00 AM - 8:00 PM' },
    { day: 'Saturday', daySw: 'Jumamosi', hours: '8:00 AM - 8:00 PM' },
    { day: 'Sunday', daySw: 'Jumapili', hours: '9:00 AM - 6:00 PM' },
    { day: 'Public Holidays', daySw: 'Sikukuu za Umma', hours: '10:00 AM - 4:00 PM' }
  ];

  const services = [
    {
      icon: Building2,
      title: 'Pharmacy Services',
      titleSw: 'Huduma za Duka la Dawa',
      items: ['Prescription Dispensing', 'Medication Counseling', 'Health Screenings'],
      itemsSw: ['Kutoa Dawa za Uwongozi', 'Ushauri wa Dawa', 'Uchunguzi wa Afya']
    },
    {
      icon: Users,
      title: 'Wholesale Services',
      titleSw: 'Huduma za Jumla',
      items: ['Bulk Medical Supplies', 'Hospital Partnerships', 'Clinic Support'],
      itemsSw: ['Vifaa vya Matibabu vya Wingi', 'Ushirikiano wa Hospitali', 'Msaada wa Kliniki']
    },
    {
      icon: Truck,
      title: 'Delivery Services',
      titleSw: 'Huduma za Utoaji',
      items: ['Home Delivery', 'Same-Day Service', 'Emergency Supply'],
      itemsSw: ['Utoaji Nyumbani', 'Huduma ya Siku Moja', 'Ugavi wa Dharura']
    }
  ];

  return (
    <>
      <SEOHead 
        title="Contact Us - Gacinia Pharmacy & Medical Supplies"
        description="Get in touch with Gacinia Pharmacy in Mbeya, Tanzania. Contact us for prescriptions, wholesale inquiries, delivery services, and general healthcare questions."
        keywords={['contact gacinia pharmacy', 'mbeya pharmacy contact', 'pharmacy phone number', 'healthcare contact mbeya']}
        canonicalUrl="https://gacinia.co.tz/contact"
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
                  {language === 'en' ? 'Contact Gacinia Pharmacy' : 'Wasiliana na Gacinia Pharmacy'}
                </Badge>
                <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
                  {language === 'en' 
                    ? 'Get in Touch with Us' 
                    : 'Wasiliana Nasi'
                  }
                </h1>
                <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                  {language === 'en'
                    ? 'We\'re here to help with all your healthcare needs. Reach out to us for prescriptions, wholesale inquiries, delivery services, or any questions about our products and services.'
                    : 'Tuko hapa kusaidia na mahitaji yako yote ya afya. Wasiliana nasi kwa dawa za uwongozi, hoja za jumla, huduma za utoaji, au maswali yoyote kuhusu bidhaa na huduma zetu.'
                  }
                </p>
              </div>
            </div>
          </section>

          {/* Quick Contact Methods */}
          <section className="py-12 bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {contactMethods.map((method, index) => (
                  <Card key={index} className="text-center hover:shadow-lg transition-shadow cursor-pointer" onClick={method.action}>
                    <CardContent className="p-6">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <method.icon className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="font-semibold text-foreground mb-2">
                        {language === 'en' ? method.title : method.titleSw}
                      </h3>
                      <p className="text-lg font-medium text-primary mb-2">
                        {method.value}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {language === 'en' ? method.description : method.descriptionSw}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Main Content */}
          <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Contact Form */}
                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Send className="w-5 h-5 text-primary" />
                        {language === 'en' ? 'Send us a Message' : 'Tutumie Ujumbe'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-foreground mb-1">
                              {language === 'en' ? 'Full Name' : 'Jina Kamili'} *
                            </label>
                            <Input
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              placeholder={language === 'en' ? 'Enter your full name' : 'Ingiza jina lako kamili'}
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-foreground mb-1">
                              {language === 'en' ? 'Phone Number' : 'Nambari ya Simu'}
                            </label>
                            <Input
                              name="phone"
                              type="tel"
                              value={formData.phone}
                              onChange={handleInputChange}
                              placeholder="+255 XXX XXX XXX"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-1">
                            {language === 'en' ? 'Email Address' : 'Barua Pepe'} *
                          </label>
                          <Input
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder={language === 'en' ? 'Enter your email address' : 'Ingiza anwani yako ya barua pepe'}
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-foreground mb-1">
                            {language === 'en' ? 'Inquiry Type' : 'Aina ya Hoja'}
                          </label>
                          <select
                            name="inquiryType"
                            value={formData.inquiryType}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-input rounded-md bg-background"
                          >
                            {inquiryTypes.map((type) => (
                              <option key={type.value} value={type.value}>
                                {language === 'en' ? type.label : type.labelSw}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-foreground mb-1">
                            {language === 'en' ? 'Subject' : 'Mada'} *
                          </label>
                          <Input
                            name="subject"
                            value={formData.subject}
                            onChange={handleInputChange}
                            placeholder={language === 'en' ? 'Brief description of your inquiry' : 'Maelezo mafupi ya hoja yako'}
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-foreground mb-1">
                            {language === 'en' ? 'Message' : 'Ujumbe'} *
                          </label>
                          <Textarea
                            name="message"
                            value={formData.message}
                            onChange={handleInputChange}
                            placeholder={language === 'en' ? 'Please provide details about your inquiry...' : 'Tafadhali toa maelezo kuhusu hoja yako...'}
                            rows={5}
                            required
                          />
                        </div>

                        <Button 
                          type="submit" 
                          className="w-full" 
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                              {language === 'en' ? 'Sending...' : 'Inatuma...'}
                            </>
                          ) : (
                            <>
                              <Send className="w-4 h-4 mr-2" />
                              {language === 'en' ? 'Send Message' : 'Tuma Ujumbe'}
                            </>
                          )}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </div>

                {/* Location and Info */}
                <div className="space-y-6">
                  {/* Map and Address */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-primary" />
                        {language === 'en' ? 'Visit Our Pharmacy' : 'Tembelea Duka Letu la Dawa'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="aspect-video bg-muted relative mb-4">
                        <iframe
                          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976.3344!2d33.4628!3d-8.9094!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zOMKwNTQnMzMuOCJTIDMzwrAyNyc0Ni4xIkU!5e0!3m2!1sen!2stz!4v1635789012345"
                          width="100%"
                          height="100%"
                          style={{ border: 0 }}
                          allowFullScreen
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                          title="Gacinia Pharmacy Location"
                          className="absolute inset-0"
                        ></iframe>
                        
                        <div className="absolute bottom-4 right-4">
                          <Button 
                            className="bg-primary hover:bg-primary/90 shadow-lg"
                            onClick={() => window.open('https://maps.app.goo.gl/GPGFrXh2cXMsBUTe9', '_blank')}
                          >
                            <Navigation className="w-4 h-4 mr-2" />
                            {language === 'en' ? 'Get Directions' : 'Pata Maelekezo'}
                          </Button>
                        </div>
                      </div>
                      
                      <div className="p-6 space-y-4">
                        <div className="flex items-start gap-3">
                          <MapPin className="w-5 h-5 text-primary mt-0.5" />
                          <div>
                            <p className="font-medium">
                              {language === 'en' ? 'Address' : 'Anwani'}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Standi Kuu ya Mabasi Opposite to Agakhan Hospital<br />
                              Mbeya 6586, Tanzania
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Business Hours */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-primary" />
                        {language === 'en' ? 'Business Hours' : 'Masaa ya Kufanya Kazi'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {businessHours.map((schedule, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-sm font-medium">
                            {language === 'en' ? schedule.day : schedule.daySw}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {schedule.hours}
                          </span>
                        </div>
                      ))}
                      <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm text-green-800">
                            {language === 'en' 
                              ? 'Emergency services available 24/7' 
                              : 'Huduma za dharura zinapatikana masaa 24/7'
                            }
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Services Overview */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <HeartHandshake className="w-5 h-5 text-primary" />
                        {language === 'en' ? 'Our Services' : 'Huduma Zetu'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {services.map((service, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                            <service.icon className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium text-foreground mb-1">
                              {language === 'en' ? service.title : service.titleSw}
                            </h4>
                            <ul className="text-sm text-muted-foreground space-y-1">
                              {(language === 'en' ? service.items : service.itemsSw).map((item, itemIndex) => (
                                <li key={itemIndex} className="flex items-center gap-2">
                                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </section>

          {/* Social Media & Additional Info */}
          <section className="py-12 bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="text-center mb-8">
                <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
                  {language === 'en' ? 'Connect with Us' : 'Unganisha Nasi'}
                </h2>
                <p className="text-muted-foreground">
                  {language === 'en'
                    ? 'Follow us on social media for health tips, product updates, and pharmacy news.'
                    : 'Tufuate kwenye mitandao ya kijamii kwa vidokezo vya afya, masasisho ya bidhaa, na habari za duka la dawa.'
                  }
                </p>
              </div>
              
              <div className="flex justify-center gap-3 sm:gap-4 mb-8">
                <Button variant="outline" size="sm" className="flex items-center gap-2 px-3 sm:px-6">
                  <Facebook className="w-5 h-5" />
                  <span className="hidden sm:inline">Facebook</span>
                </Button>
                <Button variant="outline" size="sm" className="flex items-center gap-2 px-3 sm:px-6">
                  <Instagram className="w-5 h-5" />
                  <span className="hidden sm:inline">Instagram</span>
                </Button>
                <Button variant="outline" size="sm" className="flex items-center gap-2 px-3 sm:px-6">
                  <Twitter className="w-5 h-5" />
                  <span className="hidden sm:inline">Twitter</span>
                </Button>
              </div>

              <div className="max-w-2xl mx-auto text-center">
                <div className="p-6 bg-primary/5 rounded-lg border border-primary/20">
                  <AlertCircle className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold text-foreground mb-2">
                    {language === 'en' ? 'Emergency Contact' : 'Mawasiliano ya Dharura'}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {language === 'en'
                      ? 'For medical emergencies, please contact emergency services immediately. For urgent pharmacy needs outside business hours:'
                      : 'Kwa dharura za kiafya, tafadhali wasiliana na huduma za dharura mara moja. Kwa mahitaji ya haraka ya duka la dawa nje ya masaa ya kazi:'
                    }
                  </p>
                  <Button variant="outline" onClick={() => window.open('tel:+255621624287')}>
                    <Phone className="w-4 h-4 mr-2" />
                    +255 621 624 287
                  </Button>
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

export default Contact;
