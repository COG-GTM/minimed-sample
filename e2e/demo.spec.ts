import { test, expect } from '@playwright/test';

for (const demo of [
  { button: 'Demo Patient Account', name: 'Sarah Johnson' },
  { button: 'Demo Healthcare Provider', name: 'Dr. Michael Chen' },
]) {
  test(`${demo.button}: landing, login, language, logout`, async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Sign In', exact: true }).first().click();
    await expect(page).toHaveURL(/\/auth$/);
    await page.getByRole('button', { name: demo.button, exact: true }).click();
    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(page.getByRole('heading', { name: `Welcome back, ${demo.name}` })).toBeVisible();
    await expect(page.getByText('Time in Range', { exact: true }).first()).toBeVisible();
    await expect(page.locator('.recharts-pie-sector').first()).toBeVisible();
    await page.screenshot({ path: `test-results/${demo.name}-dashboard.png`, fullPage: true });
    await page.getByRole('button', { name: /English/ }).click();
    await page.getByRole('menuitem', { name: /Español/ }).click();
    await expect(page.getByText('Tiempo en Rango', { exact: true }).first()).toBeVisible();
    await page.screenshot({ path: `test-results/${demo.name}-spanish.png`, fullPage: true });
    await page.getByRole('button', { name: demo.name }).click();
    await page.getByRole('menuitem', { name: 'Sign out' }).click();
    await expect(page).toHaveURL('/');
    await expect(page.getByRole('heading', { name: /Welcome back/ })).toHaveCount(0);
    await expect.poll(() => page.evaluate(() => localStorage.getItem('minimedUser'))).toBeNull();
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/auth$/);
  });
}
