import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wifi } from 'lucide-react';

const DeviceStatus = () => {
  const { t } = useLanguage();
  const [translations, setTranslations] = useState({
    title: 'Device Status',
    description: 'Monitor your pump, sensor, and connectivity status',
    comingSoon: 'Coming soon',
    placeholder: 'Pump battery, reservoir, and sensor connectivity details will appear here.'
  });

  useEffect(() => {
    const loadTranslations = async () => {
      setTranslations({
        title: await t('Device Status'),
        description: await t('Monitor your pump, sensor, and connectivity status'),
        comingSoon: await t('Coming soon'),
        placeholder: await t('Pump battery, reservoir, and sensor connectivity details will appear here.')
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
          <CardTitle className="flex items-center space-x-2">
            <Wifi className="h-5 w-5 text-medtronic-brightBlue" />
            <span>{translations.title}</span>
          </CardTitle>
          <CardDescription>{translations.comingSoon}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">{translations.placeholder}</p>
        </CardContent>
      </Card>
    </>
  );
};

export default DeviceStatus;
