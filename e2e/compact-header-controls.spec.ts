import { test, expect } from '@playwright/test';
import { login } from './helpers';

const languageButton = (page: import('@playwright/test').Page) =>
  page.locator('header').getByRole('button', { name: /English|Español|Français|Deutsch/ });

test.describe('Dashboard compact header controls', () => {
  test('below sm the language label is screen-reader only and chevrons are hidden', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await login(page);
    const picker = languageButton(page);
    await expect(picker).toHaveAccessibleName(/English/);
    await expect(picker.locator('span')).toHaveClass(/sr-only/);
    const labelBox = await picker.locator('span').boundingBox();
    expect(labelBox?.width ?? 0).toBeLessThanOrEqual(1);
    await expect(picker.locator('svg.lucide-chevron-down')).toBeHidden();
    await expect(page.getByRole('button', { name: 'User menu' }).locator('svg.lucide-chevron-down')).toBeHidden();
  });

  test('at sm and above the language label and chevrons are visible', async ({ page }) => {
    await page.setViewportSize({ width: 700, height: 800 });
    await login(page);
    const picker = languageButton(page);
    const labelBox = await picker.locator('span').boundingBox();
    expect(labelBox?.width ?? 0).toBeGreaterThan(20);
    await expect(picker.locator('span')).toContainText('English');
    await expect(picker.locator('svg.lucide-chevron-down')).toBeVisible();
    await expect(page.getByRole('button', { name: 'User menu' }).locator('svg.lucide-chevron-down')).toBeVisible();
  });

  test('compact picker still switches language at 320px', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    await login(page);
    await languageButton(page).click();
    await page.getByRole('menuitem', { name: /Deutsch/ }).click();
    await expect(languageButton(page)).toHaveAccessibleName(/Deutsch/);
  });
});

test('Auth header language picker is not compact on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto('/auth');
  const picker = languageButton(page);
  await expect(picker.locator('span')).not.toHaveClass(/sr-only/);
  const labelBox = await picker.locator('span').boundingBox();
  expect(labelBox?.width ?? 0).toBeGreaterThan(20);
  await expect(picker.locator('svg.lucide-chevron-down')).toBeVisible();
});
