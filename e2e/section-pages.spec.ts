import { test, expect } from '@playwright/test';
import { login } from './helpers';

test.describe('Section page content', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('Glucose Monitoring shows stat cards, trend chart and recent readings', async ({ page }) => {
    await page.goto('/dashboard/glucose');
    const main = page.locator('main');
    for (const label of ['Average Glucose', 'Highest', 'Lowest', 'Time in Range']) {
      await expect(main.getByText(label, { exact: true }).first()).toBeVisible();
    }
    await expect(main).toContainText('24-Hour Glucose Trend');
    await expect(main).toContainText('Recent Readings');
    await expect(main.locator('.recharts-responsive-container').first()).toBeVisible();
  });

  test('Device Status shows connectivity, battery, reservoir and device info', async ({ page }) => {
    await page.goto('/dashboard/device');
    const main = page.locator('main');
    await expect(main.getByText(/Connected|Disconnected/).first()).toBeVisible();
    await expect(main.getByText('Battery', { exact: true }).first()).toBeVisible();
    await expect(main.getByText('Reservoir', { exact: true }).first()).toBeVisible();
    await expect(main).toContainText('Device Information');
    for (const label of ['Model', 'Serial Number', 'Firmware Version', 'Last Sync']) {
      await expect(main).toContainText(label);
    }
  });

  test('Device Information lists the model number, not the product name', async ({ page }) => {
    await page.goto('/dashboard/device');
    const modelRow = page.locator('main dl > div').filter({ has: page.getByText('Model', { exact: true }) });
    await expect(modelRow.locator('dd')).toHaveText('780G');
    const serialRow = page.locator('main dl > div').filter({ has: page.getByText('Serial Number', { exact: true }) });
    await expect(serialRow.locator('dd')).toHaveText(/^MM780G-[A-Z0-9]+$/);
    const firmwareRow = page.locator('main dl > div').filter({ has: page.getByText('Firmware Version', { exact: true }) });
    await expect(firmwareRow.locator('dd')).toHaveText('7.4.1');
  });
});

test.describe('Header account button on small screens', () => {
  test.use({ viewport: { width: 640, height: 900 } });

  test('keeps the account name as an accessible label while visually hidden', async ({ page }) => {
    await login(page);
    const accountButton = page.getByRole('button', { name: /Sarah Johnson/ });
    await expect(accountButton).toBeVisible();
    const nameSpan = accountButton.locator('span', { hasText: 'Sarah Johnson' });
    const box = await nameSpan.boundingBox();
    expect(box?.width ?? 0).toBeLessThanOrEqual(1);
    await accountButton.click();
    await expect(page.getByRole('menu')).toContainText('patient@example.com');
  });

  test('shows the account name inline at md and above', async ({ page }) => {
    await page.setViewportSize({ width: 900, height: 900 });
    await login(page);
    const nameSpan = page.getByRole('button', { name: /Sarah Johnson/ }).locator('span', { hasText: 'Sarah Johnson' });
    const box = await nameSpan.boundingBox();
    expect(box?.width ?? 0).toBeGreaterThan(40);
  });
});
