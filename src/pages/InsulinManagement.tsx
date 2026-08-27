import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const InsulinManagement = () => {
  const { t } = useLanguage();
  const [translations, setTranslations] = useState({
    title: 'Insulin Management',
    description: 'Track your basal and bolus insulin deliveries',
    comingSoon: 'Detailed insulin management views are coming soon.'
  });

  useEffect(() => {
    const loadTranslations = async () => {
      setTranslations({
        title: await t('Insulin Management'),
        description: await t('Track your basal and bolus insulin deliveries'),
        comingSoon: await t('Detailed insulin management views are coming soon.')
      });
    };
    loadTranslations();
  }, [t]);

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{translations.title}</h1>
        <p className="text-gray-600">{translations.description}</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{translations.title}</CardTitle>
          <CardDescription>{translations.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">{translations.comingSoon}</p>
        </CardContent>
      </Card>
    </>
  );
};

export default InsulinManagement;
