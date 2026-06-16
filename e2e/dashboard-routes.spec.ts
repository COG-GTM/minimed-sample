import { test, expect } from '@playwright/test';
import { loginAsPatient } from './helpers/auth';

// Stub pages added by the refactor. Each renders the shared PlaceholderPage
// (title heading + "Coming soon" card) at its nested route.
const PLACEHOLDER_ROUTES = [
  { path: '/dashboard/glucose', title: 'Glucose Monitoring' },
  { path: '/dashboard/insulin', title: 'Insulin Management' },
  { path: '/dashboard/device', title: 'Device Status' },
  { path: '/dashboard/reports', title: 'Reports' },
  { path: '/dashboard/settings', title: 'Settings' },
  { path: '/dashboard/profile', title: 'Profile' },
];

const ALL_DASHBOARD_ROUTES = ['/dashboard', ...PLACEHOLDER_ROUTES.map((r) => r.path)];

test.describe('Dashboard routes — protected', () => {
  for (const path of ALL_DASHBOARD_ROUTES) {
    test(`redirects ${path} to /auth when not authenticated`, async ({ page }) => {
      await page.goto(path);
      await expect(page).toHaveURL('/auth');
    });
  }
});

test.describe('Dashboard routes — authenticated', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsPatient(page);
  });

  test('index route renders the Overview with charts', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page.getByRole('heading', { name: /Welcome back/ })).toBeVisible();
    await expect(page.getByText('Current Glucose')).toBeVisible();
    await expect(page.locator('.recharts-responsive-container').first()).toBeVisible();
  });

  for (const route of PLACEHOLDER_ROUTES) {
    test(`direct navigation to ${route.path} renders the "${route.title}" placeholder`, async ({ page }) => {
      await page.goto(route.path);
      await expect(page).toHaveURL(route.path);
      await expect(page.getByRole('heading', { name: route.title })).toBeVisible();
      // The shared placeholder renders a "Coming soon" card.
      await expect(page.getByText('Coming soon').first()).toBeVisible();
      // Layout shell (header + sidebar) stays mounted around the nested route.
      await expect(page.locator('header')).toContainText('MiniMed');
      await expect(page.locator('aside')).toBeVisible();
    });
  }

  test('unknown path falls back to the landing page', async ({ page }) => {
    await page.goto('/dashboard/does-not-exist');
    await expect(page).toHaveURL('/');
  });
});
