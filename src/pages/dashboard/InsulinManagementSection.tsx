import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const InsulinManagementSection = () => {
  const { t } = useLanguage();
  const [translations, setTranslations] = useState({
    title: 'Insulin Management',
    description: 'Manage your insulin delivery settings, review basal rates, and track bolus history.',
    comingSoon: 'Coming soon'
  });

  useEffect(() => {
    const loadTranslations = async () => {
      setTranslations({
        title: await t('Insulin Management'),
        description: await t('Manage your insulin delivery settings, review basal rates, and track bolus history.'),
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

export default InsulinManagementSection;
