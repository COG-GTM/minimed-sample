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
});
