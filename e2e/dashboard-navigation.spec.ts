import { test, expect } from '@playwright/test';
import { login } from './helpers';

const sections = [
  { label: 'Glucose Monitoring', path: '/dashboard/glucose' },
  { label: 'Insulin Management', path: '/dashboard/insulin' },
  { label: 'Device Status', path: '/dashboard/device' },
  { label: 'Reports', path: '/dashboard/reports' },
  { label: 'Settings', path: '/dashboard/settings' },
];

test.describe('Dashboard sub-route navigation', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('shows overview section at /dashboard with breadcrumb', async ({ page }) => {
    await expect(page.getByText(/Welcome back/)).toBeVisible();
    const breadcrumbs = page.getByRole('navigation', { name: 'Breadcrumb' });
    await expect(breadcrumbs.getByText('Dashboard')).toBeVisible();
  });

  for (const section of sections) {
    test(`sidebar navigates to ${section.label}`, async ({ page }) => {
      await page
        .locator('aside')
        .getByRole('button', { name: section.label })
        .click();
      await expect(page).toHaveURL(new RegExp(`${section.path}$`));

      const breadcrumbs = page.getByRole('navigation', { name: 'Breadcrumb' });
      await expect(breadcrumbs.getByRole('link', { name: 'Dashboard' })).toBeVisible();
      await expect(breadcrumbs.getByText(section.label)).toBeVisible();

      const main = page.locator('main');
      await expect(main.getByText('Coming soon')).toBeVisible();
      await expect(main.getByText(section.label).first()).toBeVisible();
    });
  }

  test('sidebar marks active item based on current route', async ({ page }) => {
    const aside = page.locator('aside');
    await aside.getByRole('button', { name: 'Glucose Monitoring' }).click();
    await expect(page).toHaveURL(/\/dashboard\/glucose$/);
    await expect(aside.getByRole('button', { name: 'Glucose Monitoring' })).toHaveClass(
      /font-semibold/
    );
    await expect(aside.getByRole('button', { name: 'Overview' })).not.toHaveClass(
      /font-semibold/
    );
  });

  test('breadcrumb Dashboard link navigates back to overview', async ({ page }) => {
    await page.locator('aside').getByRole('button', { name: 'Reports' }).click();
    await expect(page).toHaveURL(/\/dashboard\/reports$/);
    await page
      .getByRole('navigation', { name: 'Breadcrumb' })
      .getByRole('link', { name: 'Dashboard' })
      .click();
    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(page.getByText(/Welcome back/)).toBeVisible();
  });

  test('header dropdown navigates to Profile and Settings', async ({ page }) => {
    const openMenu = async () => {
      await page
        .locator('header button:has(svg.lucide-chevron-down):has(svg.lucide-user)')
        .click();
    };

    await openMenu();
    await page.getByRole('menuitem', { name: 'Profile' }).click();
    await expect(page).toHaveURL(/\/dashboard\/profile$/);
    await expect(page.locator('main').getByText('Profile').first()).toBeVisible();

    await openMenu();
    await page.getByRole('menuitem', { name: 'Settings' }).click();
    await expect(page).toHaveURL(/\/dashboard\/settings$/);
    await expect(page.locator('main').getByText('Settings').first()).toBeVisible();
  });

  test('header title links to landing page', async ({ page }) => {
    await page.locator('header').getByRole('link', { name: /MiniMed/ }).click();
    await expect(page).toHaveURL(/\/$/);
  });
});
