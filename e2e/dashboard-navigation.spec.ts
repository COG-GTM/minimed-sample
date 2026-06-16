import { test, expect } from '@playwright/test';
import { login, sidebar } from './helpers';

const ACTIVE_CLASS = /from-medtronic-lightCyan/;

const SIDEBAR_ITEMS = [
  { label: 'Overview', path: '/dashboard', heading: /Welcome back/ },
  { label: 'Glucose Monitoring', path: '/dashboard/glucose', heading: 'Glucose Monitoring' },
  { label: 'Insulin Management', path: '/dashboard/insulin', heading: 'Insulin Management' },
  { label: 'Device Status', path: '/dashboard/device', heading: 'Device Status' },
  { label: 'Reports', path: '/dashboard/reports', heading: 'Reports' },
  { label: 'Settings', path: '/dashboard/settings', heading: 'Settings' },
] as const;

test.describe('Dashboard sidebar & account-menu navigation (Dashboard.tsx)', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  for (const item of SIDEBAR_ITEMS) {
    test(`sidebar "${item.label}" navigates to ${item.path}`, async ({ page }) => {
      await sidebar(page).getByRole('button', { name: item.label, exact: true }).click();
      await expect(page).toHaveURL(item.path);
      await expect(page.getByRole('heading', { level: 1, name: item.heading })).toBeVisible();
    });
  }

  test('active highlight tracks the current URL', async ({ page }) => {
    const overviewBtn = sidebar(page).getByRole('button', { name: 'Overview', exact: true });
    const glucoseBtn = sidebar(page).getByRole('button', { name: 'Glucose Monitoring', exact: true });

    // On the index route, Overview is active (exact match) and others are not.
    await expect(overviewBtn).toHaveClass(ACTIVE_CLASS);
    await expect(glucoseBtn).not.toHaveClass(ACTIVE_CLASS);

    // Navigating to a sub-page moves the active highlight and clears Overview
    // (proving the exact-match vs prefix-match logic).
    await glucoseBtn.click();
    await expect(page).toHaveURL('/dashboard/glucose');
    await expect(glucoseBtn).toHaveClass(ACTIVE_CLASS);
    await expect(overviewBtn).not.toHaveClass(ACTIVE_CLASS);
  });

  test('account dropdown navigates to Profile', async ({ page }) => {
    await page.getByRole('button', { name: /Sarah Johnson/ }).click();
    await page.getByRole('menuitem', { name: 'Profile' }).click();
    await expect(page).toHaveURL('/dashboard/profile');
    await expect(page.getByRole('heading', { level: 1, name: 'Profile' })).toBeVisible();
  });

  test('account dropdown navigates to Settings', async ({ page }) => {
    await page.getByRole('button', { name: /Sarah Johnson/ }).click();
    await page.getByRole('menuitem', { name: 'Settings' }).click();
    await expect(page).toHaveURL('/dashboard/settings');
    await expect(page.getByRole('heading', { level: 1, name: 'Settings' })).toBeVisible();
  });

  test('browser back/forward navigate between sub-pages', async ({ page }) => {
    await sidebar(page).getByRole('button', { name: 'Glucose Monitoring', exact: true }).click();
    await expect(page).toHaveURL('/dashboard/glucose');

    await sidebar(page).getByRole('button', { name: 'Insulin Management', exact: true }).click();
    await expect(page).toHaveURL('/dashboard/insulin');

    await page.goBack();
    await expect(page).toHaveURL('/dashboard/glucose');
    await expect(page.getByRole('heading', { level: 1, name: 'Glucose Monitoring' })).toBeVisible();

    await page.goForward();
    await expect(page).toHaveURL('/dashboard/insulin');
    await expect(page.getByRole('heading', { level: 1, name: 'Insulin Management' })).toBeVisible();
  });
});
