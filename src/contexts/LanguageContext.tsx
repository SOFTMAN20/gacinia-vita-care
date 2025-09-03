import React, { createContext, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface LanguageContextType {
  language: string;
  changeLanguage: (lang: string) => void;
  t: (key: string, options?: any) => string;
  formatCurrency: (amount: number) => string;
  formatDate: (date: Date) => string;
  formatNumber: (num: number) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  const formatCurrency = (amount: number): string => {
    const symbol = t('currency.symbol');
    if (i18n.language === 'sw') {
      return `${symbol} ${amount.toLocaleString('sw-TZ')}`;
    }
    return `${amount.toLocaleString('en-TZ')} ${symbol}`;
  };

  const formatDate = (date: Date): string => {
    if (i18n.language === 'sw') {
      return date.toLocaleDateString('sw-TZ', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
    return date.toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatNumber = (num: number): string => {
    if (i18n.language === 'sw') {
      return num.toLocaleString('sw-TZ');
    }
    return num.toLocaleString('en-TZ');
  };

  const value: LanguageContextType = {
    language: i18n.language,
    changeLanguage,
    t,
    formatCurrency,
    formatDate,
    formatNumber,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}