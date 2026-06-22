import { test, expect } from '@playwright/test';
import { loginAsPatient } from './helpers';

test.describe('Dashboard header navigation', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsPatient(page);
  });

  test('header title links back to landing page', async ({ page }) => {
    await page.getByRole('link', { name: /MiniMed.*Dashboard/ }).click();
    await expect(page).toHaveURL('/');
  });

  test('user dropdown shows profile and settings options', async ({ page }) => {
    await page.locator('header').getByRole('button', { name: /Sarah Johnson/i }).click();
    await expect(page.getByText('My Account')).toBeVisible();
    await expect(page.getByRole('menuitem', { name: 'Profile' })).toBeVisible();
    await expect(page.getByRole('menuitem', { name: 'Settings' })).toBeVisible();
    await expect(page.getByRole('menuitem', { name: 'Sign out' })).toBeVisible();
  });

  test('profile dropdown navigates to profile page', async ({ page }) => {
    await page.locator('header').getByRole('button', { name: /Sarah Johnson/i }).click();
    await page.getByRole('menuitem', { name: 'Profile' }).click();
    await expect(page).toHaveURL(/\/dashboard\/profile/);
    await expect(page.locator('h2', { hasText: 'Profile' })).toBeVisible();
  });

  test('settings dropdown navigates to settings page', async ({ page }) => {
    await page.locator('header').getByRole('button', { name: /Sarah Johnson/i }).click();
    await page.getByRole('menuitem', { name: 'Settings' }).click();
    await expect(page).toHaveURL(/\/dashboard\/settings/);
    await expect(page.locator('h2', { hasText: 'Settings' })).toBeVisible();
  });

  test('sign out returns to landing page', async ({ page }) => {
    await page.locator('header').getByRole('button', { name: /Sarah Johnson/i }).click();
    await page.getByRole('menuitem', { name: 'Sign out' }).click();
    await expect(page).toHaveURL('/');
  });
});
