import { test, expect } from '@playwright/test';
import { DEMO_PATIENT, login } from './helpers';

// The Overview page (pages/dashboard/Overview.tsx) holds the content that used
// to live in the monolithic Dashboard. These tests assert its static structure
// (stat cards, chart panels, recent activity) renders on the index route; the
// numeric values come from randomized mock data, so only stable labels/titles
// are asserted.
test.describe('Dashboard Overview content (pages/dashboard/Overview.tsx)', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('renders the welcome header for the logged-in user', async ({ page }) => {
    await expect(
      page.getByRole('heading', { level: 1, name: `Welcome back, ${DEMO_PATIENT.name}` }),
    ).toBeVisible();
    await expect(
      page.getByText("Here's your diabetes management overview for today"),
    ).toBeVisible();
  });

  test('renders the four summary stat cards', async ({ page }) => {
    const main = page.locator('main');
    await expect(main.getByRole('heading', { level: 3, name: 'Current Glucose' })).toBeVisible();
    await expect(main.getByRole('heading', { level: 3, name: 'Total Insulin Today' })).toBeVisible();
    await expect(main.getByRole('heading', { level: 3, name: 'Pump Status' })).toBeVisible();

    // "Time in Range" is used twice (stat card title + chart panel title).
    await expect(
      main.getByRole('heading', { level: 3, name: 'Time in Range' }),
    ).toHaveCount(2);

    // Static labels inside the cards.
    await expect(main.getByText('70-180 mg/dL')).toBeVisible();
    await expect(main.getByText('Battery')).toBeVisible();
    await expect(main.getByText('Reservoir')).toBeVisible();
  });

  test('renders the glucose trend and time-in-range chart panels', async ({ page }) => {
    const main = page.locator('main');
    await expect(
      main.getByRole('heading', { level: 3, name: '24-Hour Glucose Trend' }),
    ).toBeVisible();
    await expect(
      main.getByText('Your glucose levels over the past 24 hours'),
    ).toBeVisible();
    await expect(
      main.getByText('Distribution of glucose levels today'),
    ).toBeVisible();

    // The time-in-range pie legend lists the three buckets.
    await expect(main.getByText('Below Range', { exact: true })).toBeVisible();
    await expect(main.getByText('In Range', { exact: true })).toBeVisible();
    await expect(main.getByText('Above Range', { exact: true })).toBeVisible();
  });

  test('renders the recent activity panel', async ({ page }) => {
    const main = page.locator('main');
    await expect(
      main.getByRole('heading', { level: 3, name: 'Recent Activity' }),
    ).toBeVisible();
    await expect(
      main.getByText('Your latest insulin deliveries and glucose readings'),
    ).toBeVisible();
  });
});
