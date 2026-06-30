import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const NotFound = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [translations, setTranslations] = useState({
    heading: 'Page not found',
    message: 'The page you are looking for may have moved or no longer exists.',
    goHome: 'Go Home',
    goDashboard: 'Go to Dashboard',
  });

  useEffect(() => {
    const loadTranslations = async () => {
      setTranslations({
        heading: await t('Page not found'),
        message: await t('The page you are looking for may have moved or no longer exists.'),
        goHome: await t('Go Home'),
        goDashboard: await t('Go to Dashboard'),
      });
    };
    loadTranslations();
  }, [t]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl overflow-hidden shadow-xl">
        <div className="h-2 bg-gradient-medtronic" />
        <CardHeader className="items-center text-center">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-medtronic text-white shadow-lg">
            <Home className="h-10 w-10" />
          </div>
          <CardTitle className="text-4xl text-medtronic-deepPurple">{translations.heading}</CardTitle>
          <CardDescription className="max-w-md">{translations.message}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button variant="outline" onClick={() => navigate('/')}> 
            {translations.goHome}
          </Button>
          <Button variant="medtronic" onClick={() => navigate('/dashboard')}>
            {translations.goDashboard}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
