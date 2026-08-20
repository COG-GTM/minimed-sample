import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import LanguageDropdown from '@/components/LanguageDropdown';
import { ArrowLeft, UserPlus } from 'lucide-react';

const Signup = () => {
  const { t } = useLanguage();
  const [translations, setTranslations] = useState({
    backToSignIn: 'Back to Sign In',
    title: 'Create an Account',
    description: 'Account creation is not available in this demo. Use the demo credentials on the sign in page.',
    demoNote: 'Demo accounts: patient@example.com or doctor@example.com with password demo123.'
  });

  useEffect(() => {
    const loadTranslations = async () => {
      const newTranslations = {
        backToSignIn: await t('Back to Sign In'),
        title: await t('Create an Account'),
        description: await t('Account creation is not available in this demo. Use the demo credentials on the sign in page.'),
        demoNote: await t('Demo accounts: patient@example.com or doctor@example.com with password demo123.')
      };
      setTranslations(newTranslations);
    };
    loadTranslations();
  }, [t]);

  return (
    <div className="min-h-screen bg-gradient-minimed flex flex-col">
      <header className="p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/auth" className="inline-flex items-center space-x-2 text-medtronic-deepPurple hover:text-medtronic-purple transition-colors font-medium">
            <ArrowLeft className="h-4 w-4" />
            <span>{translations.backToSignIn}</span>
          </Link>
          <LanguageDropdown />
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl bg-white/95 backdrop-blur-sm border-0">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-medtronic-brightBlue to-medtronic-skyBlue rounded-full flex items-center justify-center shadow-lg">
                <UserPlus className="h-8 w-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl text-center font-light text-medtronic-deepPurple">{translations.title}</CardTitle>
            <CardDescription className="text-center text-medtronic-purple">
              {translations.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-center text-gray-600">{translations.demoNote}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
