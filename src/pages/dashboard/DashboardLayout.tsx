import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import LanguageDropdown from '@/components/LanguageDropdown';
import Sidebar from '@/components/Sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Bell, ChevronDown, LogOut, Menu, Settings, User } from 'lucide-react';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [translations, setTranslations] = useState({
    myAccount: 'My Account',
    profile: 'Profile',
    settings: 'Settings',
    signOut: 'Sign out'
  });

  useEffect(() => {
    const loadTranslations = async () => {
      setTranslations({
        myAccount: await t('My Account'),
        profile: await t('Profile'),
        settings: await t('Settings'),
        signOut: await t('Sign out')
      });
    };
    loadTranslations();
  }, [t]);

  const handleLogout = () => {
    logout();
    navigate('/');
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
              <span className="text-2xl font-bold text-white">MiniMed<span className="text-xs align-super">™</span> Dashboard</span>
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
                <DropdownMenuItem>
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
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
