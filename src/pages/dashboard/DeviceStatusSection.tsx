import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const DeviceStatusSection = () => {
  const { t } = useLanguage();
  const [translations, setTranslations] = useState({
    title: 'Device Status',
    description: 'Monitor pump connectivity, battery life, and reservoir levels.',
    comingSoon: 'Coming soon',
  });

  useEffect(() => {
    const loadTranslations = async () => {
      setTranslations({
        title: await t('Device Status'),
        description: await t('Monitor pump connectivity, battery life, and reservoir levels.'),
        comingSoon: await t('Coming soon'),
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
        <div className="inline-flex rounded-full bg-medtronic-lightCyan px-3 py-1 text-sm font-medium text-medtronic-deepPurple">
          {translations.comingSoon}
        </div>
      </CardContent>
    </Card>
  );
};

export default DeviceStatusSection;
