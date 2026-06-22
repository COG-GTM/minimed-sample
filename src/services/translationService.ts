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
      'Battery': 'Batería',
      'Reservoir': 'Reservorio',
      'stable': 'estable',
      'units': 'unidades',
      'mg/dL': 'mg/dL',
      'Below Range': 'Debajo del Rango',
      'In Range': 'En Rango',
      'Above Range': 'Arriba del Rango',
      'Basal Delivery': 'Entrega Basal',
      'Profile': 'Perfil',
      'My Account': 'Mi Cuenta',
      'Sign out': 'Cerrar Sesión',
      'Bolus': 'Bolo',
      'Basal': 'Basal',
      'Delivery': 'Entrega',
      'carbs': 'carbohidratos',
      'Coming Soon': 'Próximamente',
      'Track your glucose levels in real-time with advanced CGM integration.': 'Rastrea tus niveles de glucosa en tiempo real con integración avanzada de MCG.',
      'Manage your insulin delivery with smart automated systems.': 'Gestiona tu entrega de insulina con sistemas automatizados inteligentes.',
      'Monitor your pump and sensor device status and connectivity.': 'Monitorea el estado y la conectividad de tu bomba y sensor.',
      'View detailed reports and analytics of your diabetes management data.': 'Ve reportes detallados y análisis de tus datos de gestión de diabetes.',
      'Configure your dashboard preferences, notifications, and device settings.': 'Configura tus preferencias del panel, notificaciones y ajustes del dispositivo.',
      'Manage your personal information and account settings.': 'Gestiona tu información personal y configuración de cuenta.'
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
      'Battery': 'Batterie',
      'Reservoir': 'Réservoir',
      'stable': 'stable',
      'units': 'unités',
      'mg/dL': 'mg/dL',
      'Below Range': 'En Dessous de la Plage',
      'In Range': 'Dans la Plage',
      'Above Range': 'Au-Dessus de la Plage',
      'Basal Delivery': 'Livraison Basale',
      'Profile': 'Profil',
      'My Account': 'Mon Compte',
      'Sign out': 'Déconnexion',
      'Bolus': 'Bolus',
      'Basal': 'Basal',
      'Delivery': 'Livraison',
      'carbs': 'glucides',
      'Coming Soon': 'Bientôt Disponible',
      'Track your glucose levels in real-time with advanced CGM integration.': 'Suivez vos niveaux de glucose en temps réel avec une intégration avancée du MCG.',
      'Manage your insulin delivery with smart automated systems.': 'Gérez votre administration d\'insuline avec des systèmes automatisés intelligents.',
      'Monitor your pump and sensor device status and connectivity.': 'Surveillez l\'état et la connectivité de votre pompe et capteur.',
      'View detailed reports and analytics of your diabetes management data.': 'Consultez des rapports détaillés et des analyses de vos données de gestion du diabète.',
      'Configure your dashboard preferences, notifications, and device settings.': 'Configurez vos préférences de tableau de bord, notifications et paramètres d\'appareil.',
      'Manage your personal information and account settings.': 'Gérez vos informations personnelles et paramètres de compte.'
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
      'Battery': 'Batterie',
      'Reservoir': 'Reservoir',
      'stable': 'stabil',
      'units': 'Einheiten',
      'mg/dL': 'mg/dL',
      'Below Range': 'Unter dem Bereich',
      'In Range': 'Im Bereich',
      'Above Range': 'Über dem Bereich',
      'Basal Delivery': 'Basale Abgabe',
      'Profile': 'Profil',
      'My Account': 'Mein Konto',
      'Sign out': 'Abmelden',
      'Bolus': 'Bolus',
      'Basal': 'Basal',
      'Delivery': 'Abgabe',
      'carbs': 'Kohlenhydrate',
      'Coming Soon': 'Demnächst Verfügbar',
      'Track your glucose levels in real-time with advanced CGM integration.': 'Verfolgen Sie Ihre Glukosewerte in Echtzeit mit fortschrittlicher CGM-Integration.',
      'Manage your insulin delivery with smart automated systems.': 'Verwalten Sie Ihre Insulinabgabe mit intelligenten automatisierten Systemen.',
      'Monitor your pump and sensor device status and connectivity.': 'Überwachen Sie den Status und die Konnektivität Ihrer Pumpe und Ihres Sensors.',
      'View detailed reports and analytics of your diabetes management data.': 'Sehen Sie detaillierte Berichte und Analysen Ihrer Diabetes-Management-Daten.',
      'Configure your dashboard preferences, notifications, and device settings.': 'Konfigurieren Sie Ihre Dashboard-Einstellungen, Benachrichtigungen und Geräteeinstellungen.',
      'Manage your personal information and account settings.': 'Verwalten Sie Ihre persönlichen Informationen und Kontoeinstellungen.'
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
