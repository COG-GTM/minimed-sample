import { test, expect } from '@playwright/test';
import { loginWithForm } from './helpers';

test.describe('Authentication & protected routes', () => {
  test('unauthenticated user is redirected from /dashboard to /auth', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForURL('**/auth');
    await expect(page.getByRole('heading', { name: 'Welcome to MiniMed' })).toBeVisible();
  });

  test('demo patient login with the form reaches the dashboard', async ({ page }) => {
    await loginWithForm(page, 'patient@example.com', 'demo123');
    await page.waitForURL('**/dashboard');
    await expect(page.getByRole('link', { name: /MiniMed.*Dashboard/ })).toBeVisible();
  });

  test('invalid credentials show an error and stay on /auth', async ({ page }) => {
    await loginWithForm(page, 'nobody@example.com', 'wrongpass');
    await expect(page.getByText(/Invalid email or password/)).toBeVisible();
    await expect(page).toHaveURL(/\/auth$/);
  });

  test('doctor demo button logs in and reaches the dashboard', async ({ page }) => {
    await page.goto('/auth');
    await page.getByRole('button', { name: 'Demo Healthcare Provider' }).click();
    await page.waitForURL('**/dashboard');
    await expect(page.getByRole('button', { name: /Dr\. Michael Chen/ })).toBeVisible();
  });
});
