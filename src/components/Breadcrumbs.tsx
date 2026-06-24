import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

const segmentLabels: Record<string, string> = {
  dashboard: 'Dashboard',
  glucose: 'Glucose Monitoring',
  insulin: 'Insulin Management',
  device: 'Device Status',
  reports: 'Reports',
  settings: 'Settings',
  profile: 'Profile',
};

const Breadcrumbs = () => {
  const location = useLocation();
  const { t } = useLanguage();
  const [translatedLabels, setTranslatedLabels] = useState<Record<string, string>>(segmentLabels);

  useEffect(() => {
    const loadTranslations = async () => {
      const entries = await Promise.all(
        Object.entries(segmentLabels).map(async ([key, value]) => {
          const translated = await t(value);
          return [key, translated] as [string, string];
        })
      );
      setTranslatedLabels(Object.fromEntries(entries));
    };
    loadTranslations();
  }, [t]);

  const segments = location.pathname.split('/').filter(Boolean);

  if (segments.length === 0) return null;

  const crumbs = segments.map((segment, index) => {
    const path = '/' + segments.slice(0, index + 1).join('/');
    const label = translatedLabels[segment] || segment;
    const isLast = index === segments.length - 1;
    return { path, label, isLast };
  });

  return (
    <nav className="flex items-center space-x-2 text-sm mb-4">
      {crumbs.map((crumb, index) => (
        <span key={crumb.path} className="flex items-center space-x-2">
          {index > 0 && <span className="text-gray-400">&gt;</span>}
          {crumb.isLast ? (
            <span className="text-medtronic-deepPurple font-medium">{crumb.label}</span>
          ) : (
            <Link to={crumb.path} className="text-gray-500 hover:text-medtronic-deepPurple">
              {crumb.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
};

export default Breadcrumbs;
