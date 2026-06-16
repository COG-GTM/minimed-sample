import { test, expect } from '@playwright/test';
import { DEMO_DOCTOR, login } from './helpers';

// Exercises the second demo account (doctor@example.com). The login flow and
// Profile page are shared with the patient, but this verifies the role-specific
// details (name/email/role) render correctly for the healthcare provider.
test.describe('Doctor demo account (AuthContext MOCK_USERS)', () => {
  test('logging in as the doctor lands on the dashboard overview', async ({ page }) => {
    await login(page, DEMO_DOCTOR);
    await expect(
      page.getByRole('heading', { level: 1, name: `Welcome back, ${DEMO_DOCTOR.name}` }),
    ).toBeVisible();
  });

  test('the account menu shows the doctor name and Profile surfaces their details', async ({ page }) => {
    await login(page, DEMO_DOCTOR);

    await expect(page.getByRole('button', { name: new RegExp(DEMO_DOCTOR.name) })).toBeVisible();

    await page.goto('/dashboard/profile');
    await expect(page.getByRole('heading', { level: 1, name: 'Profile' })).toBeVisible();

    const content = page.locator('main');
    await expect(content.getByText(DEMO_DOCTOR.name)).toBeVisible();
    await expect(content.getByText(DEMO_DOCTOR.email)).toBeVisible();
    await expect(content.getByText(DEMO_DOCTOR.role, { exact: true })).toBeVisible();
  });
});
