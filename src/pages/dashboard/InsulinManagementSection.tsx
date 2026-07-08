import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import SectionPlaceholder from './SectionPlaceholder';

const InsulinManagementSection = () => {
  const { t } = useLanguage();
  const [translations, setTranslations] = useState({
    title: 'Insulin Management',
    description: 'Review basal delivery, bolus suggestions, and dosing patterns.',
  });

  useEffect(() => {
    let active = true;

    const loadTranslations = async () => {
      const newTranslations = {
        title: await t('Insulin Management'),
        description: await t('Review basal delivery, bolus suggestions, and dosing patterns.'),
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

export default InsulinManagementSection;
