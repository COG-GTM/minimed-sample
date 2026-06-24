import { test, expect, Page } from '@playwright/test';

async function loginAsPatient(page: Page) {
  await page.goto('/auth');
  await page.getByPlaceholder(/enter your email/i).fill('patient@example.com');
  await page.getByPlaceholder(/enter your password/i).fill('demo123');
  await page.getByLabel(/remember me/i).check();
  await page.getByRole('button', { name: /sign in/i }).click();
  await page.waitForURL('**/dashboard');
}

test.describe('Breadcrumbs', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsPatient(page);
  });

  test('shows "Dashboard" breadcrumb on overview page', async ({ page }) => {
    const breadcrumbs = page.locator('nav.flex.items-center');
    await expect(breadcrumbs).toBeVisible();
    await expect(breadcrumbs.getByText('Dashboard')).toBeVisible();
  });

  test('shows "Dashboard > Glucose Monitoring" on glucose page', async ({ page }) => {
    await page.locator('aside').getByRole('button', { name: /glucose monitoring/i }).click();
    await expect(page).toHaveURL(/\/dashboard\/glucose/);
    const breadcrumbs = page.locator('nav.flex.items-center');
    await expect(breadcrumbs.getByText('Dashboard')).toBeVisible();
    await expect(breadcrumbs.getByText('Glucose Monitoring')).toBeVisible();
    await expect(breadcrumbs.getByText('>')).toBeVisible();
  });

  test('shows "Dashboard > Insulin Management" on insulin page', async ({ page }) => {
    await page.locator('aside').getByRole('button', { name: /insulin management/i }).click();
    await expect(page).toHaveURL(/\/dashboard\/insulin/);
    const breadcrumbs = page.locator('nav.flex.items-center');
    await expect(breadcrumbs.getByText('Dashboard')).toBeVisible();
    await expect(breadcrumbs.getByText('Insulin Management')).toBeVisible();
  });

  test('shows "Dashboard > Settings" on settings page', async ({ page }) => {
    await page.locator('aside').getByRole('button', { name: /settings/i }).click();
    await expect(page).toHaveURL(/\/dashboard\/settings/);
    const breadcrumbs = page.locator('nav.flex.items-center');
    await expect(breadcrumbs.getByText('Dashboard')).toBeVisible();
    await expect(breadcrumbs.getByText('Settings')).toBeVisible();
  });

  test('shows "Dashboard > Profile" on profile page', async ({ page }) => {
    await page.locator('header').getByRole('button', { name: /sarah johnson/i }).click();
    await page.getByRole('menuitem', { name: /profile/i }).click();
    await expect(page).toHaveURL(/\/dashboard\/profile/);
    const breadcrumbs = page.locator('nav.flex.items-center');
    await expect(breadcrumbs.getByText('Dashboard')).toBeVisible();
    await expect(breadcrumbs.getByText('Profile')).toBeVisible();
  });

  test('breadcrumb Dashboard link navigates back to overview', async ({ page }) => {
    await page.locator('aside').getByRole('button', { name: /glucose monitoring/i }).click();
    await expect(page).toHaveURL(/\/dashboard\/glucose/);
    const breadcrumbs = page.locator('nav.flex.items-center');
    await breadcrumbs.getByRole('link', { name: 'Dashboard' }).click();
    await expect(page).toHaveURL(/\/dashboard$/);
  });
});
