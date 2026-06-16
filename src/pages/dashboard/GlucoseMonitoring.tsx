import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity } from 'lucide-react';

const GlucoseMonitoring = () => {
  const { t } = useLanguage();
  const [translations, setTranslations] = useState({
    title: 'Glucose Monitoring',
    description: 'Track and analyze your continuous glucose monitor readings',
    comingSoon: 'Coming soon',
    placeholder: 'Detailed glucose monitoring trends and CGM data will appear here.'
  });

  useEffect(() => {
    const loadTranslations = async () => {
      setTranslations({
        title: await t('Glucose Monitoring'),
        description: await t('Track and analyze your continuous glucose monitor readings'),
        comingSoon: await t('Coming soon'),
        placeholder: await t('Detailed glucose monitoring trends and CGM data will appear here.')
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
            <Activity className="h-5 w-5 text-medtronic-brightBlue" />
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

export default GlucoseMonitoring;
