import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Reports = () => {
  const { t } = useLanguage();
  const [translations, setTranslations] = useState({
    title: 'Reports',
    description: 'Generate and review your therapy reports',
    comingSoon: 'Detailed reporting views are coming soon.'
  });

  useEffect(() => {
    const loadTranslations = async () => {
      setTranslations({
        title: await t('Reports'),
        description: await t('Generate and review your therapy reports'),
        comingSoon: await t('Detailed reporting views are coming soon.')
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

export default Reports;
