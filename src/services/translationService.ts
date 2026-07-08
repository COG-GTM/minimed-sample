class TranslationService {
  private cache: Map<string, string> = new Map();
  
  private mockTranslations: Record<string, Record<string, string>> = {
    es: {
      'Welcome to MiniMed': 'Bienvenido a MiniMed',
      'Sign in to access your diabetes management dashboard': 'Inicia sesión para acceder a tu panel de gestión de diabetes',
      'Email': 'Correo electrónico',
      'Password': 'Contraseña',
      'Remember me': 'Recordarme',
      'Sign In': 'Iniciar Sesión',
      'Or continue with': 'O continúa con',
      'Demo Patient Account': 'Cuenta de Paciente Demo',
      'Demo Healthcare Provider': 'Proveedor de Salud Demo',
      'Forgot your password?': '¿Olvidaste tu contraseña?',
      'Create account': 'Crear cuenta',
      'Demo Credentials': 'Credenciales Demo',
      'Patient': 'Paciente',
      'Healthcare Provider': 'Proveedor de Salud',
      'Enter your email': 'Ingresa tu correo electrónico',
      'Enter your password': 'Ingresa tu contraseña',
      'Welcome back': 'Bienvenido de vuelta',
      'Here\'s your diabetes management overview for today': 'Aquí está tu resumen de gestión de diabetes para hoy',
      'Current Glucose': 'Glucosa Actual',
      'Time in Range': 'Tiempo en Rango',
      'Total Insulin Today': 'Insulina Total Hoy',
      'Pump Status': 'Estado de la Bomba',
      '24-Hour Glucose Trend': 'Tendencia de Glucosa de 24 Horas',
      'Your glucose levels over the past 24 hours': 'Tus niveles de glucosa en las últimas 24 horas',
      'Distribution of glucose levels today': 'Distribución de niveles de glucosa hoy',
      'Recent Activity': 'Actividad Reciente',
      'Your latest insulin deliveries and glucose readings': 'Tus últimas entregas de insulina y lecturas de glucosa',
      'Overview': 'Resumen',
      'Glucose Monitoring': 'Monitoreo de Glucosa',
      'Insulin Management': 'Gestión de Insulina',
      'Device Status': 'Estado del Dispositivo',
      'Reports': 'Reportes',
      'Settings': 'Configuraciones',
      'My Account': 'Mi Cuenta',
      'Profile': 'Perfil',
      'Sign out': 'Cerrar sesión',
      'Dashboard': 'Tablero',
      'Coming soon': 'Próximamente',
      'Go Home': 'Ir al Inicio',
      'Go to Dashboard': 'Ir al Tablero',
      'Track live glucose trends, sensor alerts, and time-in-range insights.': 'Sigue tendencias de glucosa en vivo, alertas del sensor e información del tiempo en rango.',
      'Review basal delivery, bolus suggestions, and dosing patterns.': 'Revisa la entrega basal, las sugerencias de bolo y los patrones de dosificación.',
      'Monitor pump battery, reservoir levels, and connection health.': 'Monitorea la batería de la bomba, los niveles del reservorio y el estado de conexión.',
      'View summaries, trends, and downloadable care reports.': 'Consulta resúmenes, tendencias e informes descargables de cuidado.',
      'Adjust notification preferences, account details, and device options.': 'Ajusta las preferencias de notificación, los detalles de la cuenta y las opciones del dispositivo.',
      'Update your profile information, contact details, and role settings.': 'Actualiza tu información de perfil, datos de contacto y configuración de rol.',
      'Page not found': 'Página no encontrada',
      'The page you\'re looking for doesn\'t exist.': 'La página que buscas no existe.',
      'Battery': 'Batería',
      'Reservoir': 'Reservorio',
      'stable': 'estable',
      'units': 'unidades',
      'mg/dL': 'mg/dL',
      'Below Range': 'Debajo del Rango',
      'In Range': 'En Rango',
      'Above Range': 'Arriba del Rango',
      'Basal Delivery': 'Entrega Basal'
    },
    fr: {
      'Welcome to MiniMed': 'Bienvenue à MiniMed',
      'Sign in to access your diabetes management dashboard': 'Connectez-vous pour accéder à votre tableau de bord de gestion du diabète',
      'Email': 'E-mail',
      'Password': 'Mot de passe',
      'Remember me': 'Se souvenir de moi',
      'Sign In': 'Se connecter',
      'Or continue with': 'Ou continuer avec',
      'Demo Patient Account': 'Compte Patient Démo',
      'Demo Healthcare Provider': 'Fournisseur de Soins Démo',
      'Forgot your password?': 'Mot de passe oublié?',
      'Create account': 'Créer un compte',
      'Demo Credentials': 'Identifiants Démo',
      'Patient': 'Patient',
      'Healthcare Provider': 'Fournisseur de Soins',
      'Enter your email': 'Entrez votre e-mail',
      'Enter your password': 'Entrez votre mot de passe',
      'Welcome back': 'Bon retour',
      'Here\'s your diabetes management overview for today': 'Voici votre aperçu de gestion du diabète pour aujourd\'hui',
      'Current Glucose': 'Glucose Actuel',
      'Time in Range': 'Temps dans la Plage',
      'Total Insulin Today': 'Insuline Totale Aujourd\'hui',
      'Pump Status': 'État de la Pompe',
      '24-Hour Glucose Trend': 'Tendance Glucose 24 Heures',
      'Your glucose levels over the past 24 hours': 'Vos niveaux de glucose au cours des 24 dernières heures',
      'Distribution of glucose levels today': 'Distribution des niveaux de glucose aujourd\'hui',
      'Recent Activity': 'Activité Récente',
      'Your latest insulin deliveries and glucose readings': 'Vos dernières livraisons d\'insuline et lectures de glucose',
      'Overview': 'Aperçu',
      'Glucose Monitoring': 'Surveillance du Glucose',
      'Insulin Management': 'Gestion de l\'Insuline',
      'Device Status': 'État de l\'Appareil',
      'Reports': 'Rapports',
      'Settings': 'Paramètres',
      'My Account': 'Mon Compte',
      'Profile': 'Profil',
      'Sign out': 'Se déconnecter',
      'Dashboard': 'Tableau de bord',
      'Coming soon': 'Bientôt disponible',
      'Go Home': "Aller à l'accueil",
      'Go to Dashboard': 'Aller au tableau de bord',
      'Track live glucose trends, sensor alerts, and time-in-range insights.': 'Suivez les tendances glycémiques en direct, les alertes du capteur et les informations sur le temps dans la plage.',
      'Review basal delivery, bolus suggestions, and dosing patterns.': 'Consultez la livraison basale, les suggestions de bolus et les schémas de dosage.',
      'Monitor pump battery, reservoir levels, and connection health.': 'Surveillez la batterie de la pompe, les niveaux du réservoir et l\'état de la connexion.',
      'View summaries, trends, and downloadable care reports.': 'Consultez les résumés, tendances et rapports de soins téléchargeables.',
      'Adjust notification preferences, account details, and device options.': 'Ajustez les préférences de notification, les détails du compte et les options de l\'appareil.',
      'Update your profile information, contact details, and role settings.': 'Mettez à jour vos informations de profil, vos coordonnées et vos paramètres de rôle.',
      'Page not found': 'Page introuvable',
      'The page you\'re looking for doesn\'t exist.': 'La page que vous recherchez n\'existe pas.',
      'Battery': 'Batterie',
      'Reservoir': 'Réservoir',
      'stable': 'stable',
      'units': 'unités',
      'mg/dL': 'mg/dL',
      'Below Range': 'En Dessous de la Plage',
      'In Range': 'Dans la Plage',
      'Above Range': 'Au-Dessus de la Plage',
      'Basal Delivery': 'Livraison Basale'
    },
    de: {
      'Welcome to MiniMed': 'Willkommen bei MiniMed',
      'Sign in to access your diabetes management dashboard': 'Melden Sie sich an, um auf Ihr Diabetes-Management-Dashboard zuzugreifen',
      'Email': 'E-Mail',
      'Password': 'Passwort',
      'Remember me': 'Angemeldet bleiben',
      'Sign In': 'Anmelden',
      'Or continue with': 'Oder fortfahren mit',
      'Demo Patient Account': 'Demo-Patientenkonto',
      'Demo Healthcare Provider': 'Demo-Gesundheitsdienstleister',
      'Forgot your password?': 'Passwort vergessen?',
      'Create account': 'Konto erstellen',
      'Demo Credentials': 'Demo-Anmeldedaten',
      'Patient': 'Patient',
      'Healthcare Provider': 'Gesundheitsdienstleister',
      'Enter your email': 'Geben Sie Ihre E-Mail ein',
      'Enter your password': 'Geben Sie Ihr Passwort ein',
      'Welcome back': 'Willkommen zurück',
      'Here\'s your diabetes management overview for today': 'Hier ist Ihre Diabetes-Management-Übersicht für heute',
      'Current Glucose': 'Aktueller Glukosewert',
      'Time in Range': 'Zeit im Bereich',
      'Total Insulin Today': 'Gesamtinsulin Heute',
      'Pump Status': 'Pumpenstatus',
      '24-Hour Glucose Trend': '24-Stunden-Glukose-Trend',
      'Your glucose levels over the past 24 hours': 'Ihre Glukosewerte der letzten 24 Stunden',
      'Distribution of glucose levels today': 'Verteilung der Glukosewerte heute',
      'Recent Activity': 'Letzte Aktivität',
      'Your latest insulin deliveries and glucose readings': 'Ihre neuesten Insulinabgaben und Glukosemessungen',
      'Overview': 'Übersicht',
      'Glucose Monitoring': 'Glukose-Überwachung',
      'Insulin Management': 'Insulin-Management',
      'Device Status': 'Gerätestatus',
      'Reports': 'Berichte',
      'Settings': 'Einstellungen',
      'My Account': 'Mein Konto',
      'Profile': 'Profil',
      'Sign out': 'Abmelden',
      'Dashboard': 'Instrumententafel',
      'Coming soon': 'Demnächst verfügbar',
      'Go Home': 'Zur Startseite',
      'Go to Dashboard': 'Zum Dashboard',
      'Track live glucose trends, sensor alerts, and time-in-range insights.': 'Verfolgen Sie Live-Glukosetrends, Sensorwarnungen und Erkenntnisse zur Zeit im Bereich.',
      'Review basal delivery, bolus suggestions, and dosing patterns.': 'Überprüfen Sie die Basalabgabe, Bolusvorschläge und Dosierungsmuster.',
      'Monitor pump battery, reservoir levels, and connection health.': 'Überwachen Sie den Batteriestand der Pumpe, die Reservoirfüllung und die Verbindungsqualität.',
      'View summaries, trends, and downloadable care reports.': 'Sehen Sie Zusammenfassungen, Trends und herunterladbare Berichte an.',
      'Adjust notification preferences, account details, and device options.': 'Passen Sie Benachrichtigungseinstellungen, Kontodetails und Geräteoptionen an.',
      'Update your profile information, contact details, and role settings.': 'Aktualisieren Sie Ihre Profilinformationen, Kontaktdaten und Rolleneinstellungen.',
      'Page not found': 'Seite nicht gefunden',
      'The page you\'re looking for doesn\'t exist.': 'Die gesuchte Seite existiert nicht.',
      'Battery': 'Batterie',
      'Reservoir': 'Reservoir',
      'stable': 'stabil',
      'units': 'Einheiten',
      'mg/dL': 'mg/dL',
      'Below Range': 'Unter dem Bereich',
      'In Range': 'Im Bereich',
      'Above Range': 'Über dem Bereich',
      'Basal Delivery': 'Basale Abgabe'
    }
  };
  
  constructor() {
    this.loadCacheFromStorage();
  }

  private getCacheKey(text: string, targetLang: string): string {
    return `${targetLang}:${text}`;
  }

  private loadCacheFromStorage(): void {
    try {
      const stored = localStorage.getItem('translation-cache');
      if (stored) {
        const parsed = JSON.parse(stored);
        this.cache = new Map(Object.entries(parsed));
      }
    } catch (error) {
      console.warn('Failed to load translation cache:', error);
    }
  }

  private saveCacheToStorage(): void {
    try {
      const cacheObj = Object.fromEntries(this.cache);
      localStorage.setItem('translation-cache', JSON.stringify(cacheObj));
    } catch (error) {
      console.warn('Failed to save translation cache:', error);
    }
  }

  async translate(text: string, targetLang: string, sourceLang: string = 'en'): Promise<string> {
    if (targetLang === sourceLang) {
      return text;
    }

    const cacheKey = this.getCacheKey(text, targetLang);
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    if (this.mockTranslations[targetLang] && this.mockTranslations[targetLang][text]) {
      const translation = this.mockTranslations[targetLang][text];
      this.cache.set(cacheKey, translation);
      this.saveCacheToStorage();
      return translation;
    }

    return text;
  }

  clearCache(): void {
    this.cache.clear();
    localStorage.removeItem('translation-cache');
  }
}

export const translationService = new TranslationService();
export default translationService;
