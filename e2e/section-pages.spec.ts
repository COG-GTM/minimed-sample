import { test, expect } from '@playwright/test';
import { login } from './helpers';

const FIXED_NOW = new Date(2026, 8, 17, 9, 30, 0);

test.describe('Section page content', () => {
  test.beforeEach(async ({ page }) => {
    await page.clock.setFixedTime(FIXED_NOW);
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

  test('Insulin Management delivery history excludes future deliveries', async ({ page }) => {
    await page.goto('/dashboard/insulin');
    const main = page.locator('main');
    for (const label of ['Total Insulin', 'Basal', 'Bolus', 'Correction']) {
      await expect(main.getByText(label, { exact: true }).first()).toBeVisible();
    }

    const rows = main.locator('.divide-y > div');
    await expect(rows.first()).toBeVisible();
    const timestamps = await rows.locator('p.text-sm.text-gray-500').allTextContents();
    expect(timestamps.length).toBeGreaterThan(0);

    for (const text of timestamps) {
      const match = text.match(/^([A-Z][a-z]{2}) (\d{1,2}), (\d{2}):(\d{2})/);
      expect(match, `unexpected timestamp format: ${text}`).not.toBeNull();
      const [, mon, day, hh, mm] = match!;
      const monthIndex = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].indexOf(mon);
      const ts = new Date(FIXED_NOW.getFullYear(), monthIndex, Number(day), Number(hh), Number(mm));
      expect(ts.getTime(), `delivery ${text} is in the future`).toBeLessThanOrEqual(FIXED_NOW.getTime());
    }
  });

  test('Reports daily breakdown lists 7 days ending today with percentages summing to ~100', async ({ page }) => {
    await page.goto('/dashboard/reports');
    const main = page.locator('main');
    await expect(main).toContainText('Weekly Time in Range');
    await expect(main).toContainText('Daily Breakdown');

    const rows = main.locator('table tbody tr');
    await expect(rows).toHaveCount(7);

    const dayLabels = await rows.locator('td:first-child').allTextContents();
    const expected = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(FIXED_NOW);
      d.setDate(d.getDate() - (6 - i));
      return d.toLocaleDateString('en-US', { weekday: 'short' });
    });
    expect(dayLabels).toEqual(expected);

    for (let i = 0; i < 7; i++) {
      const cells = await rows.nth(i).locator('td').allTextContents();
      const [below, inRange, above] = cells.slice(1).map(c => Number(c.replace('%', '')));
      const total = below + inRange + above;
      expect(total, `row ${dayLabels[i]} totals ${total}`).toBeGreaterThanOrEqual(98);
      expect(total, `row ${dayLabels[i]} totals ${total}`).toBeLessThanOrEqual(102);
    }
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
