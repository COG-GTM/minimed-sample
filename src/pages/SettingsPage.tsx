import { useAuth } from '@/hooks/useAuth';
import { useTranslations } from '@/hooks/useTranslations';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import LanguageDropdown from '@/components/LanguageDropdown';

const SettingsPage = () => {
  const { user } = useAuth();
  const labels = useTranslations({
    title: 'Settings',
    subtitle: 'Manage your profile and preferences',
    profile: 'Profile',
    profileDesc: 'Your account details',
    name: 'Name',
    email: 'Email',
    role: 'Role',
    patient: 'Patient',
    provider: 'Healthcare Provider',
    preferences: 'Preferences',
    preferencesDesc: 'Language and display options',
    language: 'Language',
    glucoseUnits: 'Glucose Units',
    targetRange: 'Target Range',
  });

  const profile = [
    { label: labels.name, value: user?.name ?? '' },
    { label: labels.email, value: user?.email ?? '' },
    { label: labels.role, value: user?.role === 'healthcare_provider' ? labels.provider : labels.patient },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{labels.title}</h1>
        <p className="text-gray-600">{labels.subtitle}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{labels.profile}</CardTitle>
          <CardDescription>{labels.profileDesc}</CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="divide-y">
            {profile.map(item => (
              <div key={item.label} className="flex items-center justify-between py-3">
                <dt className="text-sm text-gray-600">{item.label}</dt>
                <dd className="font-medium text-gray-900">{item.value}</dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{labels.preferences}</CardTitle>
          <CardDescription>{labels.preferencesDesc}</CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="divide-y">
            <div className="flex items-center justify-between py-3">
              <dt className="text-sm text-gray-600">{labels.language}</dt>
              <dd>
                <LanguageDropdown />
              </dd>
            </div>
            <div className="flex items-center justify-between py-3">
              <dt className="text-sm text-gray-600">{labels.glucoseUnits}</dt>
              <dd className="font-medium text-gray-900">mg/dL</dd>
            </div>
            <div className="flex items-center justify-between py-3">
              <dt className="text-sm text-gray-600">{labels.targetRange}</dt>
              <dd className="font-medium text-gray-900">70 - 180 mg/dL</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
