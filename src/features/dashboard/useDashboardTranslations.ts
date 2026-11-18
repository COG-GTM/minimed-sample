import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export function useDashboardTranslations() {
  const { t } = useLanguage();
  const [translations, setTranslations] = useState({
    overview: 'Overview',
    glucoseMonitoring: 'Glucose Monitoring',
    insulinManagement: 'Insulin Management',
    deviceStatus: 'Device Status',
    reports: 'Reports',
    settings: 'Settings',
    myAccount: 'My Account',
    profile: 'Profile',
    signOut: 'Sign out',
    welcomeBack: 'Welcome back',
    diabetesOverview: "Here's your diabetes management overview for today",
    currentGlucose: 'Current Glucose',
    timeInRange: 'Time in Range',
    totalInsulinToday: 'Total Insulin Today',
    pumpStatus: 'Pump Status',
    battery: 'Battery',
    reservoir: 'Reservoir',
    units: 'units',
    glucoseTrend: '24-Hour Glucose Trend',
    glucoseTrendDesc: 'Your glucose levels over the past 24 hours',
    timeInRangeTitle: 'Time in Range',
    timeInRangeDesc: 'Distribution of glucose levels today',
    recentActivity: 'Recent Activity',
    recentActivityDesc: 'Your latest insulin deliveries and glucose readings',
    bolus: 'Bolus',
    basal: 'Basal',
    delivery: 'Delivery',
    carbs: 'carbs',
    belowRange: 'Below Range',
    inRange: 'In Range',
    aboveRange: 'Above Range'
  });

  useEffect(() => {
    const loadTranslations = async () => {
      const newTranslations = {
        overview: await t('Overview'),
        glucoseMonitoring: await t('Glucose Monitoring'),
        insulinManagement: await t('Insulin Management'),
        deviceStatus: await t('Device Status'),
        reports: await t('Reports'),
        settings: await t('Settings'),
        myAccount: await t('My Account'),
        profile: await t('Profile'),
        signOut: await t('Sign out'),
        welcomeBack: await t('Welcome back'),
        diabetesOverview: await t("Here's your diabetes management overview for today"),
        currentGlucose: await t('Current Glucose'),
        timeInRange: await t('Time in Range'),
        totalInsulinToday: await t('Total Insulin Today'),
        pumpStatus: await t('Pump Status'),
        battery: await t('Battery'),
        reservoir: await t('Reservoir'),
        units: await t('units'),
        glucoseTrend: await t('24-Hour Glucose Trend'),
        glucoseTrendDesc: await t('Your glucose levels over the past 24 hours'),
        timeInRangeTitle: await t('Time in Range'),
        timeInRangeDesc: await t('Distribution of glucose levels today'),
        recentActivity: await t('Recent Activity'),
        recentActivityDesc: await t('Your latest insulin deliveries and glucose readings'),
        bolus: await t('Bolus'),
        basal: await t('Basal'),
        delivery: await t('Delivery'),
        carbs: await t('carbs'),
        belowRange: await t('Below Range'),
        inRange: await t('In Range'),
        aboveRange: await t('Above Range')
      };
      setTranslations(newTranslations);
    };
    loadTranslations();
  }, [t]);

  return translations;
}

export type DashboardTranslations = ReturnType<typeof useDashboardTranslations>;
