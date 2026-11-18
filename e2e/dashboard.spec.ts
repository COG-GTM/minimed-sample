import { test, expect } from '@playwright/test';

test('dashboard renders populated metrics, both chart SVGs and recent deliveries', async ({ page }) => {
  await page.goto('/auth');
  await page.getByRole('button', { name: 'Demo Patient Account', exact: true }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
  for (const title of ['Current Glucose', 'Total Insulin Today', 'Pump Status', 'Battery', 'Reservoir']) {
    await expect(page.getByText(title, { exact: true })).toBeVisible();
  }
  const glucoseCard = page.getByRole('heading', { name: 'Current Glucose', exact: true }).locator('../..');
  await expect(glucoseCard).toContainText(/\d+/);
  await expect(page.locator('main')).not.toContainText('--');
  await expect(page.locator('.recharts-responsive-container svg.recharts-surface')).toHaveCount(2);
  await expect(page.locator('.recharts-area-curve')).toBeVisible();
  await expect(page.locator('.recharts-pie-sector').first()).toBeVisible();
  await expect(page.getByText('Recent Activity', { exact: true })).toBeVisible();
  await expect(page.getByText(/^(Basal|Bolus) Delivery$/)).toHaveCount(5);
  await expect(page.getByText('Your latest insulin deliveries and glucose readings')).toBeVisible();
});

test('refreshes device metrics and recent deliveries on the dashboard tick', async ({ page }) => {
  await page.clock.install();
  await page.addInitScript(() => {
    Math.random = () => 0.25;
  });
  await page.goto('/auth');
  await page.getByRole('button', { name: 'Demo Patient Account', exact: true }).click();

  const device = page.getByRole('heading', { name: 'Pump Status' }).locator('../..');
  await expect(device.getByText('80%', { exact: true })).toBeVisible();

  const deliveries = page.getByText(/^\d{2}:\d{2} - \d+\.\d units\b/);
  await expect(deliveries).toHaveCount(5);
  await expect(deliveries).toHaveText([
    '23:00 - 0.9 units', '22:00 - 0.9 units', '21:00 - 0.9 units',
    '20:00 - 0.9 units', '19:00 - 0.9 units',
  ]);

  await page.evaluate(() => {
    Math.random = () => 0.75;
  });
  await page.clock.fastForward(30_000);

  await expect(device.getByText('90%', { exact: true })).toBeVisible();
  await expect(deliveries).toHaveText([
    '23:00 - 1.1 units', '22:00 - 1.1 units', '21:00 - 1.1 units',
    '20:00 - 1.1 units', '19:00 - 1.1 units',
  ]);
});

test('theme utilities resolve to opaque blue and navy colors', async ({ page }) => {
  await page.goto('/auth');
  const submit = page.getByRole('button', { name: 'Sign In', exact: true });
  await expect(submit).toHaveCSS('background-color', 'rgb(7, 95, 203)');
  const link = page.getByRole('link', { name: 'Create account' });
  await expect(link).toHaveCSS('color', 'rgb(7, 95, 203)');
  await expect(page.getByRole('button', { name: 'Demo Patient Account', exact: true })).toHaveCSS('border-top-color', 'rgb(11, 37, 69)');
  await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(255, 255, 255)');
});

test('glucose trend shows a different reading when navigated with the keyboard', async ({ page }) => {
  await page.goto('/auth');
  await page.getByRole('button', { name: 'Demo Patient Account', exact: true }).click();
  const chart = page.locator('.recharts-wrapper').filter({ has: page.locator('.recharts-area-curve') });
  const chartSurface = chart.getByRole('application');
  const tooltip = chart.locator('.recharts-tooltip-wrapper');
  const time = tooltip.locator('.recharts-tooltip-label');

  await chartSurface.focus();
  await expect(tooltip).toBeVisible();
  await expect(time).toHaveText(/^\d{2}:\d{2}$/);
  await expect(tooltip.locator('.recharts-tooltip-item-value')).toHaveText(/^\d+$/);
  const firstTime = await time.innerText();
  await chartSurface.press('ArrowRight');
  await expect(time).toHaveText(/^\d{2}:\d{2}$/);
  await expect(time).not.toHaveText(firstTime);
});
