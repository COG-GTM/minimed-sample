import { test, expect } from '@playwright/test';
import { login } from './helpers';

// The Overview page is the /dashboard index route and renders the main
// dashboard body that was previously inline in Dashboard.tsx (welcome banner,
// stats grid, glucose/time-in-range charts, and recent activity).
test.describe('Dashboard Overview page', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await expect(page).toHaveURL(/\/dashboard$/);
  });

  test('greets the signed-in user by name', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toContainText(
      'Welcome back, Sarah Johnson'
    );
    await expect(
      page.getByText("Here's your diabetes management overview for today")
    ).toBeVisible();
  });

  test('renders the four summary stat cards', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Current Glucose' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Total Insulin Today' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Pump Status' })).toBeVisible();
    // "Time in Range" labels both a stat card and the pie chart, so scope to the
    // stat card via its sibling subtitle that only appears in the card.
    await expect(page.getByText('70-180 mg/dL')).toBeVisible();
    await expect(page.getByText('Battery')).toBeVisible();
    await expect(page.getByText('Reservoir')).toBeVisible();
  });

  test('renders the glucose trend and time-in-range charts', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: '24-Hour Glucose Trend' })
    ).toBeVisible();
    await expect(
      page.getByText('Your glucose levels over the past 24 hours')
    ).toBeVisible();

    await expect(
      page.getByText('Distribution of glucose levels today')
    ).toBeVisible();
    // Time-in-range legend rows.
    await expect(page.getByText('Below Range', { exact: true })).toBeVisible();
    await expect(page.getByText('In Range', { exact: true })).toBeVisible();
    await expect(page.getByText('Above Range', { exact: true })).toBeVisible();
  });

  test('renders the recent activity feed with delivery entries', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Recent Activity' })).toBeVisible();
    await expect(
      page.getByText('Your latest insulin deliveries and glucose readings')
    ).toBeVisible();
    await expect(page.getByText(/Delivery$/).first()).toBeVisible();
  });
});
