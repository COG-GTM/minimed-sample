/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { translationService } from '@/services/translationService';

export type Language = 'en' | 'es' | 'fr' | 'de';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (text: string) => Promise<string>;
  tSync: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    'nav.products': 'Products',
    'nav.support': 'Support',
    'nav.healthcare': 'Healthcare Professionals',
    'nav.signin': 'Sign In',
    'hero.title': 'Advanced Diabetes Management',
    'hero.subtitle': 'Experience freedom with automated insulin delivery',
    'hero.cta': 'Get Started',
    'features.monitoring': 'Real-time Monitoring',
    'features.delivery': 'Automated Insulin Delivery',
    'features.sharing': 'Data Sharing with Providers',
    'features.mobile': 'Mobile Connectivity',
  },
  es: {
    'nav.products': 'Productos',
    'nav.support': 'Soporte',
    'nav.healthcare': 'Profesionales de la Salud',
    'nav.signin': 'Iniciar Sesión',
    'hero.title': 'Gestión Avanzada de la Diabetes',
    'hero.subtitle': 'Experimente la libertad con la administración automatizada de insulina',
    'hero.cta': 'Comenzar',
    'features.monitoring': 'Monitoreo en Tiempo Real',
    'features.delivery': 'Administración Automatizada de Insulina',
    'features.sharing': 'Compartir Datos con Proveedores',
    'features.mobile': 'Conectividad Móvil',
  },
  fr: {
    'nav.products': 'Produits',
    'nav.support': 'Support',
    'nav.healthcare': 'Professionnels de Santé',
    'nav.signin': 'Se Connecter',
    'hero.title': 'Gestion Avancée du Diabète',
    'hero.subtitle': "Découvrez la liberté avec l'administration automatisée d'insuline",
    'hero.cta': 'Commencer',
    'features.monitoring': 'Surveillance en Temps Réel',
    'features.delivery': "Administration Automatisée d'Insuline",
    'features.sharing': 'Partage de Données avec les Prestataires',
    'features.mobile': 'Connectivité Mobile',
  },
  de: {
    'nav.products': 'Produkte',
    'nav.support': 'Unterstützung',
    'nav.healthcare': 'Gesundheitsfachkräfte',
    'nav.signin': 'Anmelden',
    'hero.title': 'Fortgeschrittenes Diabetes-Management',
    'hero.subtitle': 'Erleben Sie Freiheit mit automatisierter Insulinabgabe',
    'hero.cta': 'Loslegen',
    'features.monitoring': 'Echtzeitüberwachung',
    'features.delivery': 'Automatisierte Insulinabgabe',
    'features.sharing': 'Datenaustausch mit Anbietern',
    'features.mobile': 'Mobile Konnektivität',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = async (text: string): Promise<string> => {
    if (language === 'en') {
      return text;
    }
    return await translationService.translate(text, language, 'en');
  };

  const tSync = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, tSync }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
