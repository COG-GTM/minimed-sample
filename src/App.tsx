import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import Landing from '@/pages/Landing';
import Auth from '@/pages/Auth';
import Dashboard from '@/pages/Dashboard';
import Overview from '@/pages/dashboard/Overview';
import GlucoseMonitoring from '@/pages/dashboard/GlucoseMonitoring';
import InsulinManagement from '@/pages/dashboard/InsulinManagement';
import DeviceStatus from '@/pages/dashboard/DeviceStatus';
import Reports from '@/pages/dashboard/Reports';
import Settings from '@/pages/dashboard/Settings';
import Profile from '@/pages/dashboard/Profile';
import ProtectedRoute from '@/components/ProtectedRoute';

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
              <Route index element={<Overview />} />
              <Route path="glucose" element={<GlucoseMonitoring />} />
              <Route path="insulin" element={<InsulinManagement />} />
              <Route path="device" element={<DeviceStatus />} />
              <Route path="reports" element={<Reports />} />
              <Route path="settings" element={<Settings />} />
              <Route path="profile" element={<Profile />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </LanguageProvider>
    </Router>
  );
}

export default App;
