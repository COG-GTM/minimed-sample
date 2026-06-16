import { Page, expect } from '@playwright/test';

export const DEMO_PATIENT = {
  email: 'patient@example.com',
  password: 'demo123',
  name: 'Sarah Johnson',
  role: 'patient',
};

export const DEMO_DOCTOR = {
  email: 'doctor@example.com',
  password: 'demo123',
  name: 'Dr. Michael Chen',
  role: 'healthcare_provider',
};

/**
 * Logs in through the /auth form using the given credentials and waits until
 * the protected dashboard overview has rendered.
 */
export async function login(
  page: Page,
  credentials: { email: string; password: string } = DEMO_PATIENT,
): Promise<void> {
  await page.goto('/auth');
  await page.getByLabel('Email').fill(credentials.email);
  await page.getByLabel('Password', { exact: true }).fill(credentials.password);
  // Persist to localStorage so authentication survives full page reloads
  // (deep links / direct navigation), which AuthContext restores on mount.
  await page.getByLabel('Remember me').check();
  await page.getByRole('button', { name: 'Sign In', exact: true }).click();
  await expect(page).toHaveURL('/dashboard');
  await expect(
    page.getByRole('heading', { level: 1, name: /Welcome back/ }),
  ).toBeVisible();
}

/** The sidebar navigation rail (visible at desktop widths). */
export function sidebar(page: Page) {
  return page.locator('aside nav');
}
