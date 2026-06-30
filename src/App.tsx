import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import Landing from '@/pages/Landing';
import Auth from '@/pages/Auth';
import Dashboard from '@/pages/Dashboard';
import ProtectedRoute from '@/components/ProtectedRoute';
import OverviewSection from '@/pages/dashboard/OverviewSection';
import GlucoseMonitoringSection from '@/pages/dashboard/GlucoseMonitoringSection';
import InsulinManagementSection from '@/pages/dashboard/InsulinManagementSection';
import DeviceStatusSection from '@/pages/dashboard/DeviceStatusSection';
import ReportsSection from '@/pages/dashboard/ReportsSection';
import SettingsSection from '@/pages/dashboard/SettingsSection';
import ProfileSection from '@/pages/dashboard/ProfileSection';
import NotFound from '@/pages/NotFound';

function App() {
  return (
    <Router>
      <LanguageProvider>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            >
              <Route index element={<OverviewSection />} />
              <Route path="glucose" element={<GlucoseMonitoringSection />} />
              <Route path="insulin" element={<InsulinManagementSection />} />
              <Route path="device" element={<DeviceStatusSection />} />
              <Route path="reports" element={<ReportsSection />} />
              <Route path="settings" element={<SettingsSection />} />
              <Route path="profile" element={<ProfileSection />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </LanguageProvider>
    </Router>
  );
}

export default App;
