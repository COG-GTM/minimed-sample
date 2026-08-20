import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface DashboardSectionProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

const DashboardSection = ({ icon: Icon, title, description }: DashboardSectionProps) => {
  const { t } = useLanguage();
  const [translations, setTranslations] = useState({
    title,
    description,
    comingSoon: 'This section is under development. Check back soon for updates.'
  });

  useEffect(() => {
    const loadTranslations = async () => {
      const newTranslations = {
        title: await t(title),
        description: await t(description),
        comingSoon: await t('This section is under development. Check back soon for updates.')
      };
      setTranslations(newTranslations);
    };
    loadTranslations();
  }, [t, title, description]);

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{translations.title}</h1>
        <p className="text-gray-600">{translations.description}</p>
      </div>
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-medtronic-lightCyan to-medtronic-skyBlue rounded-full flex items-center justify-center">
              <Icon className="h-6 w-6 text-medtronic-deepPurple" />
            </div>
            <div>
              <CardTitle>{translations.title}</CardTitle>
              <CardDescription>{translations.description}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">{translations.comingSoon}</p>
        </CardContent>
      </Card>
    </>
  );
};

export default DashboardSection;
