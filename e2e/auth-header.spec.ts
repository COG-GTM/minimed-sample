import { test, expect } from '@playwright/test';

test.describe('Auth header', () => {
  test('sticky header has brand, back link and language picker', async ({ page }) => {
    await page.goto('/auth');
    const header = page.locator('header');
    await expect(header).toHaveCSS('position', 'sticky');
    await expect(header.getByRole('link', { name: /MiniMed/ })).toHaveAttribute('href', '/');
    await expect(header.getByRole('link', { name: 'Back to Home' })).toHaveAttribute('href', '/');
    await expect(header.getByRole('button', { name: /English/ })).toBeVisible();
  });

  test('brand logo and back link navigate home', async ({ page }) => {
    await page.goto('/auth');
    await page.locator('header').getByRole('link', { name: /MiniMed/ }).click();
    await expect(page).toHaveURL(/\/$/);
    await page.goto('/auth');
    await page.locator('header').getByRole('link', { name: 'Back to Home' }).click();
    await expect(page).toHaveURL(/\/$/);
  });

  test('skip link moves focus to the sign-in main content', async ({ page }) => {
    await page.goto('/auth');
    await page.keyboard.press('Tab');
    const skip = page.getByRole('link', { name: 'Skip to main content' });
    await expect(skip).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator('main#main-content')).toBeFocused();
  });

  test('header fits a mobile viewport without horizontal overflow', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 640 });
    await page.goto('/auth');
    const header = page.locator('header');
    await expect(header.getByRole('link', { name: 'Back to Home' })).toBeInViewport();
    await expect(header.getByRole('button', { name: /English/ })).toBeInViewport();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(0);
  });

  test('language picker switches header strings', async ({ page }) => {
    await page.goto('/auth');
    await page.locator('header').getByRole('button', { name: /English/ }).click();
    await page.getByRole('menuitem', { name: /Deutsch/ }).click();
    await expect(page.locator('header').getByRole('button', { name: /Deutsch/ })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Zum Hauptinhalt springen' })).toHaveAttribute('href', '#main-content');
  });
});
