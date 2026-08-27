import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const GlucoseMonitoring = () => {
  const { t } = useLanguage();
  const [translations, setTranslations] = useState({
    title: 'Glucose Monitoring',
    description: 'Review your continuous glucose monitoring data',
    comingSoon: 'Detailed glucose monitoring views are coming soon.'
  });

  useEffect(() => {
    const loadTranslations = async () => {
      setTranslations({
        title: await t('Glucose Monitoring'),
        description: await t('Review your continuous glucose monitoring data'),
        comingSoon: await t('Detailed glucose monitoring views are coming soon.')
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

export default GlucoseMonitoring;
