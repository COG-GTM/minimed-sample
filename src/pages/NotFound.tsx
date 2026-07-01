import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const NotFound = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [labels, setLabels] = useState({
    title: 'Page Not Found',
    message: "The page you're looking for doesn't exist or has been moved.",
    goHome: 'Go Home',
    goToDashboard: 'Go to Dashboard',
  });

  useEffect(() => {
    const loadTranslations = async () => {
      setLabels({
        title: await t('Page Not Found'),
        message: await t("The page you're looking for doesn't exist or has been moved."),
        goHome: await t('Go Home'),
        goToDashboard: await t('Go to Dashboard'),
      });
    };
    loadTranslations();
  }, [t]);

  return (
    <div className="min-h-screen bg-gradient-minimed flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mb-6 flex justify-center">
          <img src="/minimed-logo.svg" alt="MiniMed" className="h-12" />
        </div>
        <p className="text-7xl md:text-8xl font-bold text-medtronic-deepPurple">404</p>
        <h1 className="mt-4 text-2xl font-semibold text-medtronic-deepPurple">
          {labels.title}
        </h1>
        <p className="mt-2 text-medtronic-purple">
          {labels.message}
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => navigate('/')}
            className="bg-medtronic-brightBlue hover:bg-blue-600 text-white font-semibold px-6 rounded-full"
          >
            <Home className="mr-2 h-4 w-4" />
            {labels.goHome}
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/dashboard')}
            className="border-2 border-medtronic-deepPurple text-medtronic-deepPurple hover:bg-medtronic-deepPurple hover:text-white font-semibold px-6 rounded-full"
          >
            <LayoutDashboard className="mr-2 h-4 w-4" />
            {labels.goToDashboard}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
