import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import Landing from '@/pages/Landing';
import Auth from '@/pages/Auth';
import ForgotPassword from '@/pages/ForgotPassword';
import Signup from '@/pages/Signup';
import Dashboard from '@/pages/Dashboard';
import GlucoseMonitoring from '@/pages/GlucoseMonitoring';
import InsulinManagement from '@/pages/InsulinManagement';
import Devices from '@/pages/Devices';
import Reports from '@/pages/Reports';
import DashboardSettings from '@/pages/DashboardSettings';
import Profile from '@/pages/Profile';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/DashboardLayout';

function App() {
  return (
    <Router>
      <LanguageProvider>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="glucose" element={<GlucoseMonitoring />} />
              <Route path="insulin" element={<InsulinManagement />} />
              <Route path="devices" element={<Devices />} />
              <Route path="reports" element={<Reports />} />
              <Route path="settings" element={<DashboardSettings />} />
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
