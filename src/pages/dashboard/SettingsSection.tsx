import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import SectionPlaceholder from './SectionPlaceholder';

const SettingsSection = () => {
  const { t } = useLanguage();
  const [translations, setTranslations] = useState({
    title: 'Settings',
    description: 'Adjust notification preferences, account details, and device options.',
  });

  useEffect(() => {
    let active = true;

    const loadTranslations = async () => {
      const newTranslations = {
        title: await t('Settings'),
        description: await t('Adjust notification preferences, account details, and device options.'),
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

export default SettingsSection;
