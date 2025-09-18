import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface NavbarProps {
  cartItemCount?: number;
}

export function Navbar({ cartItemCount = 0 }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, profile, hasRole, signOut } = useAuth();
  const { language } = useLanguage();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const menuItems = [
    { name: t('nav.medicines'), href: '/products?category=prescription-medicines,over-the-counter' },
    { name: t('nav.cosmetics'), href: '/products?category=cosmetics-personal-care' },
    { name: t('nav.equipment'), href: '/products?category=medical-equipment,first-aid-wellness' },
    { name: t('nav.wholesale'), href: '/products?wholesale=true' },
    { name: t('nav.about'), href: '/about' },
    { name: t('nav.contact'), href: '/contact' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

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
      <nav className="bg-surface shadow-md sticky top-0 z-50" id="navigation" role="navigation" aria-label="Main navigation">
        <div className="container mx-auto mobile-padding">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
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
              </Link>
            </div>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-lg mx-8">
              <form onSubmit={handleSearch} className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" aria-hidden="true" />
                <Input
                  type="search"
                  placeholder={t('header.searchPlaceholder')}
                  className="pl-10 pr-4"
                  aria-label={t('header.searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Language Toggle */}
              <LanguageToggle />

              {/* Account */}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center gap-1">
                      <User size={16} />
                      {profile?.full_name?.split(' ')[0] || profile?.username || 'User'}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-surface border border-border">
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard" className="flex items-center w-full">
                        <User className="w-4 h-4 mr-2" />
                        {t('nav.dashboard')}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="flex items-center w-full">
                        <Settings className="w-4 h-4 mr-2" />
                        {t('nav.profile')}
                      </Link>
                    </DropdownMenuItem>
                    {hasRole('admin') && (
                      <DropdownMenuItem asChild>
                        <Link to="/admin" className="flex items-center w-full">
                          <Settings className="w-4 h-4 mr-2" />
                          {t('nav.admin')}
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={() => signOut()}>
                      <LogOut className="w-4 h-4 mr-2" />
                      {t('nav.logout')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button variant="ghost" size="sm" asChild className="flex items-center gap-1">
                  <Link to="/auth">
                    <User size={16} />
                    {t('common.login')}
                  </Link>
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
                aria-label="Toggle menu"
              >
                <Menu size={20} />
              </Button>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6 py-3 border-t" role="menubar">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-sm font-medium text-foreground hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-sm px-2 py-1"
                role="menuitem"
              >
                {item.name}
              </Link>
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
                  placeholder={t('common.search')}
                  className="pl-10 pr-4 touch-target"
                />
              </div>

              {/* Mobile Navigation Links */}
              <div className="space-y-2">
                {menuItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="block py-3 px-2 text-foreground hover:text-primary transition-colors touch-target rounded-lg hover:bg-muted"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              {/* Mobile Actions */}
              <div className="flex items-center justify-between pt-4 border-t">
                <LanguageToggle />

                <div className="flex items-center gap-2">
                  {user ? (
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
                    <Button variant="ghost" size="sm" asChild className="flex items-center gap-1 touch-target">
                      <Link to="/login">
                        <User size={16} />
                        <span className="hidden xs:inline">{t('common.login')}</span>
                      </Link>
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