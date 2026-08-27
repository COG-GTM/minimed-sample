import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const DeviceStatusPage = () => {
  const { t } = useLanguage();
  const [translations, setTranslations] = useState({
    title: 'Device Status',
    description: 'Monitor your pump and sensor status',
    comingSoon: 'Detailed device status views are coming soon.'
  });

  useEffect(() => {
    const loadTranslations = async () => {
      setTranslations({
        title: await t('Device Status'),
        description: await t('Monitor your pump and sensor status'),
        comingSoon: await t('Detailed device status views are coming soon.')
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

export default DeviceStatusPage;
