import { Page } from '@playwright/test';

// Check "Remember me" so the session is persisted to localStorage, which
// AuthContext restores on a full page reload (page.goto). Without it the
// session lives only in sessionStorage and is lost on direct navigation.
export async function loginAsPatient(page: Page) {
  await page.goto('/auth');
  await page.fill('#email', 'patient@example.com');
  await page.fill('#password', 'demo123');
  await page.check('#remember');
  await page.click('button[type="submit"]');
  await page.waitForURL('/dashboard');
}

export async function loginAsDoctor(page: Page) {
  await page.goto('/auth');
  await page.fill('#email', 'doctor@example.com');
  await page.fill('#password', 'demo123');
  await page.check('#remember');
  await page.click('button[type="submit"]');
  await page.waitForURL('/dashboard');
}
