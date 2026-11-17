import { useLanguage } from '@/contexts/LanguageContext';

const SkipToContent = () => {
  const { tSync } = useLanguage();
  return (
    <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-white focus:p-4 focus:text-medtronic-deepPurple focus:shadow-lg">
      {tSync('header.skip')}
    </a>
  );
};

export default SkipToContent;
