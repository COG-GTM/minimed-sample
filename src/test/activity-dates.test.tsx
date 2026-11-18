import { act, render, screen } from '@testing-library/react';
import { it, expect } from 'vitest';
import { LanguageProvider, useLanguage, type Language } from '@/contexts/LanguageContext';
import { RecentActivity } from '@/features/dashboard/RecentActivity';
import { useDashboardTranslations } from '@/features/dashboard/useDashboardTranslations';
import type { InsulinDelivery } from '@/types/device';

const delivery: InsulinDelivery = {
  id: 'basal',
  timestamp: new Date(2026, 10, 18, 12),
  type: 'basal',
  amount: 1,
};

it.each([
  ['en', 'Nov 18'],
  ['es', '18 nov'],
  ['fr', '18 nov.'],
  ['de', '18. Nov.'],
] as const)('formats activity dates for %s', async (language, expected) => {
  let selectLanguage: (language: Language) => void = () => {};
  function Harness() {
    selectLanguage = useLanguage().setLanguage;
    return <RecentActivity translations={useDashboardTranslations()} deliveries={[delivery]} />;
  }
  render(<LanguageProvider><Harness /></LanguageProvider>);
  await act(async () => selectLanguage(language));
  expect(screen.getByText(expected, { exact: true })).toBeInTheDocument();
});

it('renders empty recent activity without dates', () => {
  function EmptyActivity() {
    return <RecentActivity translations={useDashboardTranslations()} deliveries={[]} />;
  }
  render(<LanguageProvider><EmptyActivity /></LanguageProvider>);
  expect(screen.getByText('Recent Activity')).toBeInTheDocument();
  expect(screen.queryByText('Nov 18')).not.toBeInTheDocument();
});
