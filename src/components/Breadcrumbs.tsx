import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

const breadcrumbLabels: Record<string, string> = {
  dashboard: 'Dashboard',
  overview: 'Overview',
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
  const [labels, setLabels] = useState(breadcrumbLabels);

  useEffect(() => {
    let active = true;

    const loadTranslations = async () => {
      const entries = await Promise.all(
        Object.entries(breadcrumbLabels).map(async ([key, value]) => [key, await t(value)] as const)
      );

      if (active) {
        setLabels(Object.fromEntries(entries));
      }
    };

    loadTranslations();

    return () => {
      active = false;
    };
  }, [t]);

  const breadcrumbs = useMemo(() => {
    const segments = location.pathname.split('/').filter(Boolean);
    const normalizedSegments = segments.length === 1 && segments[0] === 'dashboard'
      ? [...segments, 'overview']
      : segments;

    if (normalizedSegments.length === 0) {
      return [];
    }

    return normalizedSegments.reduce<Array<{ key: string; label: string; to: string }>>((acc, segment, index) => {
      const to = segment === 'overview' && normalizedSegments.length === 2
        ? '/dashboard'
        : `/${normalizedSegments.slice(0, index + 1).join('/')}`;
      acc.push({
        key: to,
        label: labels[segment] ?? segment.replace(/-/g, ' '),
        to,
      });
      return acc;
    }, []);
  }, [labels, location.pathname]);

  if (breadcrumbs.length === 0) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-sm">
      {breadcrumbs.map((crumb, index) => {
        const isActive = index === breadcrumbs.length - 1;

        return (
          <div key={crumb.key} className="flex items-center space-x-2">
            {index > 0 && <span className="text-gray-400">/</span>}
            <Link
              to={crumb.to}
              className={isActive ? 'text-medtronic-deepPurple font-semibold' : 'text-gray-500'}
            >
              {crumb.label}
            </Link>
          </div>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;
