import { test, expect } from '@playwright/test';

test.use({ timezoneId: 'UTC' });

test.beforeEach(async ({ page }) => {
  await page.clock.setFixedTime(new Date('2026-11-18T12:00:00Z'));
  await page.goto('/auth');
  await page.getByLabel('Email', { exact: true }).fill('patient@example.com');
  await page.getByLabel('Password', { exact: true }).fill('demo123');
  await page.getByRole('button', { name: 'Sign In', exact: true }).click();
  await expect(page).toHaveURL('/dashboard');
});

test('recent activity uses French and German date formats when switching dashboard language', async ({ page }) => {
  for (const [currentLanguage, nextLanguage, expectedDate] of [
    ['English', 'Français', '18 nov.'],
    ['Français', 'Deutsch', '18. Nov.'],
    ['Deutsch', 'English', 'Nov 18'],
  ]) {
    await page.getByRole('button', { name: new RegExp(currentLanguage) }).click();
    await page.getByRole('menuitem', { name: new RegExp(nextLanguage) }).click();
    await expect(page.getByText(expectedDate, { exact: true })).toHaveCount(5);
  }
});

test('French recent activity describes insulin administration and glucose measurements', async ({ page }) => {
  await page.getByRole('button', { name: /English/ }).click();
  await page.getByRole('menuitem', { name: /Français/ }).click();

  await expect(page.getByText("Vos dernières administrations d'insuline et mesures de glucose", { exact: true })).toBeVisible();
  await expect(page.getByText('Administration basale', { exact: true }).first()).toBeVisible();
  await expect(page.getByText('Livraison Basale', { exact: true })).toHaveCount(0);
});
