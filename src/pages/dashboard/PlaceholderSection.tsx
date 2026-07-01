import { useEffect, useState } from 'react';
import { LucideIcon, Clock } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface PlaceholderSectionProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

const PlaceholderSection = ({ icon: Icon, title, description }: PlaceholderSectionProps) => {
  const { t } = useLanguage();
  const [labels, setLabels] = useState({
    title,
    description,
    comingSoon: 'Coming soon',
  });

  useEffect(() => {
    const loadTranslations = async () => {
      setLabels({
        title: await t(title),
        description: await t(description),
        comingSoon: await t('Coming soon'),
      });
    };
    loadTranslations();
  }, [t, title, description]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{labels.title}</h1>
        <p className="text-gray-600">{labels.description}</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-medtronic-lightCyan to-medtronic-skyBlue flex items-center justify-center">
              <Icon className="h-6 w-6 text-medtronic-deepPurple" />
            </div>
            <div>
              <CardTitle className="text-medtronic-deepPurple">{labels.title}</CardTitle>
              <CardDescription>{labels.description}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-medtronic-lightCyan flex items-center justify-center mb-4">
              <Clock className="h-8 w-8 text-medtronic-deepPurple" />
            </div>
            <span className="inline-flex items-center rounded-full bg-medtronic-deepPurple/10 px-4 py-1 text-sm font-semibold text-medtronic-deepPurple">
              {labels.comingSoon}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlaceholderSection;
