import { Page, expect } from '@playwright/test';

/**
 * Logs in using the demo account buttons on the Auth page and waits for the
 * dashboard to load. Defaults to the demo patient account.
 */
export async function loginAsDemo(page: Page, role: 'patient' | 'doctor' = 'patient') {
  const buttonName = role === 'patient' ? 'Demo Patient Account' : 'Demo Healthcare Provider';
  await page.goto('/auth');
  await page.getByRole('button', { name: buttonName }).click();
  await page.waitForURL('**/dashboard');
  await expect(page.getByRole('link', { name: /MiniMed.*Dashboard/ })).toBeVisible();
}

/**
 * Logs in by filling the email/password form with the given credentials.
 */
export async function loginWithForm(page: Page, email: string, password: string) {
  await page.goto('/auth');
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password', { exact: true }).fill(password);
  await page.getByRole('button', { name: 'Sign In', exact: true }).click();
}
