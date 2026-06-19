import { Page } from '@playwright/test';

export async function loginAsPatient(page: Page) {
  await page.goto('/auth');
  await page.fill('#email', 'patient@example.com');
  await page.fill('#password', 'demo123');
  await page.click('button[type="submit"]');
  await page.waitForURL('/dashboard');
}

export async function loginAsDoctor(page: Page) {
  await page.goto('/auth');
  await page.fill('#email', 'doctor@example.com');
  await page.fill('#password', 'demo123');
  await page.click('button[type="submit"]');
  await page.waitForURL('/dashboard');
}
