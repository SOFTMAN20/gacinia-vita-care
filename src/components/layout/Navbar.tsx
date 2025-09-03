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
  Settings,
  LogOut
} from 'lucide-react';
import { CartIcon } from '@/components/cart/CartIcon';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { LanguageToggle } from '@/components/ui/language-toggle';
import { useUser } from '@/contexts/UserContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface NavbarProps {
  cartItemCount?: number;
}

export function Navbar({ cartItemCount = 0 }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { state } = useUser();
  const { user, isLoggedIn } = state;
  const { t, language } = useLanguage();

  const menuItems = [
    { name: t('nav.medicines'), href: '/catalog/medicines' },
    { name: t('nav.cosmetics'), href: '/catalog/cosmetics' },
    { name: t('nav.equipment'), href: '/catalog/equipment' },
    { name: t('nav.wholesale'), href: '/wholesale' },
    { name: t('nav.about'), href: '/about' },
    { name: t('nav.contact'), href: '/contact' },
  ];

  return (
    <>
      {/* Top Contact Bar */}
      <div className="bg-primary text-primary-foreground py-2 mobile-padding text-sm">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-1">
              <Phone size={14} />
              <span className="hidden xs:inline">{t('header.phone')}</span>
              <span className="xs:hidden">{t('common.call')}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin size={14} />
              <span className="hidden sm:inline">{t('header.location')}</span>
              <span className="sm:hidden">Mbeya</span>
            </div>
          </div>
          <div className="hidden lg:block text-xs">
            {t('header.tagline')}
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="bg-surface shadow-md sticky top-0 z-50">
        <div className="container mx-auto mobile-padding">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Cross className="text-white w-6 h-6" />
                </div>
                <div>
                  <h1 className="font-heading text-xl font-bold text-primary">
                    {t('header.company')}
                  </h1>
                  <p className="text-xs text-muted-foreground">
                    {t('header.subtitle')}
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
                  placeholder={t('header.searchPlaceholder')}
                  className="pl-10 pr-4"
                />
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Language Toggle */}
              <LanguageToggle />

              {/* Account */}
              {isLoggedIn ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center gap-1">
                      <User size={16} />
                      {user?.name?.split(' ')[0] || t('nav.user')}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link to="/dashboard">
                          <User className="w-4 h-4 mr-2" />
                          {t('nav.dashboard')}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/profile">
                          <Settings className="w-4 h-4 mr-2" />
                          {t('nav.profile')}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/admin">
                          <Settings className="w-4 h-4 mr-2" />
                          {t('nav.admin')}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <LogOut className="w-4 h-4 mr-2" />
                        {t('nav.logout')}
                      </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button variant="ghost" size="sm" className="flex items-center gap-1">
                  <User size={16} />
                  {t('nav.login')}
                </Button>
              )}

              {/* Cart */}
              <CartIcon />
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-2">
              <CartIcon />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="touch-target"
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
          <div className="md:hidden border-t bg-surface animate-slide-in-right">
            <div className="mobile-padding py-4 space-y-4">
              {/* Mobile Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  type="search"
                  placeholder={t('common.search') + '...'}
                  className="pl-10 pr-4 touch-target"
                />
              </div>

              {/* Mobile Navigation Links */}
              <div className="space-y-2">
                {menuItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="block py-3 px-2 text-foreground hover:text-primary transition-colors touch-target rounded-lg hover:bg-muted"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                ))}
              </div>

              {/* Mobile Actions */}
              <div className="flex items-center justify-between pt-4 border-t">
                <LanguageToggle className="touch-target" />

                <div className="flex items-center gap-2">
                  {isLoggedIn ? (
                    <>
                      <Button variant="ghost" size="sm" asChild className="touch-target">
                        <Link to="/dashboard" className="flex items-center gap-1">
                          <User size={16} />
                          <span className="hidden xs:inline">{t('nav.dashboard')}</span>
                        </Link>
                      </Button>
                      <Button variant="ghost" size="sm" asChild className="touch-target">
                        <Link to="/profile" className="flex items-center gap-1">
                          <Settings size={16} />
                          <span className="hidden xs:inline">{t('nav.profile')}</span>
                        </Link>
                      </Button>
                    </>
                  ) : (
                    <Button variant="ghost" size="sm" className="flex items-center gap-1 touch-target">
                      <User size={16} />
                      <span className="hidden xs:inline">{t('nav.login')}</span>
                    </Button>
                  )}
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