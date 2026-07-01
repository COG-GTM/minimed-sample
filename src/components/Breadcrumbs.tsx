import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
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

interface Crumb {
  path: string;
  source: string;
  label: string;
}

const Breadcrumbs = () => {
  const location = useLocation();
  const { t } = useLanguage();

  const segments = location.pathname.split('/').filter(Boolean);
  const baseCrumbs: Crumb[] = segments.map((segment, index) => {
    const source = segmentLabels[segment] || segment;
    return {
      path: '/' + segments.slice(0, index + 1).join('/'),
      source,
      label: source,
    };
  });

  const [crumbs, setCrumbs] = useState<Crumb[]>(baseCrumbs);

  useEffect(() => {
    const loadTranslations = async () => {
      const translated = await Promise.all(
        baseCrumbs.map(async (crumb) => ({
          ...crumb,
          label: await t(crumb.source),
        }))
      );
      setCrumbs(translated);
    };
    loadTranslations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t, location.pathname]);

  if (crumbs.length === 0) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex items-center space-x-1 text-sm text-gray-500">
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;
          return (
            <li key={crumb.path} className="flex items-center">
              {index > 0 && <ChevronRight className="h-4 w-4 mx-1 text-gray-400" />}
              {isLast ? (
                <span className="font-semibold text-medtronic-deepPurple" aria-current="page">
                  {crumb.label}
                </span>
              ) : (
                <Link to={crumb.path} className="hover:text-medtronic-deepPurple transition-colors">
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
