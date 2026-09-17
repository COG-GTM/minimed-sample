import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useTranslations } from '@/hooks/useTranslations';
import { appNavItems } from '@/config/navigation';
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
import { Bell, ChevronDown, LogOut, Menu, Settings, User, X } from 'lucide-react';

interface AppHeaderProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

const AppHeader = ({ sidebarOpen, onToggleSidebar }: AppHeaderProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const labels = useTranslations({
    myAccount: 'My Account',
    profile: 'Profile',
    settings: 'Settings',
    signOut: 'Sign out',
    notifications: 'Notifications',
  });
  const navLabels = useTranslations(Object.fromEntries(appNavItems.map(item => [item.path, item.label])));

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 bg-gradient-medtronic shadow-md">
      <div className="flex items-center justify-between px-4 h-20">
        <div className="flex items-center space-x-4">
          <button
            onClick={onToggleSidebar}
            aria-label="Toggle navigation"
            className="lg:hidden p-2 hover:bg-white/20 rounded-lg text-white"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <Link to="/dashboard" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-white">
              MiniMed<span className="text-xs align-super">™</span> Dashboard
            </span>
          </Link>
        </div>

        <nav className="hidden xl:flex items-center space-x-1" aria-label="Primary">
          {appNavItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'bg-white/20 text-white' : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              {navLabels[item.path]}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center space-x-2 md:space-x-4">
          <LanguageDropdown className="text-white hover:bg-white/20 hover:text-white" />

          <button
            aria-label={labels.notifications}
            className="relative p-2 hover:bg-white/20 rounded-lg"
          >
            <Bell className="h-5 w-5 text-white" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-medtronic-coral rounded-full"></span>
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2 text-white hover:bg-white/20 hover:text-white">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-medtronic-deepPurple" />
                </div>
                <span className="sr-only md:not-sr-only">{user?.name}</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="font-medium">{labels.myAccount}</div>
                <div className="text-xs font-normal text-gray-500 truncate">{user?.email}</div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/dashboard/settings')}>
                <User className="mr-2 h-4 w-4" />
                {labels.profile}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/dashboard/settings')}>
                <Settings className="mr-2 h-4 w-4" />
                {labels.settings}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                {labels.signOut}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
