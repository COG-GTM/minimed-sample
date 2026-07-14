import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const NotFound = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [translations, setTranslations] = useState({
    title: 'Page not found',
    description: "The page you're looking for doesn't exist or may have moved.",
    home: 'Go Home',
    dashboard: 'Go to Dashboard',
  });

  useEffect(() => {
    const loadTranslations = async () => {
      setTranslations({
        title: await t('Page not found'),
        description: await t("The page you're looking for doesn't exist or may have moved."),
        home: await t('Go Home'),
        dashboard: await t('Go to Dashboard'),
      });
    };
    loadTranslations();
  }, [t]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-minimed px-4">
      <div className="max-w-xl text-center">
        <p className="bg-gradient-medtronic bg-clip-text text-8xl font-bold text-transparent">404</p>
        <h1 className="mt-4 text-3xl font-bold text-medtronic-deepPurple">{translations.title}</h1>
        <p className="mt-3 text-gray-600">{translations.description}</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button onClick={() => navigate('/')} className="bg-medtronic-brightBlue hover:bg-blue-600">
            {translations.home}
          </Button>
          <Button onClick={() => navigate('/dashboard')} variant="outline" className="border-medtronic-deepPurple text-medtronic-deepPurple">
            {translations.dashboard}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
