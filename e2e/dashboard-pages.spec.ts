import { test, expect } from '@playwright/test';
import { DEMO_PATIENT, login } from './helpers';

type PageCase = {
  name: string;
  path: string;
  heading: string;
  description: string;
  placeholder: string;
};

const SUBPAGES: PageCase[] = [
  {
    name: 'Glucose Monitoring',
    path: '/dashboard/glucose',
    heading: 'Glucose Monitoring',
    description: 'Track and analyze your continuous glucose monitor readings',
    placeholder: 'Detailed glucose monitoring trends and CGM data will appear here.',
  },
  {
    name: 'Insulin Management',
    path: '/dashboard/insulin',
    heading: 'Insulin Management',
    description: 'Review basal rates, bolus deliveries, and insulin settings',
    placeholder: 'Insulin delivery history and dosing controls will appear here.',
  },
  {
    name: 'Device Status',
    path: '/dashboard/device',
    heading: 'Device Status',
    description: 'Monitor your pump, sensor, and connectivity status',
    placeholder: 'Pump battery, reservoir, and sensor connectivity details will appear here.',
  },
  {
    name: 'Reports',
    path: '/dashboard/reports',
    heading: 'Reports',
    description: 'Generate and download summary reports for your care team',
    placeholder: 'Downloadable glucose and insulin reports will appear here.',
  },
  {
    name: 'Settings',
    path: '/dashboard/settings',
    heading: 'Settings',
    description: 'Manage your account preferences and device configuration',
    placeholder: 'Account, notification, and device settings will appear here.',
  },
];

test.describe('Nested dashboard sub-pages render via deep link', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('the index route renders the Overview content', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(
      page.getByRole('heading', { level: 1, name: `Welcome back, ${DEMO_PATIENT.name}` }),
    ).toBeVisible();
    await expect(
      page.getByText("Here's your diabetes management overview for today"),
    ).toBeVisible();
  });

  for (const sub of SUBPAGES) {
    test(`${sub.name} renders heading, description and placeholder`, async ({ page }) => {
      await page.goto(sub.path);
      await expect(page.getByRole('heading', { level: 1, name: sub.heading })).toBeVisible();
      await expect(page.getByText(sub.description)).toBeVisible();
      await expect(page.getByText(sub.placeholder)).toBeVisible();
    });
  }

  test('Profile surfaces the logged-in user details', async ({ page }) => {
    await page.goto('/dashboard/profile');
    await expect(page.getByRole('heading', { level: 1, name: 'Profile' })).toBeVisible();
    await expect(
      page.getByText('View and manage your personal account information'),
    ).toBeVisible();

    const content = page.locator('main');
    await expect(content.getByText(DEMO_PATIENT.name)).toBeVisible();
    await expect(content.getByText(DEMO_PATIENT.email)).toBeVisible();
    await expect(content.getByText(DEMO_PATIENT.role, { exact: true })).toBeVisible();
  });
});
