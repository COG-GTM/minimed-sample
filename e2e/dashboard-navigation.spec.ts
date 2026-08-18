import { test, expect, Page } from '@playwright/test';
import { login } from './helpers';

const activeClass = /font-semibold/;

const sidebarLink = (page: Page, label: string) =>
  page.locator('aside nav a', { hasText: label });

const subPages = [
  { label: 'Glucose Monitoring', path: '/dashboard/glucose', title: 'Glucose Monitoring' },
  { label: 'Insulin Management', path: '/dashboard/insulin', title: 'Insulin Management' },
  { label: 'Device Status', path: '/dashboard/devices', title: 'Device Status' },
  { label: 'Reports', path: '/dashboard/reports', title: 'Reports' },
  { label: 'Settings', path: '/dashboard/settings', title: 'Settings' },
] as const;

test.describe('Dashboard sidebar navigation', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('Overview is active by default and renders the overview content', async ({ page }) => {
    await expect(sidebarLink(page, 'Overview')).toHaveClass(activeClass);
    await expect(page.getByText('Time in Range').first()).toBeVisible();
  });

  for (const { label, path, title } of subPages) {
    test(`sidebar ${label} navigates to ${path} and becomes active`, async ({ page }) => {
      await sidebarLink(page, label).click();
      await expect(page).toHaveURL(new RegExp(`${path}$`));
      await expect(sidebarLink(page, label)).toHaveClass(activeClass);
      await expect(sidebarLink(page, 'Overview')).not.toHaveClass(activeClass);
      await expect(page.locator('main h1', { hasText: title })).toBeVisible();
      await expect(page.getByText('This section is coming soon.')).toBeVisible();
    });
  }

  test('navigating back to Overview from a sub-page restores overview content', async ({ page }) => {
    await sidebarLink(page, 'Reports').click();
    await expect(page).toHaveURL(/\/dashboard\/reports$/);
    await sidebarLink(page, 'Overview').click();
    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(sidebarLink(page, 'Overview')).toHaveClass(activeClass);
    await expect(page.getByText('Time in Range').first()).toBeVisible();
  });

  test('deep link to a sub-route renders with correct active sidebar item', async ({ page }) => {
    await page.goto('/dashboard/devices');
    await expect(sidebarLink(page, 'Device Status')).toHaveClass(activeClass);
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
    await expect(sidebarLink(page, 'Settings')).toHaveClass(activeClass);
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
    await sidebarLink(page, 'Reports').click();
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
