import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import LanguageDropdown from '@/components/LanguageDropdown';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Activity,
  Bell,
  ChevronDown,
  Droplet,
  FileText,
  Home,
  LogOut,
  Menu,
  Settings,
  User,
  Wifi,
} from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [translations, setTranslations] = useState({
    overview: 'Overview',
    glucoseMonitoring: 'Glucose Monitoring',
    insulinManagement: 'Insulin Management',
    deviceStatus: 'Device Status',
    reports: 'Reports',
    settings: 'Settings',
    myAccount: 'My Account',
    profile: 'Profile',
    signOut: 'Sign out',
  });

  useEffect(() => {
    const loadTranslations = async () => {
      setTranslations({
        overview: await t('Overview'),
        glucoseMonitoring: await t('Glucose Monitoring'),
        insulinManagement: await t('Insulin Management'),
        deviceStatus: await t('Device Status'),
        reports: await t('Reports'),
        settings: await t('Settings'),
        myAccount: await t('My Account'),
        profile: await t('Profile'),
        signOut: await t('Sign out'),
      });
    };
    loadTranslations();
  }, [t]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const sidebarItems = [
    { icon: Home, label: translations.overview, path: '/dashboard' },
    { icon: Activity, label: translations.glucoseMonitoring, path: '/dashboard/glucose' },
    { icon: Droplet, label: translations.insulinManagement, path: '/dashboard/insulin' },
    { icon: Wifi, label: translations.deviceStatus, path: '/dashboard/device' },
    { icon: FileText, label: translations.reports, path: '/dashboard/reports' },
    { icon: Settings, label: translations.settings, path: '/dashboard/settings' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-40 bg-gradient-medtronic shadow-md">
        <div className="flex items-center justify-between px-4 h-20">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-white/20 rounded-lg text-white"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center space-x-2">
              <Link to="/" className="text-2xl font-bold text-white">
                MiniMed<span className="text-xs align-super">™</span> Dashboard
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <LanguageDropdown />

            <button className="relative p-2 hover:bg-white/20 rounded-lg">
              <Bell className="h-5 w-5 text-white" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-medtronic-coral rounded-full"></span>
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2 text-white hover:bg-white/20">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-medtronic-deepPurple" />
                  </div>
                  <span className="hidden md:inline">{user?.name}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>{translations.myAccount}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/dashboard/profile')}>
                  <User className="mr-2 h-4 w-4" />
                  {translations.profile}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/dashboard/settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  {translations.settings}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  {translations.signOut}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white border-r transition-transform duration-300 mt-20 lg:mt-0`}>
          <div className="p-4">
            <nav className="space-y-1">
              {sidebarItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    location.pathname === item.path
                      ? 'bg-gradient-to-r from-medtronic-lightCyan to-medtronic-skyBlue text-medtronic-deepPurple font-semibold'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {sidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-20"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <main className="flex-1 p-4 lg:p-6">
          <Breadcrumbs />
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
