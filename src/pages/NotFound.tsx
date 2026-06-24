import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

const NotFound = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [translations, setTranslations] = useState({
    pageNotFound: 'Page Not Found',
    description: 'The page you are looking for does not exist or has been moved.',
    goHome: 'Go Home',
    goToDashboard: 'Go to Dashboard',
  });

  useEffect(() => {
    const loadTranslations = async () => {
      setTranslations({
        pageNotFound: await t('Page Not Found'),
        description: await t('The page you are looking for does not exist or has been moved.'),
        goHome: await t('Go Home'),
        goToDashboard: await t('Go to Dashboard'),
      });
    };
    loadTranslations();
  }, [t]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center px-4">
        <h1 className="text-9xl font-bold text-medtronic-deepPurple">404</h1>
        <h2 className="text-3xl font-semibold text-gray-800 mt-4">{translations.pageNotFound}</h2>
        <p className="text-gray-600 mt-2 max-w-md mx-auto">{translations.description}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Button
            onClick={() => navigate('/')}
            className="bg-medtronic-brightBlue hover:bg-blue-600 text-white px-8"
          >
            {translations.goHome}
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/dashboard')}
            className="border-medtronic-deepPurple text-medtronic-deepPurple hover:bg-medtronic-deepPurple hover:text-white px-8"
          >
            {translations.goToDashboard}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
