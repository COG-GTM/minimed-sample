import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wifi } from 'lucide-react';

const DeviceStatusSection = () => {
  const { t } = useLanguage();
  const [translations, setTranslations] = useState({
    title: 'Device Status',
    description: 'Monitor your pump and sensor device status and connectivity.',
    comingSoon: 'Coming Soon',
  });

  useEffect(() => {
    const load = async () => {
      setTranslations({
        title: await t('Device Status'),
        description: await t('Monitor your pump and sensor device status and connectivity.'),
        comingSoon: await t('Coming Soon'),
      });
    };
    load();
  }, [t]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-medtronic-deepPurple">{translations.title}</h2>
        <p className="text-gray-600 mt-1">{translations.description}</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wifi className="h-5 w-5 text-medtronic-brightBlue" />
            {translations.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="w-16 h-16 bg-medtronic-lightCyan rounded-full flex items-center justify-center mb-4">
            <Wifi className="h-8 w-8 text-medtronic-deepPurple" />
          </div>
          <span className="inline-block px-3 py-1 bg-medtronic-lightCyan text-medtronic-deepPurple text-sm font-semibold rounded-full">
            {translations.comingSoon}
          </span>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeviceStatusSection;
