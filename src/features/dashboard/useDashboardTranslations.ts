import { useLanguage } from '@/contexts/LanguageContext';

export function useDashboardTranslations() {
  const { tSync } = useLanguage();
  const translations = {
    overview: tSync('Overview'),
    glucoseMonitoring: tSync('Glucose Monitoring'),
    insulinManagement: tSync('Insulin Management'),
    deviceStatus: tSync('Device Status'),
    reports: tSync('Reports'),
    settings: tSync('Settings'),
    myAccount: tSync('My Account'),
    profile: tSync('Profile'),
    signOut: tSync('Sign out'),
    welcomeBack: tSync('Welcome back'),
    diabetesOverview: tSync("Here's your diabetes management overview for today"),
    currentGlucose: tSync('Current Glucose'),
    timeInRange: tSync('Time in Range'),
    totalInsulinToday: tSync('Total Insulin Today'),
    pumpStatus: tSync('Pump Status'),
    battery: tSync('Battery'),
    reservoir: tSync('Reservoir'),
    units: tSync('units'),
    glucoseTrend: tSync('24-Hour Glucose Trend'),
    glucoseTrendDesc: tSync('Your glucose levels over the past 24 hours'),
    timeInRangeTitle: tSync('Time in Range'),
    timeInRangeDesc: tSync('Distribution of glucose levels today'),
    recentActivity: tSync('Recent Activity'),
    recentActivityDesc: tSync('Your latest insulin deliveries and glucose readings'),
    bolus: tSync('Bolus'),
    basal: tSync('Basal'),
    delivery: tSync('Delivery'),
    carbs: tSync('carbs'),
    belowRange: tSync('Below Range'),
    inRange: tSync('In Range'),
    aboveRange: tSync('Above Range')
  };

  return translations;
}

export type DashboardTranslations = ReturnType<typeof useDashboardTranslations>;
