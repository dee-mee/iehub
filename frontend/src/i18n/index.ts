import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from '@/locales/en/common.json'
import fr from '@/locales/fr/common.json'
import sw from '@/locales/sw/common.json'
import ar from '@/locales/ar/common.json'

void i18n.use(initReactI18next).init({
  resources: {
    en: { common: en },
    fr: { common: fr },
    sw: { common: sw },
    ar: { common: ar },
  },
  lng: 'en',
  fallbackLng: 'en',
  defaultNS: 'common',
  interpolation: { escapeValue: false },
})

export default i18n
