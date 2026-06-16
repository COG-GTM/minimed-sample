import { test, expect, Page } from '@playwright/test';
import { loginAsPatient } from './helpers/auth';

// Sidebar items introduced by the layout-shell refactor: each navigates to a
// nested route and derives its active state from the URL.
const SIDEBAR_ITEMS = [
  { label: 'Overview', path: '/dashboard', heading: /Welcome back/ },
  { label: 'Glucose Monitoring', path: '/dashboard/glucose', heading: 'Glucose Monitoring' },
  { label: 'Insulin Management', path: '/dashboard/insulin', heading: 'Insulin Management' },
  { label: 'Device Status', path: '/dashboard/device', heading: 'Device Status' },
  { label: 'Reports', path: '/dashboard/reports', heading: 'Reports' },
  { label: 'Settings', path: '/dashboard/settings', heading: 'Settings' },
];

test.describe('Dashboard navigation — sidebar', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsPatient(page);
  });

  test('lands on Overview index route after login', async ({ page }) => {
    await expect(page).toHaveURL('/dashboard');
    await expect(page.getByRole('heading', { name: /Welcome back/ })).toBeVisible();
  });

  test('all sidebar items are rendered', async ({ page }) => {
    const sidebar = page.locator('aside');
    for (const item of SIDEBAR_ITEMS) {
      await expect(sidebar.getByRole('button', { name: item.label })).toBeVisible();
    }
  });

  for (const item of SIDEBAR_ITEMS) {
    test(`clicking "${item.label}" navigates to ${item.path}`, async ({ page }) => {
      const sidebar = page.locator('aside');
      await sidebar.getByRole('button', { name: item.label }).click();

      await expect(page).toHaveURL(item.path);
      await expect(page.getByRole('heading', { name: item.heading })).toBeVisible();
    });
  }

  test('active sidebar item is derived from the URL', async ({ page }) => {
    const sidebar = page.locator('aside');

    // Overview is active on the index route (exact match).
    await expect(sidebar.getByRole('button', { name: 'Overview' })).toHaveClass(/font-semibold/);
    await expect(sidebar.getByRole('button', { name: 'Glucose Monitoring' })).not.toHaveClass(/font-semibold/);

    // Navigating to a nested route moves the active highlight (prefix match)
    // and Overview is no longer active because it requires an exact match.
    await sidebar.getByRole('button', { name: 'Glucose Monitoring' }).click();
    await expect(page).toHaveURL('/dashboard/glucose');
    await expect(sidebar.getByRole('button', { name: 'Glucose Monitoring' })).toHaveClass(/font-semibold/);
    await expect(sidebar.getByRole('button', { name: 'Overview' })).not.toHaveClass(/font-semibold/);
  });
});

test.describe('Dashboard navigation — account dropdown', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsPatient(page);
  });

  async function openAccountMenu(page: Page) {
    await page.locator('header').getByRole('button', { name: /Sarah Johnson/ }).click();
  }

  test('Profile dropdown item navigates to /dashboard/profile', async ({ page }) => {
    await openAccountMenu(page);
    await page.getByRole('menuitem', { name: 'Profile' }).click();

    await expect(page).toHaveURL('/dashboard/profile');
    await expect(page.getByRole('heading', { name: 'Profile' })).toBeVisible();
  });

  test('Settings dropdown item navigates to /dashboard/settings', async ({ page }) => {
    await openAccountMenu(page);
    await page.getByRole('menuitem', { name: 'Settings' }).click();

    await expect(page).toHaveURL('/dashboard/settings');
    await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible();
  });
});

test.describe('Dashboard navigation — mobile sidebar overlay', () => {
  test.use({ viewport: { width: 393, height: 851 }, isMobile: true, hasTouch: true });

  test.beforeEach(async ({ page }) => {
    await loginAsPatient(page);
  });

  test('hamburger toggles the sidebar and navigation closes it', async ({ page }) => {
    const sidebar = page.locator('aside');

    // Hidden off-screen on mobile by default.
    await expect(sidebar).not.toBeInViewport();

    const menuButton = page
      .locator('header button')
      .filter({ has: page.locator('svg.lucide-menu') });
    await menuButton.click();
    await expect(sidebar).toBeInViewport();

    // Selecting an item navigates and auto-closes the mobile sidebar.
    await sidebar.getByRole('button', { name: 'Reports' }).click();
    await expect(page).toHaveURL('/dashboard/reports');
    await expect(sidebar).not.toBeInViewport();
  });
});
