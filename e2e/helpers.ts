import { expect, Page } from '@playwright/test';

export const DEMO_PATIENT = { email: 'patient@example.com', password: 'demo123' };
export const DEMO_DOCTOR = { email: 'doctor@example.com', password: 'demo123' };

/**
 * Logs in through the Auth form and waits until the dashboard is rendered.
 */
export async function login(
  page: Page,
  credentials: { email: string; password: string } = DEMO_PATIENT
): Promise<void> {
  await page.goto('/auth');
  await page.getByLabel('Email').fill(credentials.email);
  await page.getByLabel('Password').fill(credentials.password);
  // Persist the session so it survives a full page reload (e.g. deep-linking).
  await page.getByLabel('Remember me').check();
  await page.getByRole('button', { name: 'Sign In', exact: true }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
}
