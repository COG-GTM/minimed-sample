import { useEffect, useRef, useState } from 'react';
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
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  Navigation,
  Settings,
  User,
} from 'lucide-react';

export interface DashboardNavItem {
  id: string;
  label: string;
}

interface DashboardHeaderProps {
  userName?: string;
  navItems: DashboardNavItem[];
  myAccountLabel: string;
  dashboardSectionsLabel: string;
  profileLabel: string;
  settingsLabel: string;
  signOutLabel: string;
  sidebarOpen: boolean;
  onSidebarToggle: () => void;
  onLogout: () => void;
}

const DashboardHeader = ({
  userName,
  navItems,
  myAccountLabel,
  dashboardSectionsLabel,
  profileLabel,
  settingsLabel,
  signOutLabel,
  sidebarOpen,
  onSidebarToggle,
  onLogout,
}: DashboardHeaderProps) => {
  const [activeSection, setActiveSection] = useState(navItems[0]?.id ?? '');
  const hasClickedOverride = useRef(false);

  useEffect(() => {
    const sections = navItems
      .map(({ id }) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null);

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (hasClickedOverride.current) return;

        const visibleSections = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visibleSections[0]) {
          setActiveSection(visibleSections[0].target.id);
        }
      },
      { rootMargin: '-80px 0px -55% 0px', threshold: [0, 0.25, 0.5, 1] }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [navItems]);

  useEffect(() => {
    const clearClickedOverride = () => {
      hasClickedOverride.current = false;
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', ' ', 'Home', 'End'].includes(event.key)) {
        clearClickedOverride();
      }
    };

    window.addEventListener('wheel', clearClickedOverride, { passive: true });
    window.addEventListener('touchmove', clearClickedOverride, { passive: true });
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('wheel', clearClickedOverride);
      window.removeEventListener('touchmove', clearClickedOverride);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    hasClickedOverride.current = true;
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <header className="sticky top-0 z-40 bg-gradient-medtronic shadow-md">
      <div className="flex items-center justify-between px-4 h-20">
        <div className="flex items-center space-x-4">
          <button
            onClick={onSidebarToggle}
            aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
            className="lg:hidden p-2 hover:bg-white/20 rounded-lg text-white"
          >
            <Menu className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-2xl font-bold text-white whitespace-nowrap"
          >
            MiniMed<span className="text-xs align-super">™</span> Dashboard
          </button>
        </div>

        <nav className="hidden lg:flex items-center space-x-1" aria-label="Dashboard sections">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => scrollToSection(item.id)}
              className={`px-3 py-2 rounded-lg text-sm font-medium text-white transition-colors ${
                activeSection === item.id ? 'bg-white/20' : 'hover:bg-white/10'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center space-x-2 sm:space-x-4">
          <div className="lg:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20"
                  aria-label="Dashboard navigation"
                >
                  <Navigation className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>{dashboardSectionsLabel}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {navItems.map((item) => (
                  <DropdownMenuItem
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={activeSection === item.id ? 'bg-accent' : ''}
                  >
                    {item.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <LanguageDropdown />

          <button className="relative p-2 hover:bg-white/20 rounded-lg" aria-label="Notifications">
            <Bell className="h-5 w-5 text-white" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-medtronic-coral rounded-full"></span>
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2 text-white hover:bg-white/20">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-medtronic-deepPurple" />
                </div>
                <span className="hidden md:inline">{userName}</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>{myAccountLabel}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                {profileLabel}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                {settingsLabel}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                {signOutLabel}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
