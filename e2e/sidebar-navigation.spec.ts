import { test, expect, Locator } from '@playwright/test';
import { login } from './helpers';

const SUB_PAGES = [
  { label: 'Glucose Monitoring', path: '/dashboard/glucose', description: 'Track your continuous glucose readings, trends, and time in range.' },
  { label: 'Insulin Management', path: '/dashboard/insulin', description: 'Review your basal and bolus insulin deliveries and dosing history.' },
  { label: 'Device Status', path: '/dashboard/device', description: 'Monitor your pump connectivity, battery level, and reservoir status.' },
  { label: 'Reports', path: '/dashboard/reports', description: 'Generate and download summary reports to share with your care team.' },
  { label: 'Settings', path: '/dashboard/settings', description: 'Manage your account preferences, notifications, and device configuration.' },
];

const sidebarButton = (page: import('@playwright/test').Page, label: string): Locator =>
  page.getByRole('complementary').getByRole('button', { name: label, exact: true });

test.describe('Dashboard sidebar navigation', () => {
  test('redirects unauthenticated users away from protected sub-routes', async ({ page }) => {
    await page.goto('/dashboard/glucose');
    await expect(page).toHaveURL(/\/auth$/);
  });

  test('renders the Overview page at the /dashboard index route after login', async ({ page }) => {
    await login(page);
    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Welcome back');
    await expect(sidebarButton(page, 'Overview')).toBeVisible();
  });

  test('navigates to every dashboard sub-page from the sidebar', async ({ page }) => {
    await login(page);

    for (const item of SUB_PAGES) {
      await sidebarButton(page, item.label).click();
      await expect(page).toHaveURL(`http://localhost:5173${item.path}`);
      await expect(page.getByRole('heading', { level: 1, name: item.label })).toBeVisible();
      await expect(page.getByText(item.description)).toBeVisible();
    }

    // Returning to the index route via the Overview item.
    await sidebarButton(page, 'Overview').click();
    await expect(page).toHaveURL('http://localhost:5173/dashboard');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Welcome back');
  });

  test('highlights only the active sidebar item using an exact path match', async ({ page }) => {
    await login(page);

    // On the index route, Overview is the active (highlighted) item.
    await expect(sidebarButton(page, 'Overview')).toHaveClass(/font-semibold/);
    await expect(sidebarButton(page, 'Glucose Monitoring')).not.toHaveClass(/font-semibold/);

    await sidebarButton(page, 'Glucose Monitoring').click();
    await expect(page).toHaveURL(/\/dashboard\/glucose$/);

    // The clicked item is now active, and Overview is no longer highlighted
    // because the active state is an exact pathname match (not a prefix match).
    await expect(sidebarButton(page, 'Glucose Monitoring')).toHaveClass(/font-semibold/);
    await expect(sidebarButton(page, 'Overview')).not.toHaveClass(/font-semibold/);
  });

  test('supports deep-linking directly to a sub-route', async ({ page }) => {
    await login(page);
    await page.goto('/dashboard/insulin');

    await expect(page.getByRole('heading', { level: 1, name: 'Insulin Management' })).toBeVisible();
    await expect(sidebarButton(page, 'Insulin Management')).toHaveClass(/font-semibold/);
  });

  test('navigates to Settings from the account menu dropdown', async ({ page }) => {
    await login(page);

    await page.getByRole('button', { name: 'Sarah Johnson' }).click();
    await page.getByRole('menuitem', { name: 'Settings' }).click();

    await expect(page).toHaveURL(/\/dashboard\/settings$/);
    await expect(page.getByRole('heading', { level: 1, name: 'Settings' })).toBeVisible();
    await expect(sidebarButton(page, 'Settings')).toHaveClass(/font-semibold/);
  });

  test('logs out from the account menu and blocks access to the dashboard', async ({ page }) => {
    await login(page);

    await page.getByRole('button', { name: 'Sarah Johnson' }).click();
    await page.getByRole('menuitem', { name: 'Sign out' }).click();
    await expect(page).toHaveURL('http://localhost:5173/');

    // Session is cleared: the protected dashboard now redirects to /auth.
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/auth$/);
  });
});
