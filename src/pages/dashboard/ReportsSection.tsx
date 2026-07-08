import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import SectionPlaceholder from './SectionPlaceholder';

const ReportsSection = () => {
  const { t } = useLanguage();
  const [translations, setTranslations] = useState({
    title: 'Reports',
    description: 'View summaries, trends, and downloadable care reports.',
  });

  useEffect(() => {
    let active = true;

    const loadTranslations = async () => {
      const newTranslations = {
        title: await t('Reports'),
        description: await t('View summaries, trends, and downloadable care reports.'),
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

export default ReportsSection;
