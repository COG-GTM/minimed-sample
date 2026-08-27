import { test, expect } from '@playwright/test';
import { login } from './helpers';

const subPages = [
  { label: 'Glucose Monitoring', path: '/dashboard/glucose', title: 'Glucose Monitoring' },
  { label: 'Insulin Management', path: '/dashboard/insulin', title: 'Insulin Management' },
  { label: 'Device Status', path: '/dashboard/devices', title: 'Device Status' },
  { label: 'Reports', path: '/dashboard/reports', title: 'Reports' },
  { label: 'Settings', path: '/dashboard/settings', title: 'Settings' },
];

const activeClass = /from-medtronic-lightCyan/;

test.describe('Dashboard sidebar navigation', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  for (const p of subPages) {
    test(`sidebar "${p.label}" navigates to ${p.path}`, async ({ page }) => {
      await page.locator('aside nav').getByRole('link', { name: p.label }).click();
      await expect(page).toHaveURL(new RegExp(`${p.path}$`));
      await expect(page.locator('main h1')).toHaveText(p.title);
      await expect(page.locator('main')).toContainText('coming soon');
    });
  }

  test('Overview link returns to /dashboard and shows overview content', async ({ page }) => {
    await page.locator('aside nav').getByRole('link', { name: 'Glucose Monitoring' }).click();
    await expect(page).toHaveURL(/\/dashboard\/glucose$/);
    await page.locator('aside nav').getByRole('link', { name: 'Overview' }).click();
    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(page.locator('main')).toContainText('Time in Range');
  });

  test('active styling follows the current route', async ({ page }) => {
    const overview = page.locator('aside nav').getByRole('link', { name: 'Overview' });
    const glucose = page.locator('aside nav').getByRole('link', { name: 'Glucose Monitoring' });

    await expect(overview).toHaveClass(activeClass);
    await expect(glucose).not.toHaveClass(activeClass);

    await glucose.click();
    await expect(glucose).toHaveClass(activeClass);
    await expect(overview).not.toHaveClass(activeClass);
  });

  test('sub-routes are directly reachable by URL when authenticated', async ({ page }) => {
    for (const p of subPages) {
      await page.goto(p.path);
      await expect(page.locator('main h1')).toHaveText(p.title);
    }
  });

  test('layout header persists across sub-route navigation', async ({ page }) => {
    await page.locator('aside nav').getByRole('link', { name: 'Reports' }).click();
    await expect(page.locator('header')).toContainText('MiniMed');
    await expect(page.locator('header')).toContainText('Sarah Johnson');
  });

  test('unauthenticated access to a sub-route redirects to /auth', async ({ page, context }) => {
    await context.clearCookies();
    await page.evaluate(() => localStorage.clear());
    await page.goto('/dashboard/glucose');
    await expect(page).toHaveURL(/\/auth$/);
  });

  test('sign out from layout returns to landing', async ({ page }) => {
    await page.getByRole('button', { name: /Sarah Johnson/ }).click();
    await page.getByRole('menuitem', { name: 'Sign out' }).click();
    await expect(page).toHaveURL(/\/$/);
  });
});

test.describe('Dashboard sidebar on mobile', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('sidebar opens via toggle and closes after navigating', async ({ page }) => {
    await login(page);
    const sidebar = page.locator('aside');
    await expect(sidebar).toHaveClass(/-translate-x-full/);
    await page.locator('header button.lg\\:hidden').click();
    await expect(sidebar).toHaveClass(/translate-x-0/);
    await sidebar.getByRole('link', { name: 'Glucose Monitoring' }).click();
    await expect(page).toHaveURL(/\/dashboard\/glucose$/);
    await expect(sidebar).toHaveClass(/-translate-x-full/);
  });
});
