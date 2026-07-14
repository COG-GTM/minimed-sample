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
      'Basal Delivery': 'Entrega Basal'
      ,'Profile': 'Perfil'
      ,'Dashboard': 'Panel'
      ,'Coming soon': 'Próximamente'
      ,'View detailed glucose trends, CGM data, and historical readings.': 'Consulta las tendencias detalladas de glucosa, los datos del MCG y las lecturas históricas.'
      ,'Review basal rates, bolus history, and insulin delivery settings.': 'Revisa las tasas basales, el historial de bolos y la configuración de administración de insulina.'
      ,'Check pump connectivity, battery, reservoir, and sensor status.': 'Comprueba la conectividad de la bomba, la batería, el reservorio y el estado del sensor.'
      ,'Generate and export clinical reports for you and your care team.': 'Genera y exporta informes clínicos para ti y tu equipo de atención.'
      ,'Manage your preferences, alerts, and account settings.': 'Administra tus preferencias, alertas y configuración de la cuenta.'
      ,'View and edit your personal and medical profile information.': 'Consulta y edita tu información personal y médica.'
      ,'Page not found': 'Página no encontrada'
      ,"The page you're looking for doesn't exist or may have moved.": 'La página que buscas no existe o puede haberse movido.'
      ,'Go Home': 'Ir al inicio'
      ,'Go to Dashboard': 'Ir al panel'
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
      'Basal Delivery': 'Livraison Basale'
      ,'Profile': 'Profil'
      ,'Dashboard': 'Tableau de bord'
      ,'Coming soon': 'Bientôt disponible'
      ,'View detailed glucose trends, CGM data, and historical readings.': 'Consultez les tendances détaillées du glucose, les données du CGM et l’historique des lectures.'
      ,'Review basal rates, bolus history, and insulin delivery settings.': 'Consultez les débits basaux, l’historique des bolus et les paramètres d’administration d’insuline.'
      ,'Check pump connectivity, battery, reservoir, and sensor status.': 'Vérifiez la connectivité de la pompe, la batterie, le réservoir et l’état du capteur.'
      ,'Generate and export clinical reports for you and your care team.': 'Générez et exportez des rapports cliniques pour vous et votre équipe soignante.'
      ,'Manage your preferences, alerts, and account settings.': 'Gérez vos préférences, vos alertes et les paramètres de votre compte.'
      ,'View and edit your personal and medical profile information.': 'Consultez et modifiez vos informations personnelles et médicales.'
      ,'Page not found': 'Page introuvable'
      ,"The page you're looking for doesn't exist or may have moved.": 'La page que vous recherchez n’existe pas ou a peut-être été déplacée.'
      ,'Go Home': 'Accueil'
      ,'Go to Dashboard': 'Aller au tableau de bord'
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
      'Basal Delivery': 'Basale Abgabe'
      ,'Profile': 'Profil'
      ,'Dashboard': 'Übersicht'
      ,'Coming soon': 'Demnächst verfügbar'
      ,'View detailed glucose trends, CGM data, and historical readings.': 'Detaillierte Glukosetrends, CGM-Daten und historische Messwerte anzeigen.'
      ,'Review basal rates, bolus history, and insulin delivery settings.': 'Basalraten, Bolushistorie und Einstellungen zur Insulinabgabe überprüfen.'
      ,'Check pump connectivity, battery, reservoir, and sensor status.': 'Pumpenverbindung, Batterie, Reservoir und Sensorstatus überprüfen.'
      ,'Generate and export clinical reports for you and your care team.': 'Klinische Berichte für Sie und Ihr Behandlungsteam erstellen und exportieren.'
      ,'Manage your preferences, alerts, and account settings.': 'Ihre Präferenzen, Alarme und Kontoeinstellungen verwalten.'
      ,'View and edit your personal and medical profile information.': 'Ihre persönlichen und medizinischen Profildaten anzeigen und bearbeiten.'
      ,'Page not found': 'Seite nicht gefunden'
      ,"The page you're looking for doesn't exist or may have moved.": 'Die gesuchte Seite existiert nicht oder wurde möglicherweise verschoben.'
      ,'Go Home': 'Zur Startseite'
      ,'Go to Dashboard': 'Zum Dashboard'
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
