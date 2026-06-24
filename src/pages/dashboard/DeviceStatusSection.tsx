import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const DeviceStatusSection = () => {
  const { t } = useLanguage();
  const [translations, setTranslations] = useState({
    title: 'Device Status',
    description: 'Monitor your MiniMed 780G pump status, sensor connectivity, and device diagnostics.',
    comingSoon: 'Coming soon'
  });

  useEffect(() => {
    const loadTranslations = async () => {
      setTranslations({
        title: await t('Device Status'),
        description: await t('Monitor your MiniMed 780G pump status, sensor connectivity, and device diagnostics.'),
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

export default DeviceStatusSection;
