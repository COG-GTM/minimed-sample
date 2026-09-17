import { Page, expect } from '@playwright/test';

export async function login(page: Page, role: 'patient' | 'doctor' = 'patient') {
  await page.goto('/auth');
  const email = role === 'patient' ? 'patient@example.com' : 'doctor@example.com';
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password', { exact: true }).fill('demo123');
  await page.getByLabel('Remember me').check();
  await page.getByRole('button', { name: 'Sign In', exact: true }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
}
