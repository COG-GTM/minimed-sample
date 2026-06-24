import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const GlucoseMonitoringSection = () => {
  const { t } = useLanguage();
  const [translations, setTranslations] = useState({
    title: 'Glucose Monitoring',
    description: 'View and analyze your continuous glucose monitoring data, trends, and patterns.',
    comingSoon: 'Coming soon'
  });

  useEffect(() => {
    const loadTranslations = async () => {
      setTranslations({
        title: await t('Glucose Monitoring'),
        description: await t('View and analyze your continuous glucose monitoring data, trends, and patterns.'),
        comingSoon: await t('Coming soon')
      });
    };
    loadTranslations();
  }, [t]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-medtronic-deepPurple">{translations.title}</CardTitle>
        <CardDescription>{translations.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500 italic">{translations.comingSoon}</p>
      </CardContent>
    </Card>
  );
};

export default GlucoseMonitoringSection;
