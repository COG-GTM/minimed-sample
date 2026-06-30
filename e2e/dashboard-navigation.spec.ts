import { test, expect } from '@playwright/test';
import { loginAsPatient } from './helpers';

test.describe('Dashboard nested routes & navigation', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsPatient(page);
  });

  test('renders the Overview section at the dashboard index', async ({ page }) => {
    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(page.getByRole('heading', { name: /Welcome back/ })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Current Glucose' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '24-Hour Glucose Trend' })).toBeVisible();
  });

  const sections = [
    { path: '/dashboard/glucose', nav: 'Glucose Monitoring', title: 'Glucose Monitoring' },
    { path: '/dashboard/insulin', nav: 'Insulin Management', title: 'Insulin Management' },
    { path: '/dashboard/device', nav: 'Device Status', title: 'Device Status' },
    { path: '/dashboard/reports', nav: 'Reports', title: 'Reports' },
    { path: '/dashboard/settings', nav: 'Settings', title: 'Settings' },
  ];

  for (const section of sections) {
    test(`sidebar navigates to ${section.nav} section`, async ({ page }) => {
      await page.getByRole('button', { name: section.nav }).click();
      await expect(page).toHaveURL(new RegExp(`${section.path}$`));
      await expect(page.getByRole('heading', { name: section.title, exact: true })).toBeVisible();
      await expect(page.getByText('Coming soon')).toBeVisible();
    });
  }

  test('returns to Overview when the sidebar Overview item is clicked', async ({ page }) => {
    await page.getByRole('button', { name: 'Glucose Monitoring' }).click();
    await expect(page).toHaveURL(/\/dashboard\/glucose$/);
    await page.getByRole('button', { name: 'Overview' }).click();
    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(page.getByRole('heading', { name: /Welcome back/ })).toBeVisible();
  });

  test('header dropdown navigates to Profile and Settings', async ({ page }) => {
    await page.getByRole('button', { name: /Sarah Johnson/ }).click();
    await page.getByRole('menuitem', { name: 'Profile' }).click();
    await expect(page).toHaveURL(/\/dashboard\/profile$/);
    await expect(page.getByRole('heading', { name: 'Profile', exact: true })).toBeVisible();

    await page.getByRole('button', { name: /Sarah Johnson/ }).click();
    await page.getByRole('menuitem', { name: 'Settings' }).click();
    await expect(page).toHaveURL(/\/dashboard\/settings$/);
    await expect(page.getByRole('heading', { name: 'Settings', exact: true })).toBeVisible();
  });

  test('logo links back to the landing page', async ({ page }) => {
    await page.getByRole('link', { name: /MiniMed.*Dashboard/ }).click();
    await expect(page).toHaveURL(/\/$/);
  });

  test('direct navigation to a section URL renders that section', async ({ page }) => {
    await page.goto('/dashboard/reports');
    await expect(page.getByRole('heading', { name: 'Reports', exact: true })).toBeVisible();
  });
});
