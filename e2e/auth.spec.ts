import { test, expect } from '@playwright/test';

test.describe('Authentication Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth');
  });

  test('shows login form with email and password fields', async ({ page }) => {
    await expect(page.locator('#email')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();
  });

  test('submitting empty form does not navigate away', async ({ page }) => {
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page).toHaveURL('/auth');
  });

  test('invalid credentials show error message', async ({ page }) => {
    await page.fill('#email', 'wrong@example.com');
    await page.fill('#password', 'wrongpass');
    await page.getByRole('button', { name: 'Sign In' }).click();

    await expect(page.getByText('Invalid email or password. Try patient@example.com / demo123')).toBeVisible();
  });

  test('successful login with patient credentials redirects to /dashboard', async ({ page }) => {
    await page.fill('#email', 'patient@example.com');
    await page.fill('#password', 'demo123');
    await page.getByRole('button', { name: 'Sign In' }).click();

    await expect(page).toHaveURL('/dashboard');
  });

  test('successful login with doctor credentials redirects to /dashboard', async ({ page }) => {
    await page.fill('#email', 'doctor@example.com');
    await page.fill('#password', 'demo123');
    await page.getByRole('button', { name: 'Sign In' }).click();

    await expect(page).toHaveURL('/dashboard');
  });

  test('Demo Patient Account quick-login button logs in and redirects to /dashboard', async ({ page }) => {
    await page.getByRole('button', { name: 'Demo Patient Account' }).click();
    await expect(page).toHaveURL('/dashboard');
  });

  test('Demo Healthcare Provider quick-login button logs in and redirects to /dashboard', async ({ page }) => {
    await page.getByRole('button', { name: 'Demo Healthcare Provider' }).click();
    await expect(page).toHaveURL('/dashboard');
  });

  test('show/hide password toggle changes input type', async ({ page }) => {
    const passwordInput = page.locator('#password');
    await expect(passwordInput).toHaveAttribute('type', 'password');

    // Click the eye icon to show password
    const toggleButton = page.locator('#password ~ button, button:near(#password)').first();
    await toggleButton.click();
    await expect(passwordInput).toHaveAttribute('type', 'text');

    // Click again to hide password
    await toggleButton.click();
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('Remember me checkbox is functional', async ({ page }) => {
    const checkbox = page.locator('#remember');
    await expect(checkbox).not.toBeChecked();

    await checkbox.check();
    await expect(checkbox).toBeChecked();

    await checkbox.uncheck();
    await expect(checkbox).not.toBeChecked();
  });

  test('Back to Home link navigates to /', async ({ page }) => {
    await page.getByText('Back to Home').click();
    await expect(page).toHaveURL('/');
  });

  test('language dropdown changes form labels', async ({ page }) => {
    // Click the language dropdown and switch to Spanish
    const langTrigger = page.locator('button', { hasText: 'English' });
    await expect(langTrigger.first()).toBeVisible();
    await langTrigger.first().click();
    await page.getByText('Espa\u00f1ol').click();

    // Wait for translations to load (async t() calls)
    await expect(page.getByRole('button', { name: /Iniciar Sesi\u00f3n|Signing/ })).toBeVisible({ timeout: 10000 });
  });
});
