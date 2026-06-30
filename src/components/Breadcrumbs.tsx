import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

const Breadcrumbs = () => {
  const location = useLocation();
  const { t } = useLanguage();
  const [translations, setTranslations] = useState({
    dashboard: 'Dashboard',
    glucose: 'Glucose Monitoring',
    insulin: 'Insulin Management',
    device: 'Device Status',
    reports: 'Reports',
    settings: 'Settings',
    profile: 'Profile',
  });

  useEffect(() => {
    const loadTranslations = async () => {
      setTranslations({
        dashboard: await t('Dashboard'),
        glucose: await t('Glucose Monitoring'),
        insulin: await t('Insulin Management'),
        device: await t('Device Status'),
        reports: await t('Reports'),
        settings: await t('Settings'),
        profile: await t('Profile'),
      });
    };
    loadTranslations();
  }, [t]);

  const labelMap: Record<string, string> = {
    dashboard: translations.dashboard,
    glucose: translations.glucose,
    insulin: translations.insulin,
    device: translations.device,
    reports: translations.reports,
    settings: translations.settings,
    profile: translations.profile,
  };

  const segments = location.pathname.split('/').filter(Boolean);
  const crumbs = segments
    .map((segment, index) => {
      const label = labelMap[segment];
      if (!label) {
        return null;
      }
      return {
        label,
        href: `/${segments.slice(0, index + 1).join('/')}`,
      };
    })
    .filter((crumb): crumb is { label: string; href: string } => Boolean(crumb));

  if (crumbs.length === 0) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex flex-wrap items-center gap-2 text-sm">
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;
          return (
            <li key={crumb.href} className="flex items-center gap-2">
              {index > 0 ? <span className="text-gray-400">›</span> : null}
              {isLast ? (
                <span className="text-medtronic-deepPurple">{crumb.label}</span>
              ) : (
                <Link to={crumb.href} className="text-gray-500 hover:text-medtronic-deepPurple">
                  {crumb.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
