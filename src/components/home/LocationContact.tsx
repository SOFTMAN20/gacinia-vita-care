import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  MessageCircle,
  Navigation,
  Calendar
} from 'lucide-react';

export function LocationContact() {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl font-bold text-foreground mb-4">
            Visit Our Pharmacy
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Located in the heart of Mbeya, we're easily accessible and ready to serve 
            your healthcare needs with professional service and quality products.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Map Section */}
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="aspect-video bg-muted relative">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976.3344!2d33.4628!3d-8.9094!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zOMKwNTQnMzMuOCJTIDMzwrAyNyc0Ni4xIkU!5e0!3m2!1sen!2stz!4v1635789012345"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Gacinia Pharmacy Location - Standi Kuu ya Mabasi Opposite to Agakhan Hospital, Mbeya"
                  className="absolute inset-0"
                ></iframe>
                
                {/* Overlay with Get Directions button */}
                <div className="absolute bottom-4 right-4">
                  <Button 
                    className="bg-primary hover:bg-primary/90 shadow-lg"
                    onClick={() => window.open('https://maps.app.goo.gl/GPGFrXh2cXMsBUTe9', '_blank')}
                  >
                    <Navigation className="w-4 h-4 mr-2" />
                    Get Directions
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-6">
            {/* Contact Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="w-5 h-5 text-primary" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Address</p>
                    <p className="text-sm text-muted-foreground">
                      Standi Kuu ya Mabasi Opposite to Agakhan Hospital<br />
                      Mbeya 6586, Tanzania
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-sm text-muted-foreground">
                      +255621624287
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">
                      info@gaciniapharmacy.co.tz
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MessageCircle className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">WhatsApp</p>
                    <p className="text-sm text-muted-foreground">
                      +255621624287
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Operating Hours */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Operating Hours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Monday - Friday</span>
                    <span className="text-sm font-medium">8:00 AM - 8:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Saturday</span>
                    <span className="text-sm font-medium">8:00 AM - 8:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Sunday</span>
                    <span className="text-sm font-medium">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="mt-4 p-3 bg-success/10 rounded-lg">
                    <p className="text-sm text-success font-medium">
                      Emergency services available 24/7
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
              <Button 
                className="h-auto py-4 flex flex-col gap-2"
                onClick={() => window.open('https://wa.me/255621624287?text=Hello%2C%20I%20would%20like%20to%20inquire%20about%20your%20pharmacy%20services.', '_blank')}
              >
                <Phone className="w-5 h-5" />
                <span className="text-sm">Call Now</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto py-4 flex flex-col gap-2"
                onClick={() => window.open('https://wa.me/255621624287?text=Hello%2C%20I%20would%20like%20to%20book%20a%20consultation%20with%20your%20pharmacy.', '_blank')}
              >
                <Calendar className="w-5 h-5" />
                <span className="text-sm">Book Consultation</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Additional Services */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Truck className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Home Delivery</h3>
              <p className="text-sm text-muted-foreground">
                Fast and reliable delivery within Mbeya region
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="font-semibold mb-2">Online Consultation</h3>
              <p className="text-sm text-muted-foreground">
                Professional health advice via WhatsApp or phone
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-semibold mb-2">Emergency Service</h3>
              <p className="text-sm text-muted-foreground">
                24/7 emergency medicine supply and support
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

const Truck = ({ className, ...props }: { className?: string }) => (
  <svg className={className} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M16 3h4a2 2 0 0 1 2 2v13H2V5a2 2 0 0 1 2-2h4" />
    <path d="M8 21h8" />
    <path d="M12 3v18" />
    <circle cx="6.5" cy="18.5" r="2.5" />
    <circle cx="17.5" cy="18.5" r="2.5" />
  </svg>
);