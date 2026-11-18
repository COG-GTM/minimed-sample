import { test, expect } from '@playwright/test';
import { pageTranslations } from '../src/services/pageTranslations';

for (const language of [
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' },
] as const) {
  test(`${language.label}: landing sections, auth controls and invalid-credential feedback are localized`, async ({ page }) => {
    const translated = (source: string) => pageTranslations[source][language.code];
    await page.goto('/');
    await page.getByRole('button', { name: /English/ }).click();
    await page.getByRole('menuitem', { name: new RegExp(language.label) }).click();
    for (const source of [
      'Learn More', 'Advanced Hybrid Closed Loop System', 'Comprehensive Diabetes Management',
      'Track glucose levels continuously with advanced CGM integration',
      "Smart insulin delivery that adapts to your body's needs", 'Share real-time data with your healthcare team',
      'Stay connected with mobile app integration', 'Ready to Take Control?', 'Start Your Journey',
      'Guardian Sensors', 'Customer Service', 'About Us', 'Privacy Policy',
      'Not affiliated with or endorsed by Medtronic, Inc.',
    ]) {
      await expect(page.getByText(translated(source), { exact: true })).toBeVisible();
      await expect(page.getByText(source, { exact: true })).toHaveCount(0);
    }
    await page.getByRole('button', { name: translated('Start Your Journey'), exact: true }).click();
    await expect(page).toHaveURL(/\/auth$/);
    await expect(page.getByRole('link', { name: translated('Back to Home') })).toBeVisible();
    await expect(page.getByText(translated("Don't have an account?"), { exact: false })).toBeVisible();
    await page.locator('#email').fill('unknown@example.com');
    await page.locator('#password').fill('wrong-password');
    await page.getByRole('button', { name: translated('Show password'), exact: true }).click();
    await expect(page.locator('#password')).toHaveAttribute('type', 'text');
    await page.getByRole('button', { name: translated('Hide password'), exact: true }).click();
    await expect(page.locator('#password')).toHaveAttribute('type', 'password');
    await page.locator('form button[type="submit"]').click();
    await expect(page.getByRole('button', { name: translated('Signing in...'), exact: true })).toBeDisabled();
    await expect(page.getByText(translated('Invalid email or password. Try patient@example.com / demo123'), { exact: true })).toBeVisible();
    await expect(page.locator('form button[type="submit"]')).toBeEnabled();
    expect(await page.evaluate(() => localStorage.getItem('minimedUser'))).toBeNull();
  });

  test(`${language.label}: lazy navigation retains the localized page until auth is ready`, async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /English/ }).click();
    await page.getByRole('menuitem', { name: new RegExp(language.label) }).click();
    const authChunk = /\/(?:assets\/Auth-[^/]+\.js|src\/pages\/Auth\.tsx)(?:\?.*)?$/;
    const { promise, resolve } = Promise.withResolvers<void>();
    await page.route(authChunk, async (route) => {
      await promise;
      await route.continue();
    });
    try {
      await Promise.all([
        page.waitForRequest(authChunk),
        page.getByRole('button', { name: pageTranslations['Start Your Journey'][language.code], exact: true }).click(),
      ]);
      await expect(page.getByRole('button', { name: pageTranslations['Learn More'][language.code], exact: true })).toBeVisible();
      await expect(page.getByRole('status')).toHaveCount(0);
      await expect(page.locator('#email')).toHaveCount(0);
    } finally {
      resolve();
    }
    await expect(page.locator('#email')).toBeVisible();
    await expect(page.getByRole('link', { name: pageTranslations['Back to Home'][language.code] })).toBeVisible();
    await expect(page.getByRole('status')).toHaveCount(0);
    await expect(page).toHaveURL(/\/auth$/);
  });
}
