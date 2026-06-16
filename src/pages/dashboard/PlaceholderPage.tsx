import { useState, useEffect } from 'react';
import { LucideIcon } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface PlaceholderPageProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

const PlaceholderPage = ({ icon: Icon, title, description }: PlaceholderPageProps) => {
  const { t } = useLanguage();
  const [translations, setTranslations] = useState({
    title,
    description,
    comingSoon: 'Coming soon',
    comingSoonDesc: 'This section is under construction and will be available soon.'
  });

  useEffect(() => {
    const loadTranslations = async () => {
      setTranslations({
        title: await t(title),
        description: await t(description),
        comingSoon: await t('Coming soon'),
        comingSoonDesc: await t('This section is under construction and will be available soon.')
      });
    };
    loadTranslations();
  }, [t, title, description]);

  return (
    <>
      <div className="mb-6 flex items-center space-x-3">
        <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-medtronic-lightCyan to-medtronic-skyBlue flex items-center justify-center">
          <Icon className="h-6 w-6 text-medtronic-deepPurple" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{translations.title}</h1>
          <p className="text-gray-600">{translations.description}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{translations.comingSoon}</CardTitle>
          <CardDescription>{translations.comingSoonDesc}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Icon className="h-16 w-16 text-gray-300 mb-4" />
            <p className="text-gray-400">{translations.comingSoon}</p>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default PlaceholderPage;
