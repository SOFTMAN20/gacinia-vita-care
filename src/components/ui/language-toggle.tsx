import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface LanguageToggleProps {
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'default' | 'sm' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export function LanguageToggle({ 
  variant = 'ghost', 
  size = 'sm', 
  showLabel = true,
  className = '' 
}: LanguageToggleProps) {
  const { language, changeLanguage } = useLanguage();

  const toggleLanguage = () => {
    const newLanguage = language === 'en' ? 'sw' : 'en';
    changeLanguage(newLanguage);
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={toggleLanguage}
      className={`flex items-center gap-1 ${className}`}
      aria-label={`Switch to ${language === 'en' ? 'Kiswahili' : 'English'}`}
    >
      <Globe size={16} />
      {showLabel && (
        <span className="font-medium">
          {language === 'en' ? 'EN' : 'SW'}
        </span>
      )}
      <span className="sr-only">
        {language === 'en' ? 'Switch to Kiswahili' : 'Switch to English'}
      </span>
    </Button>
  );
}