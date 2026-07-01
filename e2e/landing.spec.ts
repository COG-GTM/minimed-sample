import { test, expect } from '@playwright/test';

test.describe('Landing page navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Sign In button navigates to the auth page', async ({ page }) => {
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page).toHaveURL(/\/auth$/);
    await expect(page.getByRole('heading', { name: 'Welcome to MiniMed' })).toBeVisible();
  });

  test('hero "Get Started" CTA navigates to the auth page', async ({ page }) => {
    await page.getByRole('button', { name: 'Get Started' }).click();
    await expect(page).toHaveURL(/\/auth$/);
  });

  test('Healthcare Professionals link navigates to the auth page', async ({ page }) => {
    await page.getByRole('link', { name: 'Healthcare Professionals' }).click();
    await expect(page).toHaveURL(/\/auth$/);
  });

  test('Products and Support anchors point to on-page sections', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'Products' })).toHaveAttribute('href', '#features');
    await expect(page.getByRole('link', { name: 'Support' })).toHaveAttribute('href', '#support');
    await expect(page.locator('section#features')).toHaveCount(1);
    await expect(page.locator('section#support')).toHaveCount(1);
  });

  test('footer CareLink Software link navigates to the auth page', async ({ page }) => {
    await page.getByRole('link', { name: 'CareLink Software' }).click();
    await expect(page).toHaveURL(/\/auth$/);
  });

  test('unimplemented footer links are marked Coming soon', async ({ page }) => {
    const comingSoon = page.getByRole('link', { name: 'Guardian Sensors' });
    await expect(comingSoon).toHaveAttribute('aria-disabled', 'true');
    await expect(comingSoon).toHaveAttribute('title', 'Coming soon');
  });
});
