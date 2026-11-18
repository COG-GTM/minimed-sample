import { act, render, screen } from '@testing-library/react';
import { it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { LanguageProvider, useLanguage, type Language } from '@/contexts/LanguageContext';
import Dashboard from '@/pages/Dashboard';
import * as mockData from '@/utils/mockData';

it('refreshes activity across midnight on the dashboard tick, not on language changes', async () => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(2026, 10, 18, 23, 59, 45));
  const deliveries = vi.spyOn(mockData, 'generateInsulinDeliveries');
  let selectLanguage: (language: Language) => void = () => {};
  function Harness() {
    selectLanguage = useLanguage().setLanguage;
    return <Dashboard />;
  }
  try {
    await act(async () => {
      render(<MemoryRouter><LanguageProvider><AuthProvider><Harness /></AuthProvider></LanguageProvider></MemoryRouter>);
    });
    expect(deliveries).toHaveBeenCalledTimes(1);
    expect(screen.getAllByText('Nov 18')).toHaveLength(5);
    await act(async () => selectLanguage('es'));
    expect(deliveries).toHaveBeenCalledTimes(1);
    await act(async () => vi.advanceTimersByTime(30000));
    expect(deliveries).toHaveBeenCalledTimes(2);
    expect(screen.getAllByText('nov 19')).toHaveLength(5);
  } finally {
    deliveries.mockRestore();
    vi.useRealTimers();
  }
});
