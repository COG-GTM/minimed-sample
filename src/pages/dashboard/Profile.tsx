import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [translations, setTranslations] = useState({
    title: 'Profile',
    description: 'View and manage your personal account information',
    accountDetails: 'Account Details',
    comingSoon: 'Coming soon',
    name: 'Name',
    email: 'Email',
    role: 'Role',
    placeholder: 'Editable profile preferences will appear here.'
  });

  useEffect(() => {
    const loadTranslations = async () => {
      setTranslations({
        title: await t('Profile'),
        description: await t('View and manage your personal account information'),
        accountDetails: await t('Account Details'),
        comingSoon: await t('Coming soon'),
        name: await t('Name'),
        email: await t('Email'),
        role: await t('Role'),
        placeholder: await t('Editable profile preferences will appear here.')
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
            <User className="h-5 w-5 text-medtronic-brightBlue" />
            <span>{translations.accountDetails}</span>
          </CardTitle>
          <CardDescription>{translations.comingSoon}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b pb-2">
              <span className="text-sm text-gray-500">{translations.name}</span>
              <span className="text-sm font-medium text-gray-900">{user?.name ?? '--'}</span>
            </div>
            <div className="flex items-center justify-between border-b pb-2">
              <span className="text-sm text-gray-500">{translations.email}</span>
              <span className="text-sm font-medium text-gray-900">{user?.email ?? '--'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">{translations.role}</span>
              <span className="text-sm font-medium text-gray-900">{user?.role ?? '--'}</span>
            </div>
          </div>
          <p className="text-gray-500 mt-4">{translations.placeholder}</p>
        </CardContent>
      </Card>
    </>
  );
};

export default Profile;
