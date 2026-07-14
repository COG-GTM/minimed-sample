import { test, expect } from '@playwright/test';
import { login } from './helpers';

test.describe('404 Not Found page', () => {
  test('unknown route renders 404 page', async ({ page }) => {
    await page.goto('/this-route-does-not-exist');
    await expect(page.getByText('404')).toBeVisible();
    await expect(page.getByText('Page not found')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Go Home' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Go to Dashboard' })).toBeVisible();
  });

  test('Go Home button navigates to landing page', async ({ page }) => {
    await page.goto('/this-route-does-not-exist');
    await page.getByRole('button', { name: 'Go Home' }).click();
    await expect(page).toHaveURL(/\/$/);
  });

  test('Go to Dashboard redirects unauthenticated users to /auth', async ({ page }) => {
    await page.goto('/this-route-does-not-exist');
    await page.getByRole('button', { name: 'Go to Dashboard' }).click();
    await expect(page).toHaveURL(/\/auth$/);
  });

  test('Go to Dashboard navigates authenticated users to dashboard', async ({ page }) => {
    await login(page);
    await page.goto('/this-route-does-not-exist');
    await page.getByRole('button', { name: 'Go to Dashboard' }).click();
    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(page.getByText(/Welcome back/)).toBeVisible();
  });
});
