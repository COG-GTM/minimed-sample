import { test, expect } from '@playwright/test';

const publicPages = [
  { link: 'Products', path: '/products', heading: 'Products' },
  { link: 'Support', path: '/support', heading: 'Support' },
  { link: 'Healthcare Professionals', path: '/healthcare', heading: 'Healthcare Professionals' },
];

test.describe('Public header desktop navigation', () => {
  for (const p of publicPages) {
    test(`header link "${p.link}" navigates to ${p.path}`, async ({ page }) => {
      await page.goto('/');
      await page.locator('header nav').getByRole('link', { name: p.link, exact: true }).click();
      await expect(page).toHaveURL(new RegExp(`${p.path}$`));
      await expect(page.getByRole('heading', { level: 1, name: p.heading })).toBeVisible();
    });
  }

  test('logo link navigates back to landing', async ({ page }) => {
    await page.goto('/products');
    await page.locator('header').getByRole('link', { name: /MiniMed/ }).first().click();
    await expect(page).toHaveURL(/\/$/);
  });

  test('Sign In button navigates to /auth', async ({ page }) => {
    await page.goto('/');
    await page.locator('header').getByRole('button', { name: 'Sign In' }).click();
    await expect(page).toHaveURL(/\/auth$/);
  });

  test('public pages are directly reachable by URL', async ({ page }) => {
    for (const p of publicPages) {
      await page.goto(p.path);
      await expect(page.getByRole('heading', { level: 1, name: p.heading })).toBeVisible();
    }
  });
});

test.describe('Public header mobile navigation', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  for (const p of publicPages) {
    test(`mobile menu link "${p.link}" navigates to ${p.path}`, async ({ page }) => {
      await page.goto('/');
      await page.locator('header button.md\\:hidden').click();
      await page.locator('header div.md\\:hidden').getByRole('link', { name: p.link, exact: true }).click();
      await expect(page).toHaveURL(new RegExp(`${p.path}$`));
      await expect(page.getByRole('heading', { level: 1, name: p.heading })).toBeVisible();
    });
  }

  test('mobile menu Sign In navigates to /auth', async ({ page }) => {
    await page.goto('/');
    await page.locator('header button.md\\:hidden').click();
    await page.locator('header div.md\\:hidden').getByRole('button', { name: 'Sign In' }).click();
    await expect(page).toHaveURL(/\/auth$/);
  });
});
