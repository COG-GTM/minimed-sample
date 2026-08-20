import { test, expect, Page } from '@playwright/test';
import { login } from './helpers';

const activeClass = /font-semibold/;
const comingSoon = 'This section is under development. Check back soon for updates.';

const sidebarItem = (page: Page, label: string) =>
  page.locator('aside nav button', { hasText: label });

const subPages = [
  { label: 'Glucose Monitoring', path: '/dashboard/glucose' },
  { label: 'Insulin Management', path: '/dashboard/insulin' },
  { label: 'Device Status', path: '/dashboard/devices' },
  { label: 'Reports', path: '/dashboard/reports' },
  { label: 'Settings', path: '/dashboard/settings' },
] as const;

test.describe('Dashboard sidebar navigation', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('Overview is active by default and renders the overview content', async ({ page }) => {
    await expect(sidebarItem(page, 'Overview')).toHaveClass(activeClass);
    await expect(page.getByText('Time in Range').first()).toBeVisible();
  });

  for (const { label, path } of subPages) {
    test(`sidebar ${label} navigates to ${path} and becomes active`, async ({ page }) => {
      await sidebarItem(page, label).click();
      await expect(page).toHaveURL(new RegExp(`${path}$`));
      await expect(sidebarItem(page, label)).toHaveClass(activeClass);
      await expect(sidebarItem(page, 'Overview')).not.toHaveClass(activeClass);
      await expect(page.locator('main h1', { hasText: label })).toBeVisible();
      await expect(page.getByText(comingSoon)).toBeVisible();
    });
  }

  test('navigating back to Overview from a sub-page restores overview content', async ({ page }) => {
    await sidebarItem(page, 'Reports').click();
    await expect(page).toHaveURL(/\/dashboard\/reports$/);
    await sidebarItem(page, 'Overview').click();
    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(sidebarItem(page, 'Overview')).toHaveClass(activeClass);
    await expect(page.getByText('Time in Range').first()).toBeVisible();
  });

  test('deep link to a sub-route renders with correct active sidebar item', async ({ page }) => {
    await page.goto('/dashboard/devices');
    await expect(sidebarItem(page, 'Device Status')).toHaveClass(activeClass);
    await expect(page.locator('main h1', { hasText: 'Device Status' })).toBeVisible();
  });
});

test.describe('Dashboard user dropdown', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  const openUserMenu = async (page: Page) => {
    await page.getByRole('button', { name: /Sarah Johnson/ }).click();
    await expect(page.getByRole('menu')).toBeVisible();
  };

  test('Profile menu item navigates to /dashboard/profile', async ({ page }) => {
    await openUserMenu(page);
    await page.getByRole('menuitem', { name: 'Profile' }).click();
    await expect(page).toHaveURL(/\/dashboard\/profile$/);
    await expect(page.locator('main h1', { hasText: 'Profile' })).toBeVisible();
  });

  test('Settings menu item navigates to /dashboard/settings', async ({ page }) => {
    await openUserMenu(page);
    await page.getByRole('menuitem', { name: 'Settings' }).click();
    await expect(page).toHaveURL(/\/dashboard\/settings$/);
    await expect(sidebarItem(page, 'Settings')).toHaveClass(activeClass);
  });

  test('Sign out returns to the landing page', async ({ page }) => {
    await openUserMenu(page);
    await page.getByRole('menuitem', { name: 'Sign out' }).click();
    await expect(page).toHaveURL(/\/$/);
  });
});

test.describe('Dashboard mobile sidebar', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('menu button opens sidebar and clicking a link closes it', async ({ page }) => {
    await login(page);
    const aside = page.locator('aside');
    await expect(aside).toHaveClass(/-translate-x-full/);
    await page.locator('header button.lg\\:hidden').click();
    await expect(aside).toHaveClass(/translate-x-0/);
    await sidebarItem(page, 'Reports').click();
    await expect(page).toHaveURL(/\/dashboard\/reports$/);
    await expect(aside).toHaveClass(/-translate-x-full/);
  });

  test('overlay click closes the sidebar', async ({ page }) => {
    await login(page);
    await page.locator('header button.lg\\:hidden').click();
    const overlay = page.locator('div.fixed.inset-0.bg-black\\/50');
    await expect(overlay).toBeVisible();
    await overlay.click({ position: { x: 380, y: 400 } });
    await expect(page.locator('aside')).toHaveClass(/-translate-x-full/);
  });
});

test.describe('Protected sub-routes', () => {
  test('unauthenticated access to a dashboard sub-route redirects away', async ({ page }) => {
    await page.goto('/dashboard/glucose');
    await expect(page).not.toHaveURL(/\/dashboard\/glucose$/);
  });
});
