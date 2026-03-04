import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  Home,
  LogOut,
  Menu,
  Settings as SettingsIcon,
  User,
  Wifi,
  FileText,
  Save,
  Check,
  ArrowLeft,
} from 'lucide-react';

const Settings = () => {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [saved, setSaved] = useState(false);

  // Glucose target settings
  const [glucoseSettings, setGlucoseSettings] = useState({
    lowTarget: 70,
    highTarget: 180,
    urgentLow: 54,
    urgentHigh: 250,
  });

  // Notification preferences
  const [notificationPrefs, setNotificationPrefs] = useState({
    highGlucose: true,
    lowGlucose: true,
    urgentAlerts: true,
    insulinDelivery: true,
    sensorExpiry: true,
    pumpStatus: true,
    dailySummary: true,
    weeklyReport: false,
  });

  // Display preferences
  const [displayPrefs, setDisplayPrefs] = useState({
    glucoseUnit: 'mgdl' as 'mgdl' | 'mmol',
    timeFormat: '24h' as '12h' | '24h',
    chartDuration: '24' as '6' | '12' | '24' | '48',
  });

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

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const toggleNotification = (key: keyof typeof notificationPrefs) => {
    setNotificationPrefs(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const sidebarItems = [
    { icon: Home, label: translations.overview, path: '/dashboard' },
    { icon: Activity, label: translations.glucoseMonitoring },
    { icon: Droplet, label: translations.insulinManagement },
    { icon: Wifi, label: translations.deviceStatus },
    { icon: FileText, label: translations.reports },
    { icon: SettingsIcon, label: translations.settings, active: true },
  ];

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
                  <SettingsIcon className="mr-2 h-4 w-4" />
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
        <main className="flex-1 p-4 lg:p-6">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-gray-100 rounded-lg">
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                <p className="text-gray-600">Manage your glucose targets, notifications, and display preferences</p>
              </div>
            </div>
          </div>

          {/* Success Toast */}
          {saved && (
            <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-3 flex items-center space-x-2 animate-fade-in">
              <Check className="h-5 w-5 text-green-600" />
              <span className="text-green-800 font-medium">Settings saved successfully!</span>
            </div>
          )}

          <div className="space-y-6">
            {/* Glucose Target Range */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-medtronic-brightBlue" />
                  <span>Glucose Target Range</span>
                </CardTitle>
                <CardDescription>
                  Set your target glucose range for monitoring and alerts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="lowTarget">Low Target (mg/dL)</Label>
                    <Input
                      id="lowTarget"
                      type="number"
                      value={glucoseSettings.lowTarget}
                      onChange={(e) => setGlucoseSettings(prev => ({ ...prev, lowTarget: Number(e.target.value) }))}
                      min={50}
                      max={100}
                    />
                    <p className="text-xs text-gray-500">Recommended: 70 mg/dL</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="highTarget">High Target (mg/dL)</Label>
                    <Input
                      id="highTarget"
                      type="number"
                      value={glucoseSettings.highTarget}
                      onChange={(e) => setGlucoseSettings(prev => ({ ...prev, highTarget: Number(e.target.value) }))}
                      min={120}
                      max={250}
                    />
                    <p className="text-xs text-gray-500">Recommended: 180 mg/dL</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="urgentLow">Urgent Low Alert (mg/dL)</Label>
                    <Input
                      id="urgentLow"
                      type="number"
                      value={glucoseSettings.urgentLow}
                      onChange={(e) => setGlucoseSettings(prev => ({ ...prev, urgentLow: Number(e.target.value) }))}
                      min={40}
                      max={70}
                    />
                    <p className="text-xs text-gray-500">Recommended: 54 mg/dL</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="urgentHigh">Urgent High Alert (mg/dL)</Label>
                    <Input
                      id="urgentHigh"
                      type="number"
                      value={glucoseSettings.urgentHigh}
                      onChange={(e) => setGlucoseSettings(prev => ({ ...prev, urgentHigh: Number(e.target.value) }))}
                      min={200}
                      max={400}
                    />
                    <p className="text-xs text-gray-500">Recommended: 250 mg/dL</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notification Preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Bell className="h-5 w-5 text-medtronic-brightBlue" />
                  <span>Notification Preferences</span>
                </CardTitle>
                <CardDescription>
                  Choose which notifications you want to receive
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { key: 'highGlucose' as const, label: 'High Glucose Alerts', desc: 'Get notified when glucose exceeds target range' },
                    { key: 'lowGlucose' as const, label: 'Low Glucose Alerts', desc: 'Get notified when glucose drops below target range' },
                    { key: 'urgentAlerts' as const, label: 'Urgent Alerts', desc: 'Critical alerts for urgent low/high glucose levels' },
                    { key: 'insulinDelivery' as const, label: 'Insulin Delivery Updates', desc: 'Notifications for bolus and basal deliveries' },
                    { key: 'sensorExpiry' as const, label: 'Sensor Expiry Reminders', desc: 'Reminders when your CGM sensor is expiring' },
                    { key: 'pumpStatus' as const, label: 'Pump Status Updates', desc: 'Battery, reservoir, and connection status' },
                    { key: 'dailySummary' as const, label: 'Daily Summary', desc: 'Receive a daily summary of your glucose data' },
                    { key: 'weeklyReport' as const, label: 'Weekly Report', desc: 'Receive a weekly analysis report' },
                  ].map(item => (
                    <div key={item.key} className="flex items-center justify-between py-2">
                      <div>
                        <p className="font-medium text-gray-900">{item.label}</p>
                        <p className="text-sm text-gray-500">{item.desc}</p>
                      </div>
                      <button
                        onClick={() => toggleNotification(item.key)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          notificationPrefs[item.key] ? 'bg-medtronic-brightBlue' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            notificationPrefs[item.key] ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Display Preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <SettingsIcon className="h-5 w-5 text-medtronic-brightBlue" />
                  <span>Display Preferences</span>
                </CardTitle>
                <CardDescription>
                  Customize how data is displayed in your dashboard
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label>Glucose Unit</Label>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => setDisplayPrefs(prev => ({ ...prev, glucoseUnit: 'mgdl' }))}
                        className={`px-4 py-2 rounded-lg border-2 font-medium transition-colors ${
                          displayPrefs.glucoseUnit === 'mgdl'
                            ? 'border-medtronic-brightBlue bg-blue-50 text-medtronic-brightBlue'
                            : 'border-gray-200 text-gray-600 hover:border-gray-300'
                        }`}
                      >
                        mg/dL
                      </button>
                      <button
                        onClick={() => setDisplayPrefs(prev => ({ ...prev, glucoseUnit: 'mmol' }))}
                        className={`px-4 py-2 rounded-lg border-2 font-medium transition-colors ${
                          displayPrefs.glucoseUnit === 'mmol'
                            ? 'border-medtronic-brightBlue bg-blue-50 text-medtronic-brightBlue'
                            : 'border-gray-200 text-gray-600 hover:border-gray-300'
                        }`}
                      >
                        mmol/L
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Time Format</Label>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => setDisplayPrefs(prev => ({ ...prev, timeFormat: '12h' }))}
                        className={`px-4 py-2 rounded-lg border-2 font-medium transition-colors ${
                          displayPrefs.timeFormat === '12h'
                            ? 'border-medtronic-brightBlue bg-blue-50 text-medtronic-brightBlue'
                            : 'border-gray-200 text-gray-600 hover:border-gray-300'
                        }`}
                      >
                        12-hour
                      </button>
                      <button
                        onClick={() => setDisplayPrefs(prev => ({ ...prev, timeFormat: '24h' }))}
                        className={`px-4 py-2 rounded-lg border-2 font-medium transition-colors ${
                          displayPrefs.timeFormat === '24h'
                            ? 'border-medtronic-brightBlue bg-blue-50 text-medtronic-brightBlue'
                            : 'border-gray-200 text-gray-600 hover:border-gray-300'
                        }`}
                      >
                        24-hour
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Chart Duration</Label>
                    <div className="flex space-x-3">
                      {(['6', '12', '24', '48'] as const).map(duration => (
                        <button
                          key={duration}
                          onClick={() => setDisplayPrefs(prev => ({ ...prev, chartDuration: duration }))}
                          className={`px-4 py-2 rounded-lg border-2 font-medium transition-colors ${
                            displayPrefs.chartDuration === duration
                              ? 'border-medtronic-brightBlue bg-blue-50 text-medtronic-brightBlue'
                              : 'border-gray-200 text-gray-600 hover:border-gray-300'
                          }`}
                        >
                          {duration}h
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button onClick={handleSave} className="px-8">
                <Save className="h-4 w-4 mr-2" />
                Save Settings
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;
