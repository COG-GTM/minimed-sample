import { test, expect } from '@playwright/test';

test.describe('LanguageDropdown - Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('language trigger button has aria-label with current language', async ({ page }) => {
    const trigger = page.locator('button[aria-label*="Select language"]');
    await expect(trigger.first()).toBeAttached();
    await expect(trigger.first()).toHaveAttribute('aria-label', /Current: English/);
  });

  test('globe icon is aria-hidden', async ({ page }) => {
    const trigger = page.locator('button[aria-label*="Select language"]');
    const globeIcon = trigger.first().locator('svg[aria-hidden="true"]').first();
    await expect(globeIcon).toBeAttached();
  });

  test('chevron icon is aria-hidden', async ({ page }) => {
    const trigger = page.locator('button[aria-label*="Select language"]');
    const icons = trigger.first().locator('svg[aria-hidden="true"]');
    const count = await icons.count();
    expect(count).toBeGreaterThanOrEqual(2);
  });

  test('selected language item has aria-current', async ({ page }) => {
    const trigger = page.locator('button[aria-label*="Select language"]');
    await trigger.first().click();

    const selectedItem = page.locator('[aria-current="true"]');
    await expect(selectedItem.first()).toBeAttached();
  });

  test('flag emojis are aria-hidden in dropdown items', async ({ page }) => {
    const trigger = page.locator('button[aria-label*="Select language"]');
    await trigger.first().click();

    const hiddenFlags = page.locator('[role="menuitem"] span[aria-hidden="true"]');
    const count = await hiddenFlags.count();
    expect(count).toBeGreaterThanOrEqual(4);
  });
});
