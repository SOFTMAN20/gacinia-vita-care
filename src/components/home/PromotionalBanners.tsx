import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Percent, Truck, Clock, Users } from 'lucide-react';

export function PromotionalBanners() {
  return (
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Discount Banner */}
          <Card className="bg-gradient-primary text-white overflow-hidden relative">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Percent className="w-8 h-8" />
                <Badge className="bg-white/20 text-white border-white/30">
                  Limited Time
                </Badge>
              </div>
              <h3 className="font-heading text-lg font-bold mb-2">
                Save 20% on Cosmetics
              </h3>
              <p className="text-sm opacity-90 mb-4">
                Premium beauty products at unbeatable prices
              </p>
              <Button variant="secondary" size="sm" className="text-primary">
                Shop Now
              </Button>
            </CardContent>
          </Card>

          {/* Free Delivery Banner */}
          <Card className="bg-gradient-secondary text-white overflow-hidden relative">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Truck className="w-8 h-8" />
                <Badge className="bg-white/20 text-white border-white/30">
                  Free
                </Badge>
              </div>
              <h3 className="font-heading text-lg font-bold mb-2">
                Free Delivery
              </h3>
              <p className="text-sm opacity-90 mb-4">
                On orders above TZS 50,000 within Mbeya
              </p>
              <Button variant="secondary" size="sm" className="text-secondary">
                Learn More
              </Button>
            </CardContent>
          </Card>

          {/* Quick Delivery Banner */}
          <Card className="bg-gradient-accent text-white overflow-hidden relative">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Clock className="w-8 h-8" />
                <Badge className="bg-white/20 text-white border-white/30">
                  Express
                </Badge>
              </div>
              <h3 className="font-heading text-lg font-bold mb-2">
                Same Day Delivery
              </h3>
              <p className="text-sm opacity-90 mb-4">
                Emergency medicine delivery within 2 hours
              </p>
              <Button variant="secondary" size="sm" className="text-accent-dark">
                Order Now
              </Button>
            </CardContent>
          </Card>

          {/* Wholesale Banner */}
          <Card className="bg-gradient-to-br from-primary-dark to-secondary-dark text-white overflow-hidden relative">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Users className="w-8 h-8" />
                <Badge className="bg-white/20 text-white border-white/30">
                  B2B
                </Badge>
              </div>
              <h3 className="font-heading text-lg font-bold mb-2">
                Wholesale Portal
              </h3>
              <p className="text-sm opacity-90 mb-4">
                Special pricing for hospitals and clinics
              </p>
              <Button variant="secondary" size="sm" className="text-primary">
                Join Now
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Health Awareness Banner */}
        <Card className="mt-8 bg-gradient-to-r from-success/10 to-primary/10 border-success/20">
          <CardContent className="p-8">
            <div className="text-center max-w-2xl mx-auto">
              <h3 className="font-heading text-2xl font-bold text-primary mb-4">
                Health Awareness Campaign
              </h3>
              <p className="text-muted-foreground mb-6">
                This month we're focusing on diabetes prevention and management. 
                Get free blood sugar testing with every purchase of diabetes medications. 
                Consult with our qualified pharmacists for personalized health advice.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-success hover:bg-success/90">
                  Book Free Consultation
                </Button>
                <Button variant="outline" className="border-success text-success hover:bg-success/10">
                  Learn More
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}