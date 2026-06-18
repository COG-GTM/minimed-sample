import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface PlaceholderPageProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

const PlaceholderPage = ({ icon: Icon, title, description }: PlaceholderPageProps) => {
  const { t } = useLanguage();
  const [text, setText] = useState({
    title,
    description,
    comingSoon: 'This section is coming soon.'
  });

  useEffect(() => {
    const loadTranslations = async () => {
      setText({
        title: await t(title),
        description: await t(description),
        comingSoon: await t('This section is coming soon.')
      });
    };
    loadTranslations();
  }, [t, title, description]);

  return (
    <>
      <div className="mb-6 flex items-center space-x-3">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-medtronic-lightCyan to-medtronic-skyBlue flex items-center justify-center">
          <Icon className="h-5 w-5 text-medtronic-deepPurple" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">{text.title}</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{text.title}</CardTitle>
          <CardDescription>{text.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">{text.comingSoon}</p>
        </CardContent>
      </Card>
    </>
  );
};

export default PlaceholderPage;
