import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const ProfileSection = () => {
  const { t } = useLanguage();
  const [translations, setTranslations] = useState({
    title: 'Profile',
    description: 'View and update your personal information, medical details, and account settings.',
    comingSoon: 'Coming soon'
  });

  useEffect(() => {
    const loadTranslations = async () => {
      setTranslations({
        title: await t('Profile'),
        description: await t('View and update your personal information, medical details, and account settings.'),
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

export default ProfileSection;
