import { test, expect, Page } from '@playwright/test';

test.describe('Landing page navigation links', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('anchor target sections exist', async ({ page }) => {
    await expect(page.locator('section#features')).toBeVisible();
    await expect(page.locator('section#support')).toBeVisible();
  });

  test('desktop nav Products link points to #features', async ({ page }) => {
    const link = page.locator('header nav a', { hasText: 'Products' });
    await expect(link).toHaveAttribute('href', '#features');
    await link.click();
    await expect(page).toHaveURL(/#features$/);
  });

  test('desktop nav Support link points to #support', async ({ page }) => {
    const link = page.locator('header nav a', { hasText: 'Support' });
    await expect(link).toHaveAttribute('href', '#support');
    await link.click();
    await expect(page).toHaveURL(/#support$/);
  });

  test('desktop nav Healthcare Professionals navigates to /auth', async ({ page }) => {
    await page.locator('header nav a', { hasText: 'Healthcare Professionals' }).click();
    await expect(page).toHaveURL(/\/auth$/);
  });
});

test.describe('Landing page mobile menu', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  const mobileMenu = (page: Page) => page.locator('header div.md\\:hidden.bg-white');

  const openMobileMenu = async (page: Page) => {
    await page.locator('header button.md\\:hidden').click();
    await expect(mobileMenu(page)).toBeVisible();
  };

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await openMobileMenu(page);
  });

  test('Products link points to #features', async ({ page }) => {
    const link = mobileMenu(page).locator('a', { hasText: 'Products' });
    await expect(link).toHaveAttribute('href', '#features');
    await link.click();
    await expect(page).toHaveURL(/#features$/);
  });

  test('Support link points to #support', async ({ page }) => {
    const link = mobileMenu(page).locator('a', { hasText: 'Support' });
    await expect(link).toHaveAttribute('href', '#support');
    await link.click();
    await expect(page).toHaveURL(/#support$/);
  });

  test('Healthcare Professionals navigates to /auth', async ({ page }) => {
    await mobileMenu(page).locator('a', { hasText: 'Healthcare Professionals' }).click();
    await expect(page).toHaveURL(/\/auth$/);
  });
});

test.describe('Landing page footer links', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('MiniMed 780G links to #features', async ({ page }) => {
    const link = page.locator('footer a', { hasText: 'MiniMed 780G' });
    await expect(link).toHaveAttribute('href', '#features');
    await link.click();
    await expect(page).toHaveURL(/#features$/);
  });

  test('CareLink Software navigates to /auth', async ({ page }) => {
    await page.locator('footer a', { hasText: 'CareLink Software' }).click();
    await expect(page).toHaveURL(/\/auth$/);
  });

  test('Support column links point to #support', async ({ page }) => {
    for (const name of ['Customer Service', 'Training', 'Resources']) {
      await expect(page.locator('footer a', { hasText: name })).toHaveAttribute('href', '#support');
    }
    const link = page.locator('footer a', { hasText: 'Customer Service' });
    await link.click();
    await expect(page).toHaveURL(/#support$/);
  });

  test('placeholder links are marked as coming soon', async ({ page }) => {
    const placeholders = [
      'Guardian Sensors',
      'About Us',
      'Careers',
      'Contact',
      'Privacy Policy',
      'Terms of Use',
      'Regulatory',
    ];
    for (const name of placeholders) {
      const link = page.locator('footer a', { hasText: name });
      await expect(link).toHaveAttribute('href', '#');
      await expect(link).toHaveAttribute('aria-disabled', 'true');
      await expect(link).toHaveAttribute('title', 'Coming soon');
    }
  });
});
