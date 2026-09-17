import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import AppHeader from '@/components/AppHeader';
import { appNavItems } from '@/config/navigation';
import { useTranslations } from '@/hooks/useTranslations';

const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const labels = useTranslations(Object.fromEntries(appNavItems.map(item => [item.path, item.label])));

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen(open => !open)} />

      <div className="flex">
        <aside
          className={`${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white border-r transition-transform duration-300 mt-20 lg:mt-0`}
        >
          <div className="p-4">
            <nav className="space-y-1" aria-label="Sections">
              {appNavItems.map(item => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-gradient-to-r from-medtronic-lightCyan to-medtronic-skyBlue text-medtronic-deepPurple font-semibold'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`
                  }
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{labels[item.path]}</span>
                </NavLink>
              ))}
            </nav>
          </div>
        </aside>

        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 bg-black/50 z-20" onClick={() => setSidebarOpen(false)} />
        )}

        <main className="flex-1 p-4 lg:p-6 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
