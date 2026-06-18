import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Activity,
  Droplet,
  FileText,
  Home,
  Settings,
  Wifi,
  LucideIcon
} from 'lucide-react';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

interface SidebarItem {
  icon: LucideIcon;
  label: string;
  path: string;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const [labels, setLabels] = useState({
    overview: 'Overview',
    glucoseMonitoring: 'Glucose Monitoring',
    insulinManagement: 'Insulin Management',
    deviceStatus: 'Device Status',
    reports: 'Reports',
    settings: 'Settings'
  });

  useEffect(() => {
    const loadTranslations = async () => {
      setLabels({
        overview: await t('Overview'),
        glucoseMonitoring: await t('Glucose Monitoring'),
        insulinManagement: await t('Insulin Management'),
        deviceStatus: await t('Device Status'),
        reports: await t('Reports'),
        settings: await t('Settings')
      });
    };
    loadTranslations();
  }, [t]);

  const sidebarItems: SidebarItem[] = [
    { icon: Home, label: labels.overview, path: '/dashboard' },
    { icon: Activity, label: labels.glucoseMonitoring, path: '/dashboard/glucose' },
    { icon: Droplet, label: labels.insulinManagement, path: '/dashboard/insulin' },
    { icon: Wifi, label: labels.deviceStatus, path: '/dashboard/device' },
    { icon: FileText, label: labels.reports, path: '/dashboard/reports' },
    { icon: Settings, label: labels.settings, path: '/dashboard/settings' }
  ];

  const handleNavigate = (path: string) => {
    navigate(path);
    setSidebarOpen(false);
  };

  return (
    <>
      <aside className={`${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white border-r transition-transform duration-300 mt-20 lg:mt-0`}>
        <div className="p-4">
          <nav className="space-y-1">
            {sidebarItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => handleNavigate(item.path)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-gradient-to-r from-medtronic-lightCyan to-medtronic-skyBlue text-medtronic-deepPurple font-semibold'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-20"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
