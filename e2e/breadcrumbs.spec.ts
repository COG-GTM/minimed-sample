import { test, expect } from '@playwright/test';
import { loginAsPatient } from './helpers';

test.describe('Breadcrumbs', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsPatient(page);
  });

  test('no breadcrumbs on dashboard root', async ({ page }) => {
    const breadcrumb = page.locator('nav[aria-label="Breadcrumb"]');
    await expect(breadcrumb).not.toBeVisible();
  });

  test('shows breadcrumbs on sub-route', async ({ page }) => {
    await page.locator('aside nav button', { hasText: 'Glucose Monitoring' }).click();
    const breadcrumb = page.locator('nav[aria-label="Breadcrumb"]');
    await expect(breadcrumb).toBeVisible();
    await expect(breadcrumb.getByText('Dashboard')).toBeVisible();
    await expect(breadcrumb.getByText('Glucose Monitoring')).toBeVisible();
  });

  test('breadcrumb Dashboard link navigates back to overview', async ({ page }) => {
    await page.locator('aside nav button', { hasText: 'Settings' }).click();
    await expect(page).toHaveURL(/\/dashboard\/settings/);
    const breadcrumb = page.locator('nav[aria-label="Breadcrumb"]');
    await breadcrumb.getByRole('link', { name: 'Dashboard' }).click();
    await expect(page).toHaveURL(/\/dashboard$/);
  });

  test('breadcrumb shows correct label for each sub-route', async ({ page }) => {
    const routes = [
      { nav: 'Glucose Monitoring', breadcrumb: 'Glucose Monitoring' },
      { nav: 'Insulin Management', breadcrumb: 'Insulin Management' },
      { nav: 'Device Status', breadcrumb: 'Device Status' },
      { nav: 'Reports', breadcrumb: 'Reports' },
      { nav: 'Settings', breadcrumb: 'Settings' },
    ];

    for (const route of routes) {
      await page.locator('aside nav button', { hasText: route.nav }).click();
      const breadcrumb = page.locator('nav[aria-label="Breadcrumb"]');
      await expect(breadcrumb.getByText(route.breadcrumb)).toBeVisible();
    }
  });
});
