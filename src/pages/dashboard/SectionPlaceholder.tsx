import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface SectionPlaceholderProps {
  title: string;
  description: string;
}

const SectionPlaceholder = ({ title, description }: SectionPlaceholderProps) => {
  const { t } = useLanguage();
  const [translations, setTranslations] = useState({
    comingSoon: 'Coming soon',
  });

  useEffect(() => {
    let active = true;

    const loadTranslations = async () => {
      const newTranslations = {
        comingSoon: await t('Coming soon'),
      };

      if (active) {
        setTranslations(newTranslations);
      }
    };

    loadTranslations();

    return () => {
      active = false;
    };
  }, [t]);

  return (
    <Card className="border-medtronic-lightCyan shadow-sm">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <CardTitle className="text-2xl text-medtronic-deepPurple">{title}</CardTitle>
            <CardDescription className="text-base">{description}</CardDescription>
          </div>
          <span className="rounded-full bg-medtronic-lightCyan px-3 py-1 text-xs font-semibold uppercase tracking-wide text-medtronic-deepPurple">
            {translations.comingSoon}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-xl border border-dashed border-medtronic-skyBlue/50 bg-white/70 p-6 text-sm text-gray-600">
          {description}
        </div>
      </CardContent>
    </Card>
  );
};

export default SectionPlaceholder;
