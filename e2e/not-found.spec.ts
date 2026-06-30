import { test, expect } from '@playwright/test';
import { loginAsPatient } from './helpers';

test.describe('404 Not Found page', () => {
  test('renders the branded 404 page for an unknown URL', async ({ page }) => {
    await page.goto('/this-route-does-not-exist');
    await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Go Home' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Go to Dashboard' })).toBeVisible();
  });

  test('"Go Home" button navigates to the landing page', async ({ page }) => {
    await page.goto('/nope');
    await page.getByRole('button', { name: 'Go Home' }).click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByRole('heading', { name: 'Page not found' })).toHaveCount(0);
  });

  test('"Go to Dashboard" redirects unauthenticated users to /auth', async ({ page }) => {
    await page.goto('/nope');
    await page.getByRole('button', { name: 'Go to Dashboard' }).click();
    await expect(page).toHaveURL(/\/auth$/);
  });

  test('"Go to Dashboard" takes authenticated users to the dashboard', async ({ page }) => {
    await loginAsPatient(page);
    await page.goto('/nope');
    await page.getByRole('button', { name: 'Go to Dashboard' }).click();
    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(page.getByRole('heading', { name: /Welcome back/ })).toBeVisible();
  });
});
