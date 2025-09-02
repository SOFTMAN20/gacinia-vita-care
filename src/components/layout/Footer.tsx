import { Cross, Phone, Mail, MapPin, Clock, Facebook, Instagram, Twitter } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-surface rounded-lg flex items-center justify-center">
                <Cross className="text-primary w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading text-lg font-bold">Gacinia</h3>
                <p className="text-xs opacity-90">Pharmacy & Medical</p>
              </div>
            </div>
            <p className="text-sm opacity-90 leading-relaxed">
              Your trusted healthcare partner in Mbeya, providing quality medicines, 
              cosmetics, and medical equipment for both retail and wholesale customers.
            </p>
            <div className="flex space-x-3">
              <Facebook size={20} className="opacity-75 hover:opacity-100 cursor-pointer transition-opacity" />
              <Instagram size={20} className="opacity-75 hover:opacity-100 cursor-pointer transition-opacity" />
              <Twitter size={20} className="opacity-75 hover:opacity-100 cursor-pointer transition-opacity" />
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-heading text-base font-semibold">Quick Links</h4>
            <div className="space-y-2">
              <a href="/catalog/medicines" className="block text-sm opacity-90 hover:opacity-100 transition-opacity">
                Medicines
              </a>
              <a href="/catalog/cosmetics" className="block text-sm opacity-90 hover:opacity-100 transition-opacity">
                Cosmetics
              </a>
              <a href="/catalog/equipment" className="block text-sm opacity-90 hover:opacity-100 transition-opacity">
                Medical Equipment
              </a>
              <a href="/wholesale" className="block text-sm opacity-90 hover:opacity-100 transition-opacity">
                Wholesale Portal
              </a>
              <a href="/about" className="block text-sm opacity-90 hover:opacity-100 transition-opacity">
                About Us
              </a>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="font-heading text-base font-semibold">Services</h4>
            <div className="space-y-2">
              <p className="text-sm opacity-90">Prescription Fulfillment</p>
              <p className="text-sm opacity-90">Bulk Orders</p>
              <p className="text-sm opacity-90">Home Delivery</p>
              <p className="text-sm opacity-90">Health Consultations</p>
              <p className="text-sm opacity-90">Medical Equipment Rental</p>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="font-heading text-base font-semibold">Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <MapPin size={16} className="mt-0.5 opacity-75" />
                <div className="text-sm opacity-90">
                  <p>Mbeya, Esso</p>
                  <p>Near Highway, Tanzania</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Phone size={16} className="opacity-75" />
                <p className="text-sm opacity-90">+255 25 250 3456</p>
              </div>
              
              <div className="flex items-center space-x-2">
                <Mail size={16} className="opacity-75" />
                <p className="text-sm opacity-90">info@gaciniapharmacy.co.tz</p>
              </div>
              
              <div className="flex items-start space-x-2">
                <Clock size={16} className="mt-0.5 opacity-75" />
                <div className="text-sm opacity-90">
                  <p>Mon - Sat: 8:00 AM - 8:00 PM</p>
                  <p>Sunday: 9:00 AM - 6:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/20 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm opacity-75 mb-4 md:mb-0">
            © {currentYear} Gacinia Pharmacy & Medical Supplies. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm opacity-75">
            <a href="/privacy" className="hover:opacity-100 transition-opacity">Privacy Policy</a>
            <a href="/terms" className="hover:opacity-100 transition-opacity">Terms of Service</a>
            <a href="/returns" className="hover:opacity-100 transition-opacity">Returns</a>
          </div>
        </div>
      </div>
    </footer>
  );
}