import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

const labels: Record<string, string> = {
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
  const segments = location.pathname.split('/').filter(Boolean);
  const [translatedLabels, setTranslatedLabels] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadLabels = async () => {
      const currentSegments = location.pathname.split('/').filter(Boolean);
      const entries = await Promise.all(
        currentSegments.map(async (segment) => [segment, await t(labels[segment] || segment)] as const),
      );
      setTranslatedLabels(Object.fromEntries(entries));
    };
    loadLabels();
  }, [location.pathname, t]);

  return (
    <nav className="mb-6 text-sm text-gray-500" aria-label="Breadcrumb">
      {segments.map((segment, index) => {
        const path = `/${segments.slice(0, index + 1).join('/')}`;
        const active = index === segments.length - 1;
        return (
          <span key={path}>
            {index > 0 && <span className="mx-2 text-gray-400">&gt;</span>}
            {active ? (
              <span className="font-medium text-medtronic-deepPurple">
                {translatedLabels[segment] || labels[segment] || segment}
              </span>
            ) : (
              <Link to={path} className="text-gray-500 hover:text-medtronic-deepPurple">
                {translatedLabels[segment] || labels[segment] || segment}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;
