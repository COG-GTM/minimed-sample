import { Page, expect } from '@playwright/test';

/**
 * Logs in using the demo patient account and waits for the dashboard to load.
 * The patient account belongs to "Sarah Johnson".
 */
export async function loginAsPatient(page: Page) {
  await page.goto('/auth');
  await page.getByLabel('Email').fill('patient@example.com');
  await page.getByLabel('Password', { exact: true }).fill('demo123');
  // "Remember me" persists the session in localStorage so auth survives full
  // page reloads (page.goto), which AuthContext only restores from localStorage.
  await page.getByLabel('Remember me').check();
  await page.getByRole('button', { name: 'Sign In', exact: true }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByRole('heading', { name: /Welcome back/ })).toBeVisible();
}

/**
 * Logs in using the demo doctor account ("Dr. Michael Chen").
 */
export async function loginAsDoctor(page: Page) {
  await page.goto('/auth');
  await page.getByLabel('Email').fill('doctor@example.com');
  await page.getByLabel('Password', { exact: true }).fill('demo123');
  await page.getByLabel('Remember me').check();
  await page.getByRole('button', { name: 'Sign In', exact: true }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
}
