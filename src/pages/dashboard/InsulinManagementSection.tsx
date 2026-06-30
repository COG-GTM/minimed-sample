import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const InsulinManagementSection = () => {
  const { t } = useLanguage();
  const [translations, setTranslations] = useState({
    title: 'Insulin Management',
    description: 'Track bolus, basal, and correction delivery details.',
    comingSoon: 'Coming soon',
  });

  useEffect(() => {
    const loadTranslations = async () => {
      setTranslations({
        title: await t('Insulin Management'),
        description: await t('Track bolus, basal, and correction delivery details.'),
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

export default InsulinManagementSection;
