import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import sw from './locales/sw.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: en
      },
      sw: {
        translation: sw
      }
    },
    lng: 'en', // default language
    fallbackLng: 'en',
    debug: false,
    
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },

    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },

    // Custom formatting for currency and numbers
    nsSeparator: false,
    keySeparator: false,
  });

export default i18n;