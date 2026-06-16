import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings as SettingsIcon } from 'lucide-react';

const Settings = () => {
  const { t } = useLanguage();
  const [translations, setTranslations] = useState({
    title: 'Settings',
    description: 'Manage your account preferences and device configuration',
    comingSoon: 'Coming soon',
    placeholder: 'Account, notification, and device settings will appear here.'
  });

  useEffect(() => {
    const loadTranslations = async () => {
      setTranslations({
        title: await t('Settings'),
        description: await t('Manage your account preferences and device configuration'),
        comingSoon: await t('Coming soon'),
        placeholder: await t('Account, notification, and device settings will appear here.')
      });
    };
    loadTranslations();
  }, [t]);

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{translations.title}</h1>
        <p className="text-gray-600">{translations.description}</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <SettingsIcon className="h-5 w-5 text-medtronic-brightBlue" />
            <span>{translations.title}</span>
          </CardTitle>
          <CardDescription>{translations.comingSoon}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">{translations.placeholder}</p>
        </CardContent>
      </Card>
    </>
  );
};

export default Settings;
