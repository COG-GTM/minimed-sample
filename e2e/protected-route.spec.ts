import { test, expect } from '@playwright/test';

test.describe('Protected route redirect', () => {
  test('unauthenticated user is redirected to /auth from /dashboard', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL('/auth');
  });

  test('unauthenticated user is redirected from dashboard sub-routes', async ({ page }) => {
    await page.goto('/dashboard/glucose');
    await expect(page).toHaveURL('/auth');
  });
});
