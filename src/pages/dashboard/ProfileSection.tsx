import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import SectionPlaceholder from './SectionPlaceholder';

const ProfileSection = () => {
  const { t } = useLanguage();
  const [translations, setTranslations] = useState({
    title: 'Profile',
    description: 'Update your profile information, contact details, and role settings.',
  });

  useEffect(() => {
    let active = true;

    const loadTranslations = async () => {
      const newTranslations = {
        title: await t('Profile'),
        description: await t('Update your profile information, contact details, and role settings.'),
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

  return <SectionPlaceholder title={translations.title} description={translations.description} />;
};

export default ProfileSection;
