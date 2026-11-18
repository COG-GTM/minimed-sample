import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
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
import { Activity, Bell, ChevronDown, Droplet, Home, LogOut, Menu, Settings, User, Wifi, FileText } from 'lucide-react';
import { generateGlucoseReadings, generateDeviceStatus, generateDailySummary, generateInsulinDeliveries } from '@/utils/mockData';
import type { GlucoseReading } from '@/types/glucose';
import type { DeviceStatus } from '@/types/device';
import { DashboardMetrics } from '@/features/dashboard/DashboardMetrics';
import { DashboardCharts } from '@/features/dashboard/DashboardCharts';
import { RecentActivity } from '@/features/dashboard/RecentActivity';
import { useDashboardTranslations } from '@/features/dashboard/useDashboardTranslations';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { tSync } = useLanguage();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [glucoseReadings, setGlucoseReadings] = useState<GlucoseReading[]>([]);
  const [deviceStatus, setDeviceStatus] = useState<DeviceStatus | null>(null);
  const [dailySummary, setDailySummary] = useState<ReturnType<typeof generateDailySummary> | null>(null);
  const [deliveries, setDeliveries] = useState(() => generateInsulinDeliveries(1).slice(0, 5));
  const translations = useDashboardTranslations();

  useEffect(() => {
    // Initialize mock data
    setGlucoseReadings(generateGlucoseReadings(24));
    setDeviceStatus(generateDeviceStatus());
    setDailySummary(generateDailySummary());

    // Simulate real-time updates
    const interval = setInterval(() => {
      setGlucoseReadings(generateGlucoseReadings(24));
      setDeviceStatus(generateDeviceStatus());
      setDailySummary(generateDailySummary());
      setDeliveries(generateInsulinDeliveries(1).slice(0, 5));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const sidebarItems = [
    { icon: Home, label: translations.overview, active: true },
    { icon: Activity, label: translations.glucoseMonitoring },
    { icon: Droplet, label: translations.insulinManagement },
    { icon: Wifi, label: translations.deviceStatus },
    { icon: FileText, label: translations.reports },
    { icon: Settings, label: translations.settings }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 bg-gradient-medtronic shadow-md">
        <div className="flex items-center justify-between gap-1 px-2 sm:px-4 h-20">
          <div className="flex min-w-0 items-center gap-1 sm:gap-4">
            <button
              aria-label={tSync('Toggle menu')}
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-white/20 rounded-lg text-white"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center space-x-2">
              <span className="text-lg sm:text-2xl font-bold text-white">MiniMed<span className="text-xs align-super">™</span><span className="hidden sm:inline"> {tSync('Dashboard')}</span></span>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-0 sm:gap-4">
            <LanguageDropdown className="px-1 sm:px-3 text-white hover:bg-white/20 hover:text-white" />
            
            <button aria-label={tSync('Notifications')} className="relative hidden sm:block p-2 hover:bg-white/20 rounded-lg">
              <Bell className="h-5 w-5 text-white" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-medtronic-coral rounded-full"></span>
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" aria-label={user?.name} className="flex items-center gap-1 px-1 sm:px-4 text-white hover:bg-white/20">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-medtronic-deepPurple" />
                  </div>
                  <span className="hidden md:inline">{user?.name}</span>
                  <ChevronDown className="hidden sm:block h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>{translations.myAccount}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  {translations.profile}
                </DropdownMenuItem>
                <DropdownMenuItem>
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
        {/* Sidebar */}
        <aside className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white border-r transition-transform duration-300 mt-20 lg:mt-0`}>
          <div className="p-4">
            <nav className="space-y-1">
              {sidebarItems.map((item, index) => (
                <button
                  key={index}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    item.active 
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

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div 
            className="lg:hidden fixed inset-0 bg-black/50 z-20"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="min-w-0 flex-1 p-4 lg:p-6">
          {/* Welcome Message */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              {translations.welcomeBack}, {user?.name}
            </h1>
            <p className="text-gray-600">
              {translations.diabetesOverview}
            </p>
          </div>

          <DashboardMetrics dailySummary={dailySummary} deviceStatus={deviceStatus} translations={translations} />

          <DashboardCharts glucoseReadings={glucoseReadings} dailySummary={dailySummary} translations={translations} />

          <RecentActivity translations={translations} deliveries={deliveries} />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
