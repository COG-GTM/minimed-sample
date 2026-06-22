import { Link, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const pathLabels: Record<string, string> = {
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
  const segments = location.pathname.split('/').filter(Boolean);

  if (segments.length <= 1) return null;

  return (
    <nav className="flex items-center space-x-1 text-sm mb-4" aria-label="Breadcrumb">
      {segments.map((segment, index) => {
        const path = '/' + segments.slice(0, index + 1).join('/');
        const label = pathLabels[segment] || segment;
        const isLast = index === segments.length - 1;

        return (
          <span key={path} className="flex items-center">
            {index > 0 && <ChevronRight className="h-4 w-4 text-gray-400 mx-1" />}
            {isLast ? (
              <span className="text-medtronic-deepPurple font-medium">{label}</span>
            ) : (
              <Link to={path} className="text-gray-500 hover:text-medtronic-deepPurple transition-colors">
                {label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;
