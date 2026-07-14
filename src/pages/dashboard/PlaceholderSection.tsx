import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface PlaceholderSectionProps {
  title: string;
  description: string;
}

const PlaceholderSection = ({ title, description }: PlaceholderSectionProps) => {
  const { t } = useLanguage();
  const [translations, setTranslations] = useState({
    title,
    description,
    comingSoon: 'Coming soon',
  });

  useEffect(() => {
    const loadTranslations = async () => {
      setTranslations({
        title: await t(title),
        description: await t(description),
        comingSoon: await t('Coming soon'),
      });
    };
    loadTranslations();
  }, [description, t, title]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-medtronic-deepPurple">{translations.title}</CardTitle>
        <CardDescription>{translations.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <span className="inline-flex rounded-full bg-medtronic-lightCyan px-3 py-1 text-sm font-medium text-medtronic-brightBlue">
          {translations.comingSoon}
        </span>
      </CardContent>
    </Card>
  );
};

export default PlaceholderSection;
