import { test, expect } from '@playwright/test';

test.describe('404 Not Found page', () => {
  test('displays 404 page for unknown routes', async ({ page }) => {
    await page.goto('/some-nonexistent-page');
    await expect(page.getByText('404')).toBeVisible();
    await expect(page.getByText(/page not found/i)).toBeVisible();
    await expect(page.getByText(/does not exist or has been moved/i)).toBeVisible();
  });

  test('"Go Home" button navigates to landing page', async ({ page }) => {
    await page.goto('/unknown-route');
    await page.getByRole('button', { name: /go home/i }).click();
    await expect(page).toHaveURL('/');
  });

  test('"Go to Dashboard" button navigates to dashboard', async ({ page }) => {
    await page.goto('/another-bad-route');
    await page.getByRole('button', { name: /go to dashboard/i }).click();
    await expect(page).toHaveURL(/\/(dashboard|auth)/);
  });
});
