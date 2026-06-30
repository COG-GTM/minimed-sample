import { test, expect } from '@playwright/test';
import { loginAsPatient } from './helpers';

test.describe('Breadcrumbs', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsPatient(page);
  });

  test('shows only the Dashboard crumb on the index route', async ({ page }) => {
    const crumbs = page.getByRole('navigation', { name: 'Breadcrumb' });
    await expect(crumbs).toBeVisible();
    await expect(crumbs.getByText('Dashboard')).toBeVisible();
  });

  test('shows Dashboard > Glucose Monitoring on the glucose route', async ({ page }) => {
    await page.goto('/dashboard/glucose');
    const crumbs = page.getByRole('navigation', { name: 'Breadcrumb' });
    await expect(crumbs.getByRole('link', { name: 'Dashboard' })).toBeVisible();
    await expect(crumbs.getByText('Glucose Monitoring')).toBeVisible();
  });

  test('breadcrumb Dashboard link navigates back to the index', async ({ page }) => {
    await page.goto('/dashboard/device');
    const crumbs = page.getByRole('navigation', { name: 'Breadcrumb' });
    await crumbs.getByRole('link', { name: 'Dashboard' }).click();
    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(page.getByRole('heading', { name: /Welcome back/ })).toBeVisible();
  });
});
