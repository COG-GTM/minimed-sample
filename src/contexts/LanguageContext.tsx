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
    'header.skip': 'Skip to main content',
    'header.dashboard': 'Dashboard',
    'header.goDashboard': 'Go to Dashboard',
    'header.openMenu': 'Open menu',
    'header.closeMenu': 'Close menu',
    'header.toggleSidebar': 'Toggle sidebar',
    'header.notifications': 'Notifications',
    'header.markRead': 'Mark all as read',
    'header.userMenu': 'User menu',
    'header.patient': 'Patient',
    'header.doctor': 'Doctor',
    'header.notificationGlucose': 'Your glucose is within target range.',
    'header.notificationReport': 'Your weekly report is ready.',
    'header.notificationDevice': 'Your pump is connected.',
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
    'header.skip': 'Saltar al contenido principal',
    'header.dashboard': 'Panel',
    'header.goDashboard': 'Ir al panel',
    'header.openMenu': 'Abrir menú',
    'header.closeMenu': 'Cerrar menú',
    'header.toggleSidebar': 'Alternar barra lateral',
    'header.notifications': 'Notificaciones',
    'header.markRead': 'Marcar todo como leído',
    'header.userMenu': 'Menú de usuario',
    'header.patient': 'Paciente',
    'header.doctor': 'Médico',
    'header.notificationGlucose': 'Tu glucosa está dentro del rango objetivo.',
    'header.notificationReport': 'Tu informe semanal está listo.',
    'header.notificationDevice': 'Tu bomba está conectada.',
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
    'header.skip': 'Aller au contenu principal',
    'header.dashboard': 'Tableau de bord',
    'header.goDashboard': 'Aller au tableau de bord',
    'header.openMenu': 'Ouvrir le menu',
    'header.closeMenu': 'Fermer le menu',
    'header.toggleSidebar': 'Afficher ou masquer le volet latéral',
    'header.notifications': 'Notifications',
    'header.markRead': 'Tout marquer comme lu',
    'header.userMenu': 'Menu utilisateur',
    'header.patient': 'Patient',
    'header.doctor': 'Médecin',
    'header.notificationGlucose': 'Votre glycémie est dans la plage cible.',
    'header.notificationReport': 'Votre rapport hebdomadaire est prêt.',
    'header.notificationDevice': 'Votre pompe est connectée.',
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
    'header.skip': 'Zum Hauptinhalt springen',
    'header.dashboard': 'Dashboard',
    'header.goDashboard': 'Zum Dashboard',
    'header.openMenu': 'Menü öffnen',
    'header.closeMenu': 'Menü schließen',
    'header.toggleSidebar': 'Seitenleiste umschalten',
    'header.notifications': 'Benachrichtigungen',
    'header.markRead': 'Alle als gelesen markieren',
    'header.userMenu': 'Benutzermenü',
    'header.patient': 'Patient',
    'header.doctor': 'Arzt',
    'header.notificationGlucose': 'Ihr Glukosewert liegt im Zielbereich.',
    'header.notificationReport': 'Ihr Wochenbericht ist bereit.',
    'header.notificationDevice': 'Ihre Pumpe ist verbunden.',
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
