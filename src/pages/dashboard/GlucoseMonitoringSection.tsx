import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import SectionPlaceholder from './SectionPlaceholder';

const GlucoseMonitoringSection = () => {
  const { t } = useLanguage();
  const [translations, setTranslations] = useState({
    title: 'Glucose Monitoring',
    description: 'Track live glucose trends, sensor alerts, and time-in-range insights.',
  });

  useEffect(() => {
    let active = true;

    const loadTranslations = async () => {
      const newTranslations = {
        title: await t('Glucose Monitoring'),
        description: await t('Track live glucose trends, sensor alerts, and time-in-range insights.'),
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

export default GlucoseMonitoringSection;
