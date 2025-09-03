import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import sw from './locales/sw.json';

const initI18n = () => {
  return i18n
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
      lng: 'en',
      fallbackLng: 'en',
      debug: true,
      
      detection: {
        order: ['localStorage', 'navigator'],
        caches: ['localStorage'],
      },

      interpolation: {
        escapeValue: false,
      },

      react: {
        useSuspense: false, // Disable suspense to avoid loading issues
      },

      nsSeparator: false,
      keySeparator: false,
    });
};

initI18n();

export default i18n;