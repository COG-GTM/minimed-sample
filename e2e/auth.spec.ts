import { test, expect } from '@playwright/test';
import { loginAsPatient, loginAsDoctor } from './helpers';

test.describe('Authentication & protected routes', () => {
  test('redirects unauthenticated users from /dashboard to /auth', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/auth$/);
    await expect(page.getByRole('heading', { name: 'Welcome to MiniMed' })).toBeVisible();
  });

  test('logs in with demo patient credentials and lands on the dashboard', async ({ page }) => {
    await loginAsPatient(page);
    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(page.getByRole('heading', { name: /Welcome back, Sarah Johnson/ })).toBeVisible();
  });

  test('logs in via the Demo Patient Account button', async ({ page }) => {
    await page.goto('/auth');
    await page.getByRole('button', { name: 'Demo Patient Account' }).click();
    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(page.getByRole('heading', { name: /Welcome back/ })).toBeVisible();
  });

  test('logs in with demo doctor credentials and lands on the dashboard', async ({ page }) => {
    await loginAsDoctor(page);
    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(page.getByRole('heading', { name: /Welcome back, Dr\. Michael Chen/ })).toBeVisible();
  });
});
