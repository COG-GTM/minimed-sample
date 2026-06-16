import { test, expect } from '@playwright/test';
import { loginAsPatient } from './helpers/auth';

// Overview.tsx is the overview content extracted out of the old monolithic
// Dashboard into the `/dashboard` index route: a welcome banner, a four-card
// stats grid, the glucose-trend + time-in-range charts, and a recent-activity
// feed. The route-level suite only smoke-checks the greeting and one chart, so
// these tests assert each distinct Overview section renders.
test.describe('Dashboard Overview — index route content', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsPatient(page);
    await page.goto('/dashboard');
  });

  test('renders the welcome banner for the authenticated patient', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: /Welcome back, Sarah Johnson/ })
    ).toBeVisible();
    await expect(
      page.getByText("Here's your diabetes management overview for today")
    ).toBeVisible();
  });

  test('renders the four summary stat cards', async ({ page }) => {
    await expect(page.getByText('Current Glucose')).toBeVisible();
    await expect(page.getByText('Total Insulin Today')).toBeVisible();
    await expect(page.getByText('Pump Status')).toBeVisible();
    // "Time in Range" labels both a stat card and the pie-chart card.
    await expect(page.getByText('Time in Range').first()).toBeVisible();
    // The pump status card exposes battery + reservoir rows.
    await expect(page.getByText('Battery')).toBeVisible();
    await expect(page.getByText('Reservoir')).toBeVisible();
  });

  test('renders both Overview charts and the time-in-range legend', async ({ page }) => {
    await expect(page.getByRole('heading', { name: '24-Hour Glucose Trend' })).toBeVisible();
    // Two Recharts ResponsiveContainers: glucose trend area + time-in-range pie.
    await expect(page.locator('.recharts-responsive-container')).toHaveCount(2);
    // The pie legend lists the three glucose bands.
    await expect(page.getByText('Below Range')).toBeVisible();
    await expect(page.getByText('Above Range')).toBeVisible();
  });

  test('renders the recent activity feed with delivery rows', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Recent Activity' })).toBeVisible();
    await expect(
      page.getByText('Your latest insulin deliveries and glucose readings')
    ).toBeVisible();
    // The feed renders insulin-delivery rows labelled "Bolus/Basal Delivery".
    await expect(page.getByText(/Delivery$/).first()).toBeVisible();
  });
});
