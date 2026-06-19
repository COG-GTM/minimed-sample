import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
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
  Droplet,
  Home,
  LogOut,
  Menu,
  Settings,
  User,
  Wifi,
  FileText,
  ChevronDown,
  Mail,
  Shield,
  Calendar,
  Smartphone,
  Battery,
  ArrowLeft,
} from 'lucide-react';
import { generateDeviceStatus } from '@/utils/mockData';

const Profile = () => {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const deviceStatus = generateDeviceStatus();

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

  useState(() => {
    const loadTranslations = async () => {
      const newTranslations = {
        overview: await t('Overview'),
        glucoseMonitoring: await t('Glucose Monitoring'),
        insulinManagement: await t('Insulin Management'),
        deviceStatus: await t('Device Status'),
        reports: await t('Reports'),
        settings: await t('Settings'),
        myAccount: await t('My Account'),
        profile: await t('Profile'),
        signOut: await t('Sign out'),
      };
      setTranslations(newTranslations);
    };
    loadTranslations();
  });

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const sidebarItems = [
    { icon: Home, label: translations.overview, path: '/dashboard' },
    { icon: Activity, label: translations.glucoseMonitoring },
    { icon: Droplet, label: translations.insulinManagement },
    { icon: Wifi, label: translations.deviceStatus },
    { icon: FileText, label: translations.reports },
    { icon: Settings, label: translations.settings, path: '/settings' },
  ];

  const getRoleBadge = (role: string) => {
    if (role === 'patient') {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
          <Activity className="h-3 w-3 mr-1" />
          Patient
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
        <Shield className="h-3 w-3 mr-1" />
        Healthcare Provider
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
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
              <span className="text-2xl font-bold text-white">MiniMed<span className="text-xs align-super">&trade;</span> Dashboard</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <LanguageDropdown />

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
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  <User className="mr-2 h-4 w-4" />
                  {translations.profile}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/settings')}>
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
                  onClick={() => item.path && navigate(item.path)}
                  className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-gray-600 hover:bg-gray-100"
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
        <main className="flex-1 p-4 lg:p-6">
          {/* Header */}
          <div className="mb-6 flex items-center space-x-3">
            <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
              <p className="text-gray-600">View your account information and connected devices</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Card */}
            <Card className="lg:col-span-1">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-medtronic-brightBlue to-medtronic-skyBlue rounded-full flex items-center justify-center mb-4 shadow-lg">
                    <span className="text-white font-bold text-3xl">
                      {user?.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">{user?.name}</h2>
                  <p className="text-gray-500 mt-1">{user?.email}</p>
                  <div className="mt-3">
                    {getRoleBadge(user?.role || 'patient')}
                  </div>
                  <div className="mt-6 w-full space-y-3">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => navigate('/settings')}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Edit Settings
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Account Details */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg">Account Details</CardTitle>
                <CardDescription>Your personal and account information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 py-3 border-b">
                    <User className="h-5 w-5 text-gray-400" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">Full Name</p>
                      <p className="font-medium text-gray-900">{user?.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 py-3 border-b">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">Email Address</p>
                      <p className="font-medium text-gray-900">{user?.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 py-3 border-b">
                    <Shield className="h-5 w-5 text-gray-400" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">Account Type</p>
                      <p className="font-medium text-gray-900">
                        {user?.role === 'healthcare_provider' ? 'Healthcare Provider' : 'Patient'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 py-3 border-b">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">Member Since</p>
                      <p className="font-medium text-gray-900">January 2024</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 py-3">
                    <Shield className="h-5 w-5 text-gray-400" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">Account ID</p>
                      <p className="font-medium text-gray-900 font-mono">{user?.id}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Connected Device */}
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Smartphone className="h-5 w-5 text-medtronic-brightBlue" />
                  <span>Connected Device</span>
                </CardTitle>
                <CardDescription>Your insulin pump and sensor information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Smartphone className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-500">Device</span>
                    </div>
                    <p className="font-medium text-gray-900">{deviceStatus.name}</p>
                    <p className="text-sm text-gray-500">Model: {deviceStatus.model}</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Battery className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-500">Battery</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Progress value={deviceStatus.batteryLevel} className="flex-1 h-2" />
                      <span className="text-sm font-medium">{deviceStatus.batteryLevel.toFixed(0)}%</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Droplet className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-500">Reservoir</span>
                    </div>
                    <p className="font-medium text-gray-900">{deviceStatus.reservoirLevel.toFixed(0)} units</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Wifi className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-500">Connection</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`w-2 h-2 rounded-full ${deviceStatus.connected ? 'bg-green-500' : 'bg-red-500'}`} />
                      <p className="font-medium text-gray-900">{deviceStatus.connected ? 'Connected' : 'Disconnected'}</p>
                    </div>
                    <p className="text-sm text-gray-500">Firmware: v{deviceStatus.firmwareVersion}</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-gray-500">
                    Serial Number: <span className="font-mono">{deviceStatus.serialNumber}</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;
