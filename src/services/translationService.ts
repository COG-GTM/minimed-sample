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
      'This section is coming soon.': 'Esta sección estará disponible pronto.',
      'Track your continuous glucose readings, trends, and time in range.': 'Controla tus lecturas continuas de glucosa, las tendencias y el tiempo en rango.',
      'Review your basal and bolus insulin deliveries and dosing history.': 'Revisa tus entregas de insulina basal y bolo y el historial de dosis.',
      'Monitor your pump connectivity, battery level, and reservoir status.': 'Supervisa la conectividad de tu bomba, el nivel de batería y el estado del reservorio.',
      'Generate and download summary reports to share with your care team.': 'Genera y descarga informes resumidos para compartir con tu equipo de atención.',
      'Manage your account preferences, notifications, and device configuration.': 'Administra las preferencias de tu cuenta, las notificaciones y la configuración del dispositivo.'
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
      'This section is coming soon.': 'Cette section sera bientôt disponible.',
      'Track your continuous glucose readings, trends, and time in range.': 'Suivez vos lectures de glucose en continu, les tendances et le temps dans la plage.',
      'Review your basal and bolus insulin deliveries and dosing history.': "Consultez vos administrations d'insuline basale et bolus ainsi que l'historique des doses.",
      'Monitor your pump connectivity, battery level, and reservoir status.': "Surveillez la connectivité de votre pompe, le niveau de batterie et l'état du réservoir.",
      'Generate and download summary reports to share with your care team.': 'Générez et téléchargez des rapports récapitulatifs à partager avec votre équipe soignante.',
      'Manage your account preferences, notifications, and device configuration.': "Gérez les préférences de votre compte, les notifications et la configuration de l'appareil."
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
      'This section is coming soon.': 'Dieser Bereich ist bald verfügbar.',
      'Track your continuous glucose readings, trends, and time in range.': 'Verfolgen Sie Ihre kontinuierlichen Glukosemessungen, Trends und die Zeit im Bereich.',
      'Review your basal and bolus insulin deliveries and dosing history.': 'Überprüfen Sie Ihre basalen und Bolus-Insulinabgaben sowie den Dosierungsverlauf.',
      'Monitor your pump connectivity, battery level, and reservoir status.': 'Überwachen Sie die Konnektivität Ihrer Pumpe, den Batteriestand und den Reservoirstatus.',
      'Generate and download summary reports to share with your care team.': 'Erstellen und laden Sie zusammenfassende Berichte herunter, um sie mit Ihrem Behandlungsteam zu teilen.',
      'Manage your account preferences, notifications, and device configuration.': 'Verwalten Sie Ihre Kontoeinstellungen, Benachrichtigungen und die Gerätekonfiguration.'
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
