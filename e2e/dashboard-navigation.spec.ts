import { test, expect } from '@playwright/test';
import { loginAsPatient } from './helpers';

test.describe('Dashboard sidebar navigation', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsPatient(page);
  });

  test('sidebar shows all navigation items', async ({ page }) => {
    const sidebar = page.locator('aside nav');
    await expect(sidebar.getByText('Overview')).toBeVisible();
    await expect(sidebar.getByText('Glucose Monitoring')).toBeVisible();
    await expect(sidebar.getByText('Insulin Management')).toBeVisible();
    await expect(sidebar.getByText('Device Status')).toBeVisible();
    await expect(sidebar.getByText('Reports')).toBeVisible();
    await expect(sidebar.getByText('Settings')).toBeVisible();
  });

  test('Overview is active by default on /dashboard', async ({ page }) => {
    const overviewButton = page.locator('aside nav button', { hasText: 'Overview' });
    await expect(overviewButton).toHaveClass(/font-semibold/);
  });

  test('navigates to Glucose Monitoring sub-route', async ({ page }) => {
    await page.locator('aside nav button', { hasText: 'Glucose Monitoring' }).click();
    await expect(page).toHaveURL(/\/dashboard\/glucose/);
    await expect(page.locator('h2', { hasText: 'Glucose Monitoring' })).toBeVisible();
    await expect(page.locator('span', { hasText: 'Coming Soon' })).toBeVisible();
  });

  test('navigates to Insulin Management sub-route', async ({ page }) => {
    await page.locator('aside nav button', { hasText: 'Insulin Management' }).click();
    await expect(page).toHaveURL(/\/dashboard\/insulin/);
    await expect(page.locator('h2', { hasText: 'Insulin Management' })).toBeVisible();
    await expect(page.locator('span', { hasText: 'Coming Soon' })).toBeVisible();
  });

  test('navigates to Device Status sub-route', async ({ page }) => {
    await page.locator('aside nav button', { hasText: 'Device Status' }).click();
    await expect(page).toHaveURL(/\/dashboard\/device/);
    await expect(page.locator('h2', { hasText: 'Device Status' })).toBeVisible();
    await expect(page.locator('span', { hasText: 'Coming Soon' })).toBeVisible();
  });

  test('navigates to Reports sub-route', async ({ page }) => {
    await page.locator('aside nav button', { hasText: 'Reports' }).click();
    await expect(page).toHaveURL(/\/dashboard\/reports/);
    await expect(page.locator('h2', { hasText: 'Reports' })).toBeVisible();
    await expect(page.locator('span', { hasText: 'Coming Soon' })).toBeVisible();
  });

  test('navigates to Settings sub-route', async ({ page }) => {
    await page.locator('aside nav button', { hasText: 'Settings' }).click();
    await expect(page).toHaveURL(/\/dashboard\/settings/);
    await expect(page.locator('h2', { hasText: 'Settings' })).toBeVisible();
    await expect(page.locator('span', { hasText: 'Coming Soon' })).toBeVisible();
  });

  test('navigates back to Overview from sub-route', async ({ page }) => {
    await page.locator('aside nav button', { hasText: 'Glucose Monitoring' }).click();
    await expect(page).toHaveURL(/\/dashboard\/glucose/);
    await page.locator('aside nav button', { hasText: 'Overview' }).click();
    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(page.getByText('Current Glucose')).toBeVisible();
  });

  test('active sidebar item updates on navigation', async ({ page }) => {
    await page.locator('aside nav button', { hasText: 'Reports' }).click();
    const reportsButton = page.locator('aside nav button', { hasText: 'Reports' });
    await expect(reportsButton).toHaveClass(/font-semibold/);
    const overviewButton = page.locator('aside nav button', { hasText: 'Overview' });
    await expect(overviewButton).not.toHaveClass(/font-semibold/);
  });
});
