import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const ReportsSection = () => {
  const { t } = useLanguage();
  const [translations, setTranslations] = useState({
    title: 'Reports',
    description: 'Generate and view detailed reports on your glucose levels, insulin usage, and health trends.',
    comingSoon: 'Coming soon'
  });

  useEffect(() => {
    const loadTranslations = async () => {
      setTranslations({
        title: await t('Reports'),
        description: await t('Generate and view detailed reports on your glucose levels, insulin usage, and health trends.'),
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

export default ReportsSection;
