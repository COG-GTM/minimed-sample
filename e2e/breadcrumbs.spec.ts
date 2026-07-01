import { test, expect } from '@playwright/test';
import { loginAsDemo } from './helpers';

test.describe('Breadcrumbs', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsDemo(page);
  });

  test('shows only Dashboard on the index route', async ({ page }) => {
    const crumbs = page.getByRole('navigation', { name: 'Breadcrumb' });
    await expect(crumbs).toBeVisible();
    await expect(crumbs.getByText('Dashboard')).toBeVisible();
    await expect(crumbs.locator('[aria-current="page"]')).toHaveText('Dashboard');
  });

  test('builds a trail on a sub-route and the last crumb is active', async ({ page }) => {
    await page.getByRole('button', { name: 'Glucose Monitoring' }).click();
    await expect(page).toHaveURL(/\/dashboard\/glucose$/);

    const crumbs = page.getByRole('navigation', { name: 'Breadcrumb' });
    await expect(crumbs.getByRole('link', { name: 'Dashboard' })).toBeVisible();
    await expect(crumbs.locator('[aria-current="page"]')).toHaveText('Glucose Monitoring');
  });

  test('clicking the Dashboard crumb returns to the overview', async ({ page }) => {
    await page.getByRole('button', { name: 'Reports' }).click();
    await expect(page).toHaveURL(/\/dashboard\/reports$/);

    const crumbs = page.getByRole('navigation', { name: 'Breadcrumb' });
    await crumbs.getByRole('link', { name: 'Dashboard' }).click();
    await expect(page).toHaveURL(/\/dashboard$/);
  });
});
