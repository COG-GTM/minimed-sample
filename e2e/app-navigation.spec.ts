import { test, expect } from '@playwright/test';
import { login } from './helpers';

const sections = [
  { label: 'Glucose Monitoring', path: '/dashboard/glucose', content: 'Recent Readings' },
  { label: 'Insulin Management', path: '/dashboard/insulin', content: 'Delivery History' },
  { label: 'Device Status', path: '/dashboard/device', content: 'Device Information' },
  { label: 'Reports', path: '/dashboard/reports', content: 'Weekly Time in Range' },
  { label: 'Settings', path: '/dashboard/settings', content: 'Preferences' },
];

const allNavLabels = ['Overview', ...sections.map(s => s.label)];

const sidebarActive = /from-medtronic-lightCyan/;
const headerActive = /bg-white\/20/;

const headerNav = (page: import('@playwright/test').Page) => page.getByRole('navigation', { name: 'Primary' });
const sidebarNav = (page: import('@playwright/test').Page) => page.getByRole('navigation', { name: 'Sections' });

test.describe('Sidebar navigation (desktop)', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('sidebar lists all section links', async ({ page }) => {
    for (const label of allNavLabels) {
      await expect(sidebarNav(page).getByRole('link', { name: label })).toBeVisible();
    }
  });

  for (const s of sections) {
    test(`sidebar "${s.label}" navigates to ${s.path}`, async ({ page }) => {
      await sidebarNav(page).getByRole('link', { name: s.label }).click();
      await expect(page).toHaveURL(new RegExp(`${s.path}$`));
      await expect(page.locator('main h1')).toHaveText(s.label);
      await expect(page.locator('main')).toContainText(s.content);
    });
  }

  test('Overview link returns to /dashboard and shows overview content', async ({ page }) => {
    await sidebarNav(page).getByRole('link', { name: 'Reports' }).click();
    await expect(page).toHaveURL(/\/dashboard\/reports$/);
    await sidebarNav(page).getByRole('link', { name: 'Overview' }).click();
    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(page.locator('main h1')).toContainText('Welcome back, Sarah Johnson');
    await expect(page.locator('main')).toContainText('Time in Range');
  });

  test('sidebar active styling follows the current route', async ({ page }) => {
    const overview = sidebarNav(page).getByRole('link', { name: 'Overview' });
    const glucose = sidebarNav(page).getByRole('link', { name: 'Glucose Monitoring' });

    await expect(overview).toHaveClass(sidebarActive);
    await expect(glucose).not.toHaveClass(sidebarActive);

    await glucose.click();
    await expect(glucose).toHaveClass(sidebarActive);
    await expect(overview).not.toHaveClass(sidebarActive);
  });

  test('Overview is not active on sub-routes (end matching)', async ({ page }) => {
    await page.goto('/dashboard/insulin');
    const overview = sidebarNav(page).getByRole('link', { name: 'Overview' });
    await expect(overview).not.toHaveClass(sidebarActive);
    await expect(sidebarNav(page).getByRole('link', { name: 'Insulin Management' })).toHaveClass(sidebarActive);
  });

  test('sub-routes are directly reachable by URL (deep links)', async ({ page }) => {
    for (const s of sections) {
      await page.goto(s.path);
      await expect(page.locator('main h1')).toHaveText(s.label);
      await expect(sidebarNav(page).getByRole('link', { name: s.label })).toHaveClass(sidebarActive);
    }
  });

  test('header logo link returns to /dashboard', async ({ page }) => {
    await page.goto('/dashboard/settings');
    await page.locator('header').getByRole('link', { name: /MiniMed/ }).click();
    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(page.locator('main')).toContainText('Time in Range');
  });

  test('header persists across sub-route navigation', async ({ page }) => {
    await sidebarNav(page).getByRole('link', { name: 'Device Status' }).click();
    await expect(page.locator('header')).toContainText('MiniMed');
    await expect(page.locator('header')).toContainText('Sarah Johnson');
    await expect(page.locator('header').getByRole('button', { name: 'Notifications' })).toBeVisible();
  });

  test('browser back/forward moves between sections', async ({ page }) => {
    await sidebarNav(page).getByRole('link', { name: 'Glucose Monitoring' }).click();
    await expect(page).toHaveURL(/\/dashboard\/glucose$/);
    await sidebarNav(page).getByRole('link', { name: 'Reports' }).click();
    await expect(page).toHaveURL(/\/dashboard\/reports$/);
    await page.goBack();
    await expect(page).toHaveURL(/\/dashboard\/glucose$/);
    await expect(page.locator('main h1')).toHaveText('Glucose Monitoring');
    await page.goForward();
    await expect(page).toHaveURL(/\/dashboard\/reports$/);
    await expect(page.locator('main h1')).toHaveText('Reports');
  });

  test('unauthenticated access to a sub-route redirects to /auth', async ({ page, context }) => {
    await context.clearCookies();
    await page.evaluate(() => localStorage.clear());
    await page.goto('/dashboard/device');
    await expect(page).toHaveURL(/\/auth$/);
  });
});

