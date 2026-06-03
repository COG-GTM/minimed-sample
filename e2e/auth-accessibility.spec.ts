import { test, expect } from '@playwright/test';

test.describe('Auth Page - Header Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth');
  });

  test('skip navigation link exists and targets main content', async ({ page }) => {
    const skipLink = page.locator('a[href="#main-content"]');
    await expect(skipLink).toHaveCount(1);
    await expect(skipLink).toHaveText('Skip to main content');

    const main = page.locator('main#main-content');
    await expect(main).toBeAttached();
  });

  test('skip navigation link becomes visible on focus', async ({ page }) => {
    const skipLink = page.locator('a[href="#main-content"]');
    await skipLink.focus();
    await expect(skipLink).toBeVisible();
  });

  test('header has role="banner"', async ({ page }) => {
    const header = page.locator('header[role="banner"]');
    await expect(header).toBeAttached();
  });

  test('header nav has aria-label="Page navigation"', async ({ page }) => {
    const nav = page.locator('nav[aria-label="Page navigation"]');
    await expect(nav).toBeAttached();
  });

  test('back to home link has aria-label', async ({ page }) => {
    const link = page.locator('a[aria-label="Back to home page"]');
    await expect(link).toBeAttached();
  });

  test('back arrow icon is aria-hidden', async ({ page }) => {
    const link = page.locator('a[aria-label="Back to home page"]');
    const icon = link.locator('svg');
    await expect(icon).toHaveAttribute('aria-hidden', 'true');
  });
});
