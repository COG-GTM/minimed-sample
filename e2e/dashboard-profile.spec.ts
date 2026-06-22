import { test, expect } from '@playwright/test';
import { loginAsPatient } from './helpers';

test.describe('Dashboard profile section', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsPatient(page);
  });

  test('navigates to Profile via header dropdown', async ({ page }) => {
    await page.locator('header').getByRole('button', { name: /Sarah Johnson/i }).click();
    await page.getByRole('menuitem', { name: 'Profile' }).click();
    await expect(page).toHaveURL(/\/dashboard\/profile/);
    await expect(page.locator('h2', { hasText: 'Profile' })).toBeVisible();
    await expect(page.locator('span', { hasText: 'Coming Soon' })).toBeVisible();
  });

  test('Profile section shows correct description text', async ({ page }) => {
    await page.locator('header').getByRole('button', { name: /Sarah Johnson/i }).click();
    await page.getByRole('menuitem', { name: 'Profile' }).click();
    await expect(page.getByText('Manage your personal information and account settings.')).toBeVisible();
  });

  test('navigating to Profile shows breadcrumbs with Dashboard > Profile', async ({ page }) => {
    await page.locator('header').getByRole('button', { name: /Sarah Johnson/i }).click();
    await page.getByRole('menuitem', { name: 'Profile' }).click();
    const breadcrumb = page.locator('nav[aria-label="Breadcrumb"]');
    await expect(breadcrumb).toBeVisible();
    await expect(breadcrumb.getByText('Dashboard')).toBeVisible();
    await expect(breadcrumb.getByText('Profile')).toBeVisible();
  });
});
