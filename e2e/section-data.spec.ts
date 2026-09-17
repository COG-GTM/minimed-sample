import { test, expect } from '@playwright/test';
import { login } from './helpers';

// Wednesday 12:30 local time, mid-day so "today" has both past and future slots.
const FIXED_NOW = new Date(2026, 8, 16, 12, 30, 0, 0);
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function parseHistoryTimestamp(text: string): Date {
  const match = text.match(/^([A-Z][a-z]{2}) (\d{1,2}), (\d{2}):(\d{2})/);
  if (!match) throw new Error(`Unexpected history timestamp: "${text}"`);
  const [, mon, day, hh, mm] = match;
  const month = MONTHS.indexOf(mon);
  const parsed = new Date(FIXED_NOW.getFullYear(), month, Number(day), Number(hh), Number(mm), 0, 0);
  // Entries from a previous year (only possible in early January) roll back a year.
  if (parsed.getTime() > FIXED_NOW.getTime() + 24 * 60 * 60 * 1000) {
    parsed.setFullYear(parsed.getFullYear() - 1);
  }
  return parsed;
}

test.describe('Insulin Management data', () => {
  test.beforeEach(async ({ page }) => {
    await page.clock.setFixedTime(FIXED_NOW);
    await login(page);
    await page.goto('/dashboard/insulin');
    await expect(page.locator('main h1')).toHaveText('Insulin Management');
  });

  test('delivery history contains no future deliveries', async ({ page }) => {
    const rows = page.locator('main .divide-y > div');
    await expect(rows).toHaveCount(15);
    const texts = await rows.locator('p.text-sm.text-gray-500').allTextContents();
    expect(texts.length).toBe(15);
    for (const text of texts) {
      const ts = parseHistoryTimestamp(text);
      expect(ts.getTime(), `"${text}" should not be in the future`).toBeLessThanOrEqual(FIXED_NOW.getTime());
    }
  });

  test('most recent delivery is the latest scheduled basal before now', async ({ page }) => {
    const first = page.locator('main .divide-y > div').first();
    await expect(first.locator('p.font-medium')).toHaveText('Basal');
    await expect(first.locator('p.text-sm.text-gray-500')).toContainText('Sep 16, 12:00');
  });

  test('history is ordered newest first', async ({ page }) => {
    const texts = await page.locator('main .divide-y > div p.text-sm.text-gray-500').allTextContents();
    const times = texts.map(t => parseHistoryTimestamp(t).getTime());
    for (let i = 1; i < times.length; i++) {
      expect(times[i], `entry ${i} should not be newer than entry ${i - 1}`).toBeLessThanOrEqual(times[i - 1]);
    }
  });

  test('totals equal the sum of basal, bolus and correction', async ({ page }) => {
    const statValue = (label: string) =>
      page.locator('h3', { hasText: label }).locator('xpath=ancestor::div[contains(@class,"rounded-lg")][1]').locator('p.text-3xl');
    const read = async (label: string) => Number((await statValue(label).textContent())?.trim());
    const total = await read('Total Insulin');
    const basal = await read('Basal');
    const bolus = await read('Bolus');
    const correction = await read('Correction');
    expect(total).toBeGreaterThan(0);
    expect(Math.abs(total - (basal + bolus + correction))).toBeLessThan(0.2);
  });
});

test.describe('Reports data', () => {
  test.beforeEach(async ({ page }) => {
    await page.clock.setFixedTime(FIXED_NOW);
    await login(page);
    await page.goto('/dashboard/reports');
    await expect(page.locator('main h1')).toHaveText('Reports');
  });

  test('daily breakdown lists the last 7 days ending today, in order', async ({ page }) => {
    const dayCells = page.locator('main table tbody tr td:first-child');
    await expect(dayCells).toHaveCount(7);
    const expected = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(FIXED_NOW);
      d.setDate(d.getDate() - (6 - i));
      return WEEKDAYS[d.getDay()];
    });
    await expect(dayCells).toHaveText(expected);
    expect(expected[6]).toBe('Wed');
  });

  test('each day has per-day readings whose percentages sum to ~100%', async ({ page }) => {
    const rows = page.locator('main table tbody tr');
    await expect(rows).toHaveCount(7);
    for (let i = 0; i < 7; i++) {
      const cells = await rows.nth(i).locator('td').allTextContents();
      const [below, inRange, above] = cells.slice(1).map(c => Number(c.replace('%', '')));
      const sum = below + inRange + above;
      expect(sum, `row ${cells[0]} should have data (got ${cells.slice(1).join(', ')})`).toBeGreaterThanOrEqual(98);
      expect(sum).toBeLessThanOrEqual(102);
    }
  });

  test('weekly chart renders one stacked bar group per day', async ({ page }) => {
    const chart = page.locator('main .recharts-wrapper');
    await expect(chart).toBeVisible();
    await expect(chart.locator('.recharts-xAxis .recharts-cartesian-axis-tick')).toHaveCount(7);
    await expect(chart.locator('.recharts-legend-item')).toHaveText(['Below Range', 'In Range', 'Above Range']);
  });
});
