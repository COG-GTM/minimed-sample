import { test, expect } from '@playwright/test';

test.describe('404 Not Found page', () => {
  test('displays 404 page for unknown routes', async ({ page }) => {
    await page.goto('/some-nonexistent-route');
    await expect(page.getByText('404')).toBeVisible();
    await expect(page.getByText('Page Not Found')).toBeVisible();
    await expect(page.getByText('The page you are looking for does not exist or has been moved.')).toBeVisible();
  });

  test('Go Home button navigates to landing page', async ({ page }) => {
    await page.goto('/some-nonexistent-route');
    await page.getByRole('button', { name: 'Go Home' }).click();
    await expect(page).toHaveURL('/');
  });

  test('Go to Dashboard button navigates to dashboard (redirects to auth)', async ({ page }) => {
    await page.goto('/some-nonexistent-route');
    await page.getByRole('button', { name: 'Go to Dashboard' }).click();
    await expect(page).toHaveURL(/\/(dashboard|auth)/);
  });
});
