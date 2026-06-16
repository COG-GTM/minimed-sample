import { test, expect } from '@playwright/test';
import { loginAsDoctor, loginAsPatient } from './helpers/auth';

// The layout-shell refactor keeps header-level concerns in Dashboard.tsx:
// the user identity in the account dropdown and the logout handler that
// clears the session and returns to the landing page.

test.describe('Dashboard account — doctor role', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsDoctor(page);
  });

  test('lands on Overview and surfaces the doctor identity', async ({ page }) => {
    await expect(page).toHaveURL('/dashboard');
    // Header account button reflects the authenticated user.
    await expect(
      page.locator('header').getByRole('button', { name: /Dr\. Michael Chen/ })
    ).toBeVisible();
    // Overview greets the same user.
    await expect(
      page.getByRole('heading', { name: /Welcome back, Dr\. Michael Chen/ })
    ).toBeVisible();
  });
});

test.describe('Dashboard account — logout', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsPatient(page);
  });

  test('Sign out returns to the landing page and re-protects the dashboard', async ({ page }) => {
    await page.locator('header').getByRole('button', { name: /Sarah Johnson/ }).click();
    await page.getByRole('menuitem', { name: 'Sign out' }).click();

    // Logout navigates back to the public landing page.
    await expect(page).toHaveURL('/');

    // Session is cleared, so the protected dashboard redirects to /auth.
    await page.goto('/dashboard');
    await expect(page).toHaveURL('/auth');
  });
});
