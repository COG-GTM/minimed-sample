import { test, expect } from '@playwright/test';

test.describe('Auth page links', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth');
  });

  test('Forgot your password? navigates to /forgot-password', async ({ page }) => {
    const link = page.getByRole('link', { name: 'Forgot your password?' });
    await expect(link).toHaveAttribute('href', '/forgot-password');
    await link.click();
    await expect(page).toHaveURL(/\/forgot-password$/);
    await expect(page.getByText('Reset Your Password')).toBeVisible();
  });

  test('Create account navigates to /signup', async ({ page }) => {
    const link = page.getByRole('link', { name: 'Create account' });
    await expect(link).toHaveAttribute('href', '/signup');
    await link.click();
    await expect(page).toHaveURL(/\/signup$/);
    await expect(page.getByText('Create an Account')).toBeVisible();
  });
});

test.describe('Forgot password page', () => {
  test('renders demo note and Back to Sign In returns to /auth', async ({ page }) => {
    await page.goto('/forgot-password');
    await expect(page.getByText('Reset Your Password')).toBeVisible();
    await expect(page.getByText(/Demo accounts: patient@example\.com/)).toBeVisible();
    await page.getByRole('link', { name: 'Back to Sign In' }).click();
    await expect(page).toHaveURL(/\/auth$/);
  });
});

test.describe('Signup page', () => {
  test('renders demo note and Back to Sign In returns to /auth', async ({ page }) => {
    await page.goto('/signup');
    await expect(page.getByText('Create an Account')).toBeVisible();
    await expect(page.getByText(/Demo accounts: patient@example\.com/)).toBeVisible();
    await page.getByRole('link', { name: 'Back to Sign In' }).click();
    await expect(page).toHaveURL(/\/auth$/);
  });
});
