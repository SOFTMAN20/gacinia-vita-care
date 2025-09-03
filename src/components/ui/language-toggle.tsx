import { Globe } from 'lucide-react';
import { Button } from './button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from 'react-i18next';

interface LanguageToggleProps {
  variant?: 'default' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}

export function LanguageToggle({ 
  variant = 'ghost', 
  size = 'sm',
  className 
}: LanguageToggleProps) {
  const { language, toggleLanguage } = useLanguage();
  const { t } = useTranslation();

  return (
    <Button
      variant={variant}
      size={size}
      onClick={toggleLanguage}
      className={`flex items-center gap-1 ${className}`}
      aria-label={language === 'en' ? t('common.switchToKiswahili') : t('common.switchToEnglish')}
    >
      <Globe size={16} />
      <span className="font-medium">
        {language === 'en' ? 'EN' : 'SW'}
      </span>
    </Button>
  );
}