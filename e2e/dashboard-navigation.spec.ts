import { test, expect, Page } from '@playwright/test';

async function loginAsPatient(page: Page) {
  await page.goto('/auth');
  await page.getByPlaceholder(/enter your email/i).fill('patient@example.com');
  await page.getByPlaceholder(/enter your password/i).fill('demo123');
  await page.getByLabel(/remember me/i).check();
  await page.getByRole('button', { name: /sign in/i }).click();
  await page.waitForURL('**/dashboard');
}

test.describe('Dashboard sidebar navigation', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsPatient(page);
  });

  test('renders sidebar with all navigation items', async ({ page }) => {
    const sidebar = page.locator('aside');
    await expect(sidebar.getByRole('button', { name: /overview/i })).toBeVisible();
    await expect(sidebar.getByRole('button', { name: /glucose monitoring/i })).toBeVisible();
    await expect(sidebar.getByRole('button', { name: /insulin management/i })).toBeVisible();
    await expect(sidebar.getByRole('button', { name: /device status/i })).toBeVisible();
    await expect(sidebar.getByRole('button', { name: /reports/i })).toBeVisible();
    await expect(sidebar.getByRole('button', { name: /settings/i })).toBeVisible();
  });

  test('navigates to Glucose Monitoring section', async ({ page }) => {
    await page.locator('aside').getByRole('button', { name: /glucose monitoring/i }).click();
    await expect(page).toHaveURL(/\/dashboard\/glucose/);
    await expect(page.getByText('Glucose Monitoring').first()).toBeVisible();
  });

  test('navigates to Insulin Management section', async ({ page }) => {
    await page.locator('aside').getByRole('button', { name: /insulin management/i }).click();
    await expect(page).toHaveURL(/\/dashboard\/insulin/);
    await expect(page.getByText('Insulin Management').first()).toBeVisible();
  });

  test('navigates to Device Status section', async ({ page }) => {
    await page.locator('aside').getByRole('button', { name: /device status/i }).click();
    await expect(page).toHaveURL(/\/dashboard\/device/);
    await expect(page.getByText('Device Status').first()).toBeVisible();
  });

  test('navigates to Reports section', async ({ page }) => {
    await page.locator('aside').getByRole('button', { name: /reports/i }).click();
    await expect(page).toHaveURL(/\/dashboard\/reports/);
    await expect(page.getByText('Reports').first()).toBeVisible();
  });

  test('navigates to Settings section', async ({ page }) => {
    await page.locator('aside').getByRole('button', { name: /settings/i }).click();
    await expect(page).toHaveURL(/\/dashboard\/settings/);
    await expect(page.getByText('Settings').first()).toBeVisible();
  });

  test('navigates back to Overview via sidebar', async ({ page }) => {
    await page.locator('aside').getByRole('button', { name: /glucose monitoring/i }).click();
    await expect(page).toHaveURL(/\/dashboard\/glucose/);
    await page.locator('aside').getByRole('button', { name: /overview/i }).click();
    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(page.getByText(/welcome back/i)).toBeVisible();
  });

  test('highlights active sidebar item based on current route', async ({ page }) => {
    await page.locator('aside').getByRole('button', { name: /reports/i }).click();
    await expect(page).toHaveURL(/\/dashboard\/reports/);
    const reportsBtn = page.locator('aside').getByRole('button', { name: /reports/i });
    await expect(reportsBtn).toHaveClass(/font-semibold/);
  });
});

test.describe('Dashboard header navigation', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsPatient(page);
  });

  test('header logo links back to landing page', async ({ page }) => {
    await page.getByRole('link', { name: /minimed.*dashboard/i }).click();
    await expect(page).toHaveURL('/');
  });

  test('header dropdown navigates to Profile', async ({ page }) => {
    await page.locator('header').getByRole('button', { name: /sarah johnson/i }).click();
    await page.getByRole('menuitem', { name: /profile/i }).click();
    await expect(page).toHaveURL(/\/dashboard\/profile/);
    await expect(page.getByText('Profile').first()).toBeVisible();
  });

  test('header dropdown navigates to Settings', async ({ page }) => {
    await page.locator('header').getByRole('button', { name: /sarah johnson/i }).click();
    await page.getByRole('menuitem', { name: /settings/i }).click();
    await expect(page).toHaveURL(/\/dashboard\/settings/);
    await expect(page.getByText('Settings').first()).toBeVisible();
  });

  test('header dropdown sign out returns to landing', async ({ page }) => {
    await page.locator('header').getByRole('button', { name: /sarah johnson/i }).click();
    await page.getByRole('menuitem', { name: /sign out/i }).click();
    await expect(page).toHaveURL('/');
  });
});
