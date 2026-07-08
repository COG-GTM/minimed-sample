import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Home, LayoutDashboard } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const NotFound = () => {
  const { t } = useLanguage();
  const [translations, setTranslations] = useState({
    title: 'Page not found',
    description: "The page you're looking for doesn't exist.",
    goHome: 'Go Home',
    goToDashboard: 'Go to Dashboard',
  });

  useEffect(() => {
    let active = true;

    const loadTranslations = async () => {
      const newTranslations = {
        title: await t('Page not found'),
        description: await t("The page you're looking for doesn't exist."),
        goHome: await t('Go Home'),
        goToDashboard: await t('Go to Dashboard'),
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

  return (
    <div className="min-h-screen bg-gradient-minimed flex items-center justify-center p-4">
      <Card className="w-full max-w-lg border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-medtronic-deepPurple to-medtronic-brightBlue text-white shadow-lg">
            <span className="text-3xl font-bold">404</span>
          </div>
          <div className="space-y-2">
            <CardTitle className="text-3xl font-light text-medtronic-deepPurple">
              {translations.title}
            </CardTitle>
            <CardDescription className="text-base text-medtronic-purple">
              {translations.description}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild variant="outline" className="gap-2">
            <Link to="/">
              <Home className="h-4 w-4" />
              {translations.goHome}
            </Link>
          </Button>
          <Button asChild className="gap-2">
            <Link to="/dashboard">
              <LayoutDashboard className="h-4 w-4" />
              {translations.goToDashboard}
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
