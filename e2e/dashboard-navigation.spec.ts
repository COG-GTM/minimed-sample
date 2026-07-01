import { test, expect } from '@playwright/test';
import { loginAsDemo } from './helpers';

test.describe('Dashboard sidebar navigation & sub-routes', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsDemo(page);
  });

  test('index route renders the Overview section', async ({ page }) => {
    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(page.getByRole('button', { name: 'Overview' })).toBeVisible();
  });

  const sections = [
    { name: 'Glucose Monitoring', path: '/dashboard/glucose', description: 'View and analyze your continuous glucose monitoring data' },
    { name: 'Insulin Management', path: '/dashboard/insulin', description: 'Manage your insulin delivery settings and history' },
    { name: 'Device Status', path: '/dashboard/device', description: 'Check the status and health of your connected devices' },
    { name: 'Reports', path: '/dashboard/reports', description: 'Generate and download detailed diabetes management reports' },
    { name: 'Settings', path: '/dashboard/settings', description: 'Configure your account preferences and app settings' },
  ];

  for (const section of sections) {
    test(`sidebar navigates to ${section.name} and shows a Coming soon placeholder`, async ({ page }) => {
      await page.getByRole('button', { name: section.name }).click();
      await expect(page).toHaveURL(new RegExp(section.path.replace('/', '\\/') + '$'));
      await expect(page.getByRole('heading', { name: section.name, level: 1 })).toBeVisible();
      await expect(page.getByText(section.description).first()).toBeVisible();
      await expect(page.getByText('Coming soon')).toBeVisible();
    });
  }

  test('Overview is active only on the exact /dashboard path', async ({ page }) => {
    const overview = page.getByRole('button', { name: 'Overview' });
    await expect(overview).toHaveClass(/font-semibold/);

    await page.getByRole('button', { name: 'Glucose Monitoring' }).click();
    await expect(page).toHaveURL(/\/dashboard\/glucose$/);
    await expect(overview).not.toHaveClass(/font-semibold/);
    await expect(page.getByRole('button', { name: 'Glucose Monitoring' })).toHaveClass(/font-semibold/);
  });

  test('header title links back to the landing page', async ({ page }) => {
    await page.getByRole('link', { name: /MiniMed.*Dashboard/ }).click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByRole('button', { name: 'Get Started' })).toBeVisible();
  });

  test('account dropdown navigates to Profile and Settings', async ({ page }) => {
    await page.getByRole('button', { name: /Sarah Johnson/ }).click();
    await page.getByRole('menuitem', { name: 'Profile' }).click();
    await expect(page).toHaveURL(/\/dashboard\/profile$/);
    await expect(page.getByRole('heading', { name: 'Profile', level: 1 })).toBeVisible();

    await page.getByRole('button', { name: /Sarah Johnson/ }).click();
    await page.getByRole('menuitem', { name: 'Settings' }).click();
    await expect(page).toHaveURL(/\/dashboard\/settings$/);
    await expect(page.getByRole('heading', { name: 'Settings', level: 1 })).toBeVisible();
  });

  test('sign out returns to the landing page', async ({ page }) => {
    await page.getByRole('button', { name: /Sarah Johnson/ }).click();
    await page.getByRole('menuitem', { name: 'Sign out' }).click();
    await expect(page).toHaveURL(/\/$/);
  });
});
