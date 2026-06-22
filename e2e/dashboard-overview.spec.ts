import { test, expect } from '@playwright/test';
import { loginAsPatient } from './helpers';

test.describe('Dashboard overview section', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsPatient(page);
  });

  test('overview renders stats grid cards', async ({ page }) => {
    await expect(page.getByText('Current Glucose')).toBeVisible();
    await expect(page.getByText('Time in Range').first()).toBeVisible();
    await expect(page.getByText('Total Insulin Today')).toBeVisible();
    await expect(page.getByText('Pump Status')).toBeVisible();
  });

  test('overview renders charts section', async ({ page }) => {
    await expect(page.getByText('24-Hour Glucose Trend')).toBeVisible();
    await expect(page.getByText('Distribution of glucose levels today')).toBeVisible();
  });

  test('overview renders recent activity section', async ({ page }) => {
    await expect(page.getByText('Recent Activity')).toBeVisible();
    await expect(page.getByText('Your latest insulin deliveries and glucose readings')).toBeVisible();
  });

  test('dashboard layout has persistent sidebar and header', async ({ page }) => {
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('aside nav')).toBeVisible();
    await expect(page.locator('main')).toBeVisible();
  });

  test('overview is the default content at /dashboard', async ({ page }) => {
    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(page.getByText('Current Glucose')).toBeVisible();
  });
});
