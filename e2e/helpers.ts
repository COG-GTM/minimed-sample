import { Page } from '@playwright/test';

export async function loginAsPatient(page: Page) {
  await page.goto('/auth');
  await page.getByPlaceholder('Enter your email').fill('patient@example.com');
  await page.getByPlaceholder('Enter your password').fill('demo123');
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.waitForURL('**/dashboard');
}
