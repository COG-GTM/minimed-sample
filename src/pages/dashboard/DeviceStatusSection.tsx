import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import SectionPlaceholder from './SectionPlaceholder';

const DeviceStatusSection = () => {
  const { t } = useLanguage();
  const [translations, setTranslations] = useState({
    title: 'Device Status',
    description: 'Monitor pump battery, reservoir levels, and connection health.',
  });

  useEffect(() => {
    let active = true;

    const loadTranslations = async () => {
      const newTranslations = {
        title: await t('Device Status'),
        description: await t('Monitor pump battery, reservoir levels, and connection health.'),
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

export default DeviceStatusSection;
