import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { 
  Search, 
  User, 
  Menu, 
  Cross, 
  Phone, 
  MapPin,
  Globe,
  Settings,
  LogOut
} from 'lucide-react';
import { CartIcon } from '@/components/cart/CartIcon';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { useUser } from '@/contexts/UserContext';

interface NavbarProps {
  cartItemCount?: number;
}

export function Navbar({ cartItemCount = 0 }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [language, setLanguage] = useState<'en' | 'sw'>('en');
  const { state } = useUser();
  const { user, isLoggedIn } = state;

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'sw' : 'en');
  };

  const menuItems = [
    { name: language === 'en' ? 'Medicines' : 'Dawa', href: '/catalog/medicines' },
    { name: language === 'en' ? 'Cosmetics' : 'Vipodozi', href: '/catalog/cosmetics' },
    { name: language === 'en' ? 'Equipment' : 'Vifaa', href: '/catalog/equipment' },
    { name: language === 'en' ? 'Wholesale' : 'Jumla', href: '/wholesale' },
    { name: language === 'en' ? 'About' : 'Kuhusu', href: '/about' },
    { name: language === 'en' ? 'Contact' : 'Mawasiliano', href: '/contact' },
  ];

  return (
    <>
      {/* Top Contact Bar */}
      <div className="bg-primary text-primary-foreground py-2 px-4 text-sm">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Phone size={14} />
              <span>+255 25 250 3456</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin size={14} />
              <span>{language === 'en' ? 'Mbeya, Esso - Near Highway' : 'Mbeya, Esso - Karibu na Barabara Kuu'}</span>
            </div>
          </div>
          <div className="hidden md:block text-xs">
            {language === 'en' ? 'Licensed Pharmacy & Medical Supplies' : 'Duka la Dawa Lililoidhinishwa na Vifaa vya Matibabu'}
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="bg-surface shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Cross className="text-white w-6 h-6" />
                </div>
                <div>
                  <h1 className="font-heading text-xl font-bold text-primary">
                    Gacinia
                  </h1>
                  <p className="text-xs text-muted-foreground">
                    {language === 'en' ? 'Pharmacy & Medical' : 'Duka la Dawa na Matibabu'}
                  </p>
                </div>
              </div>
            </div>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-lg mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  type="search"
                  placeholder={language === 'en' ? 'Search medicines, cosmetics, equipment...' : 'Tafuta dawa, vipodozi, vifaa...'}
                  className="pl-10 pr-4"
                />
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Language Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleLanguage}
                className="flex items-center gap-1"
              >
                <Globe size={16} />
                {language === 'en' ? 'EN' : 'SW'}
              </Button>

              {/* Account */}
              {isLoggedIn ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center gap-1">
                      <User size={16} />
                      {user?.name?.split(' ')[0] || (language === 'en' ? 'User' : 'Mtumiaji')}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard">
                        <User className="w-4 h-4 mr-2" />
                        {language === 'en' ? 'Dashboard' : 'Dashibodi'}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/profile">
                        <Settings className="w-4 h-4 mr-2" />
                        {language === 'en' ? 'Profile Settings' : 'Mipangilio ya Wasifu'}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/admin">
                        <Settings className="w-4 h-4 mr-2" />
                        {language === 'en' ? 'Admin Portal' : 'Mlango wa Msimamizi'}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <LogOut className="w-4 h-4 mr-2" />
                      {language === 'en' ? 'Logout' : 'Ondoka'}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button variant="ghost" size="sm" className="flex items-center gap-1">
                  <User size={16} />
                  {language === 'en' ? 'Login' : 'Ingia'}
                </Button>
              )}

              {/* Cart */}
              <CartIcon />
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <Menu size={20} />
              </Button>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6 py-3 border-t">
            {menuItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                {item.name}
              </a>
            ))}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t bg-surface">
            <div className="px-4 py-4 space-y-4">
              {/* Mobile Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  type="search"
                  placeholder={language === 'en' ? 'Search...' : 'Tafuta...'}
                  className="pl-10 pr-4"
                />
              </div>

              {/* Mobile Navigation Links */}
              <div className="space-y-2">
                {menuItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="block py-2 text-foreground hover:text-primary transition-colors"
                  >
                    {item.name}
                  </a>
                ))}
              </div>

              {/* Mobile Actions */}
              <div className="flex items-center justify-between pt-4 border-t">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleLanguage}
                  className="flex items-center gap-1"
                >
                  <Globe size={16} />
                  {language === 'en' ? 'EN' : 'SW'}
                </Button>

                <div className="flex items-center gap-2">
                  {isLoggedIn ? (
                    <>
                      <Button variant="ghost" size="sm" asChild>
                        <Link to="/dashboard" className="flex items-center gap-1">
                          <User size={16} />
                          {language === 'en' ? 'Dashboard' : 'Dashibodi'}
                        </Link>
                      </Button>
                      <Button variant="ghost" size="sm" asChild>
                        <Link to="/profile" className="flex items-center gap-1">
                          <Settings size={16} />
                          {language === 'en' ? 'Profile' : 'Wasifu'}
                        </Link>
                      </Button>
                    </>
                  ) : (
                    <Button variant="ghost" size="sm" className="flex items-center gap-1">
                      <User size={16} />
                      {language === 'en' ? 'Login' : 'Ingia'}
                    </Button>
                  )}

                  <CartIcon />
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
      
      {/* Cart Drawer */}
      <CartDrawer />
    </>
  );
}