import { test, expect } from '@playwright/test';

test.describe('404 Not Found page', () => {
  test('renders the branded 404 for an unknown route', async ({ page }) => {
    await page.goto('/this-route-does-not-exist');
    await expect(page.getByText('404')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Page Not Found' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Go Home' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Go to Dashboard' })).toBeVisible();
  });

  test('"Go Home" navigates to the landing page', async ({ page }) => {
    await page.goto('/nope');
    await page.getByRole('button', { name: 'Go Home' }).click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByRole('button', { name: 'Get Started' })).toBeVisible();
  });

  test('"Go to Dashboard" while unauthenticated redirects to /auth', async ({ page }) => {
    await page.goto('/nope');
    await page.getByRole('button', { name: 'Go to Dashboard' }).click();
    await page.waitForURL('**/auth');
    await expect(page.getByRole('heading', { name: 'Welcome to MiniMed' })).toBeVisible();
  });
});
