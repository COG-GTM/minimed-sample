import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import Landing from '@/pages/Landing';
import Auth from '@/pages/Auth';
import DashboardLayout from '@/pages/dashboard/DashboardLayout';
import Overview from '@/pages/dashboard/Overview';
import Glucose from '@/pages/dashboard/Glucose';
import Insulin from '@/pages/dashboard/Insulin';
import Device from '@/pages/dashboard/Device';
import Reports from '@/pages/dashboard/Reports';
import Settings from '@/pages/dashboard/Settings';
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
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Overview />} />
              <Route path="glucose" element={<Glucose />} />
              <Route path="insulin" element={<Insulin />} />
              <Route path="device" element={<Device />} />
              <Route path="reports" element={<Reports />} />
              <Route path="settings" element={<Settings />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </LanguageProvider>
    </Router>
  );
}

export default App;
