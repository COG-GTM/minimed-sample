import { test, expect } from '@playwright/test';

test.describe('Landing Page - Header Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
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

  test('desktop nav has aria-label="Main navigation"', async ({ page }) => {
    const nav = page.locator('nav[aria-label="Main navigation"]');
    await expect(nav).toBeAttached();
  });

  test('mobile menu button has aria-expanded and aria-controls', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    const menuButton = page.locator('button[aria-controls="mobile-menu"]');
    await expect(menuButton).toBeVisible();
    await expect(menuButton).toHaveAttribute('aria-expanded', 'false');
    await expect(menuButton).toHaveAttribute('aria-label', 'Open menu');
  });

  test('mobile menu button toggles aria-expanded on click', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    const menuButton = page.locator('button[aria-controls="mobile-menu"]');

    await menuButton.click();
    await expect(menuButton).toHaveAttribute('aria-expanded', 'true');
    await expect(menuButton).toHaveAttribute('aria-label', 'Close menu');

    const mobileNav = page.locator('nav#mobile-menu');
    await expect(mobileNav).toBeVisible();
    await expect(mobileNav).toHaveAttribute('aria-label', 'Mobile navigation');
  });

  test('mobile menu closes on Escape key', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    const menuButton = page.locator('button[aria-controls="mobile-menu"]');

    await menuButton.click();
    await expect(page.locator('nav#mobile-menu')).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(page.locator('nav#mobile-menu')).not.toBeVisible();
    await expect(menuButton).toHaveAttribute('aria-expanded', 'false');
  });

  test('menu icon SVGs are aria-hidden', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    const menuButton = page.locator('button[aria-controls="mobile-menu"]');
    const icon = menuButton.locator('svg');
    await expect(icon).toHaveAttribute('aria-hidden', 'true');
  });
});
