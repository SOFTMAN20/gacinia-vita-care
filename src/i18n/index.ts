import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translation resources
const resources = {
  en: {
    translation: {
      // Navigation
      nav: {
        medicines: 'Medicines',
        cosmetics: 'Cosmetics', 
        equipment: 'Equipment',
        wholesale: 'Wholesale',
        about: 'About',
        contact: 'Contact',
        dashboard: 'Dashboard',
        profile: 'Profile',
        admin: 'Admin Portal',
        logout: 'Logout'
      },
      // Header
      header: {
        phone: '+255621624287',
        location: 'Mbeya, Esso - Near Highway',
        tagline: 'Licensed Pharmacy & Medical Supplies',
        company: 'Gacinia',
        subtitle: 'Pharmacy & Medical ',
        searchPlaceholder: 'Search medicines, cosmetics, equipment...'
      },
      // Common
      common: {
        call: 'Call',
        search: 'Search',
        login: 'Login',
        logout: 'Logout',
        register: 'Register',
        addToCart: 'Add to Cart',
        buyNow: 'Buy Now',
        viewDetails: 'View Details',
        quickView: 'Quick View',
        language: 'Language',
        switchToKiswahili: 'Switch to Kiswahili'
      }
    }
  },
  sw: {
    translation: {
      // Navigation
      nav: {
        medicines: 'Dawa',
        cosmetics: 'Vipodozi',
        equipment: 'Vifaa',
        wholesale: 'Jumla',
        about: 'Kuhusu',
        contact: 'Mawasiliano',
        dashboard: 'Dashibodi',
        profile: 'Wasifu',
        admin: 'Mlango wa Msimamizi',
        logout: 'Ondoka'
      },
      // Header
      header: {
        phone: '+255621624287',
        location: 'Mbeya, Esso - Karibu na Barabara Kuu',
        tagline: 'Duka la Dawa Lililoidhinishwa na Vifaa vya Matibabu',
        company: 'Gacinia',
        subtitle: 'Duka la Dawa na Matibabu',
        searchPlaceholder: 'Tafuta dawa, vipodozi, vifaa...'
      },
      // Common
      common: {
        call: 'Piga Simu',
        search: 'Tafuta',
        login: 'Ingia',
        logout: 'Ondoka',
        register: 'Jisajili',
        addToCart: 'Ongeza Kwenye Mkoba',
        buyNow: 'Nunua Sasa',
        viewDetails: 'Ona Maelezo',
        quickView: 'Angalia Haraka',
        language: 'Lugha',
        switchToEnglish: 'Switch to English'
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // default language
    fallbackLng: 'en',
    
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    
    react: {
      useSuspense: false // Disable suspense to avoid loading issues
    }
  });

export default i18n;