import { describe, it, expect, vi } from 'vitest';
import { render, screen, renderHook, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { useAuth } from '@/hooks/useAuth';
import { LanguageProvider, useLanguage } from '@/contexts/LanguageContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import LanguageDropdown from '@/components/LanguageDropdown';
import Dashboard from '@/pages/Dashboard';
import { DashboardMetrics } from '@/features/dashboard/DashboardMetrics';
import { useDashboardTranslations } from '@/features/dashboard/useDashboardTranslations';
import { translationService } from '@/services/translationService';

describe('demo authentication', () => {
  it.each([
    ['patient@example.com', 'patient'],
    ['doctor@example.com', 'healthcare_provider'],
  ])('logs in and out as %s', async (email, role) => {
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });
    await act(async () => {
      await result.current.login({ email, password: 'demo123', rememberMe: true });
    });
    expect(result.current.user?.role).toBe(role);
    expect(localStorage.getItem('minimedUser')).toContain(email);
    act(() => result.current.logout());
    expect(result.current.isAuthenticated).toBe(false);
    expect(localStorage.getItem('minimedUser')).toBeNull();
  });

  it('rejects invalid credentials without creating a session', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });
    await act(async () => {
      await expect(result.current.login({ email: '', password: '', rememberMe: false }))
        .rejects.toThrow('Invalid email or password');
    });
    expect(result.current.user).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it('redirects an anonymous visitor to auth', async () => {
    render(<MemoryRouter initialEntries={['/dashboard']}><AuthProvider><Routes>
      <Route path="/dashboard" element={<ProtectedRoute>Private content</ProtectedRoute>} />
      <Route path="/auth" element={<h1>Sign in required</h1>} />
    </Routes></AuthProvider></MemoryRouter>);
    expect(await screen.findByText('Sign in required')).toBeInTheDocument();
    expect(screen.queryByText('Private content')).not.toBeInTheDocument();
  });
});

describe('languages', () => {
  it('switches the language through the dropdown', async () => {
    function Label() {
      const { tSync } = useLanguage();
      return <p>{tSync('nav.signin')}</p>;
    }
    render(<LanguageProvider><LanguageDropdown /><Label /></LanguageProvider>);
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /English/ }));
    await user.click(screen.getByRole('menuitem', { name: /Español/ }));
    expect(screen.getByText('Iniciar Sesión')).toBeInTheDocument();
  });

  it('translates, caches and preserves unsupported or empty text', async () => {
    translationService.clearCache();
    expect(await translationService.translate('Time in Range', 'es')).toBe('Tiempo en Rango');
    expect(localStorage.getItem('translation-cache')).toContain('Tiempo en Rango');
    expect(await translationService.translate('Time in Range', 'es')).toBe('Tiempo en Rango');
    expect(await translationService.translate('', 'es')).toBe('');
    expect(await translationService.translate('unknown', 'xx')).toBe('unknown');
    expect(await translationService.translate('original', 'en')).toBe('original');
    translationService.clearCache();
    expect(localStorage.getItem('translation-cache')).toBeNull();
  });

  it('returns the translation when storage is unavailable', async () => {
    translationService.clearCache();
    const storage = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('storage denied'); });
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => {});
    try {
      expect(await translationService.translate('Pump Status', 'de')).toBe('Pumpenstatus');
      expect(warning).toHaveBeenCalled();
    } finally {
      storage.mockRestore();
      warning.mockRestore();
    }
  });
});

it('renders the dashboard metrics and activity', async () => {
  render(<MemoryRouter><LanguageProvider><AuthProvider><Dashboard /></AuthProvider></LanguageProvider></MemoryRouter>);
  await waitFor(() => expect(screen.getAllByText('Time in Range')).toHaveLength(2));
  expect(screen.getByText('Current Glucose')).toBeInTheDocument();
  expect(screen.getByText('Total Insulin Today')).toBeInTheDocument();
  expect(screen.getByText('Pump Status')).toBeInTheDocument();
  expect(screen.getByText('24-Hour Glucose Trend')).toBeInTheDocument();
  expect(screen.getByText('Recent Activity')).toBeInTheDocument();
});

it('renders placeholders before dashboard data is available', () => {
  function EmptyMetrics() {
    const translations = useDashboardTranslations();
    return <DashboardMetrics dailySummary={null} deviceStatus={null} translations={translations} />;
  }
  render(<LanguageProvider><EmptyMetrics /></LanguageProvider>);
  expect(screen.getAllByText('--')).toHaveLength(2);
  expect(screen.getByText('--%')).toBeInTheDocument();
});
