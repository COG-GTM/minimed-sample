import { test, expect } from '@playwright/test';
import { DEMO_PATIENT, login } from './helpers';

test.describe('Protected dashboard routes (App.tsx nested routing + ProtectedRoute)', () => {
  test('redirects unauthenticated visits to /dashboard to /auth', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL('/auth');
    await expect(
      page.getByRole('heading', { name: 'Welcome to MiniMed' }),
    ).toBeVisible();
  });

  test('redirects unauthenticated visits to a nested dashboard route to /auth', async ({ page }) => {
    await page.goto('/dashboard/glucose');
    await expect(page).toHaveURL('/auth');
  });

  test('logging in through the form lands on the dashboard overview', async ({ page }) => {
    await login(page);
    await expect(
      page.getByRole('heading', { level: 1, name: `Welcome back, ${DEMO_PATIENT.name}` }),
    ).toBeVisible();
  });

  test('the demo patient button authenticates and opens the dashboard', async ({ page }) => {
    await page.goto('/auth');
    await page.getByRole('button', { name: 'Demo Patient Account' }).click();
    await expect(page).toHaveURL('/dashboard');
    await expect(
      page.getByRole('heading', { level: 1, name: /Welcome back/ }),
    ).toBeVisible();
  });

  test('signing out from the account menu returns home and re-guards the dashboard', async ({ page }) => {
    await login(page);

    await page.getByRole('button', { name: new RegExp(DEMO_PATIENT.name) }).click();
    await page.getByRole('menuitem', { name: 'Sign out' }).click();
    await expect(page).toHaveURL('/');

    await page.goto('/dashboard');
    await expect(page).toHaveURL('/auth');
  });
});
