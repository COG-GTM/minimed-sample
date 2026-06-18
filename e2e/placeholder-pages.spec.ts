import { test, expect } from '@playwright/test';
import { login } from './helpers';

// Glucose / Insulin / Device / Reports / Settings all render through the shared
// PlaceholderPage component (a title heading + a card with description and a
// common "coming soon" message). This verifies that shared content renders for
// every placeholder sub-route.
const PLACEHOLDER_PAGES = [
  { path: '/dashboard/glucose', title: 'Glucose Monitoring', description: 'Track your continuous glucose readings, trends, and time in range.' },
  { path: '/dashboard/insulin', title: 'Insulin Management', description: 'Review your basal and bolus insulin deliveries and dosing history.' },
  { path: '/dashboard/device', title: 'Device Status', description: 'Monitor your pump connectivity, battery level, and reservoir status.' },
  { path: '/dashboard/reports', title: 'Reports', description: 'Generate and download summary reports to share with your care team.' },
  { path: '/dashboard/settings', title: 'Settings', description: 'Manage your account preferences, notifications, and device configuration.' },
];

test.describe('Dashboard placeholder pages', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  for (const item of PLACEHOLDER_PAGES) {
    test(`renders the shared placeholder layout for ${item.title}`, async ({ page }) => {
      await page.goto(item.path);

      // Scope to the main content region so the matching sidebar button label
      // (which uses the same text) does not interfere with the assertions.
      const main = page.getByRole('main');

      // The title renders both as the page heading and as the card title.
      await expect(main.getByRole('heading', { level: 1, name: item.title })).toBeVisible();
      await expect(main.getByText(item.title, { exact: true })).toHaveCount(2);

      await expect(main.getByText(item.description)).toBeVisible();
      await expect(main.getByText('This section is coming soon.')).toBeVisible();
    });
  }
});