test.describe('Header user menu', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('shows account label and email', async ({ page }) => {
    await page.getByRole('button', { name: /Sarah Johnson/ }).click();
    await expect(page.getByRole('menu')).toContainText('My Account');
    await expect(page.getByRole('menu')).toContainText('patient@example.com');
  });

  test('Profile navigates to settings', async ({ page }) => {
    await page.getByRole('button', { name: /Sarah Johnson/ }).click();
    await page.getByRole('menuitem', { name: 'Profile' }).click();
    await expect(page).toHaveURL(/\/dashboard\/settings$/);
    await expect(page.locator('main h1')).toHaveText('Settings');
  });

  test('Settings navigates to settings', async ({ page }) => {
    await page.getByRole('button', { name: /Sarah Johnson/ }).click();
    await page.getByRole('menuitem', { name: 'Settings' }).click();
    await expect(page).toHaveURL(/\/dashboard\/settings$/);
    await expect(page.locator('main h1')).toHaveText('Settings');
  });

  test('Sign out returns to landing and protects dashboard', async ({ page }) => {
    await page.getByRole('button', { name: /Sarah Johnson/ }).click();
    await page.getByRole('menuitem', { name: 'Sign out' }).click();
    await expect(page).toHaveURL(/\/$/);
    await page.goto('/dashboard/reports');
    await expect(page).toHaveURL(/\/auth$/);
  });
});

test.describe('Settings page content', () => {
  test('shows patient profile details', async ({ page }) => {
    await login(page);
    await page.goto('/dashboard/settings');
    const main = page.locator('main');
    await expect(main).toContainText('Sarah Johnson');
    await expect(main).toContainText('patient@example.com');
    await expect(main).toContainText('Patient');
  });

  test('shows healthcare provider role for doctor', async ({ page }) => {
    await login(page, 'doctor');
    await page.goto('/dashboard/settings');
    const main = page.locator('main');
    await expect(main).toContainText('Dr. Michael Chen');
    await expect(main).toContainText('Healthcare Provider');
  });
});

test.describe('Header primary nav below xl (lg viewport)', () => {
  test.use({ viewport: { width: 1100, height: 800 } });

  test('primary nav is hidden while sidebar stays visible', async ({ page }) => {
    await login(page);
    await expect(headerNav(page)).toBeHidden();
    await expect(sidebarNav(page).getByRole('link', { name: 'Overview' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Toggle navigation' })).toBeHidden();
  });
});

test.describe('Header primary nav (xl viewport)', () => {
  test.use({ viewport: { width: 1400, height: 900 } });

  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('primary nav is visible and lists all sections', async ({ page }) => {
    await expect(headerNav(page)).toBeVisible();
    for (const label of allNavLabels) {
      await expect(headerNav(page).getByRole('link', { name: label })).toBeVisible();
    }
    await expect(page.locator('header button[aria-label="Toggle navigation"]')).toBeHidden();
  });

  for (const s of sections) {
    test(`header "${s.label}" navigates to ${s.path}`, async ({ page }) => {
      await headerNav(page).getByRole('link', { name: s.label }).click();
      await expect(page).toHaveURL(new RegExp(`${s.path}$`));
      await expect(page.locator('main h1')).toHaveText(s.label);
    });
  }

  test('header and sidebar active states stay in sync', async ({ page }) => {
    const headerOverview = headerNav(page).getByRole('link', { name: 'Overview' });
    const headerReports = headerNav(page).getByRole('link', { name: 'Reports' });
    const sideOverview = sidebarNav(page).getByRole('link', { name: 'Overview' });
    const sideReports = sidebarNav(page).getByRole('link', { name: 'Reports' });

    await expect(headerOverview).toHaveClass(headerActive);
    await expect(sideOverview).toHaveClass(sidebarActive);

    await headerReports.click();
    await expect(page).toHaveURL(/\/dashboard\/reports$/);
    await expect(headerReports).toHaveClass(headerActive);
    await expect(sideReports).toHaveClass(sidebarActive);
    await expect(headerOverview).not.toHaveClass(headerActive);
    await expect(sideOverview).not.toHaveClass(sidebarActive);

    await sideOverview.click();
    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(headerOverview).toHaveClass(headerActive);
    await expect(headerReports).not.toHaveClass(headerActive);
  });
});

test.describe('Mobile sidebar', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('sidebar opens via hamburger and closes after navigating', async ({ page }) => {
    const sidebar = page.locator('aside');
    const toggle = page.getByRole('button', { name: 'Toggle navigation' });
    await expect(sidebar).toHaveClass(/-translate-x-full/);
    await expect(toggle).toBeVisible();
    await toggle.click();
    await expect(sidebar).toHaveClass(/translate-x-0/);
    await sidebar.getByRole('link', { name: 'Glucose Monitoring' }).click();
    await expect(page).toHaveURL(/\/dashboard\/glucose$/);
    await expect(sidebar).toHaveClass(/-translate-x-full/);
  });

  test('sidebar closes when clicking the backdrop', async ({ page }) => {
    const sidebar = page.locator('aside');
    await page.getByRole('button', { name: 'Toggle navigation' }).click();
    await expect(sidebar).toHaveClass(/translate-x-0/);
    await page.locator('div.fixed.inset-0.bg-black\\/50').click({ position: { x: 380, y: 800 } });
    await expect(sidebar).toHaveClass(/-translate-x-full/);
  });

  test('toggle closes an open sidebar', async ({ page }) => {
    const sidebar = page.locator('aside');
    const toggle = page.getByRole('button', { name: 'Toggle navigation' });
    await toggle.click();
    await expect(sidebar).toHaveClass(/translate-x-0/);
    await toggle.click();
    await expect(sidebar).toHaveClass(/-translate-x-full/);
  });
});
