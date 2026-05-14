import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('displays MiniMed branding', async ({ page }) => {
    await expect(page.locator('header')).toContainText('MiniMed');
  });

  test('nav links are visible', async ({ page }) => {
    const nav = page.locator('nav');
    await expect(nav.getByText('Products')).toBeVisible();
    await expect(nav.getByText('Support')).toBeVisible();
    await expect(nav.getByText('Healthcare Professionals')).toBeVisible();
  });

  test('Sign In button navigates to /auth', async ({ page }) => {
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page).toHaveURL('/auth');
  });

  test('language dropdown is present and switching to Spanish changes nav text', async ({ page }) => {
    // Verify the language dropdown trigger is visible
    const langTrigger = page.locator('button', { hasText: 'English' });
    await expect(langTrigger.first()).toBeVisible();

    // Click the language dropdown and select Spanish
    await langTrigger.first().click();
    await page.getByText('Espa\u00f1ol').click();

    // Verify nav items changed to Spanish
    const nav = page.locator('nav');
    await expect(nav.getByText('Productos')).toBeVisible();
    await expect(nav.getByText('Soporte')).toBeVisible();
    await expect(nav.getByText('Profesionales de la Salud')).toBeVisible();

    // Verify Sign In button text changed
    await expect(page.getByRole('button', { name: 'Iniciar Sesi\u00f3n' })).toBeVisible();
  });

  test('mobile menu toggle opens menu with nav links', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Mobile-only test');

    // On mobile, the hamburger icon should be visible
    const menuButton = page.locator('button').filter({ has: page.locator('svg.lucide-menu') });
    await expect(menuButton).toBeVisible();

    // Click the hamburger to open the mobile menu
    await menuButton.click();

    // Verify nav links are visible in mobile menu
    const mobileMenu = page.locator('.md\\:hidden.bg-white');
    await expect(mobileMenu.getByText('Products')).toBeVisible();
    await expect(mobileMenu.getByText('Support')).toBeVisible();
    await expect(mobileMenu.getByText('Healthcare Professionals')).toBeVisible();
    await expect(mobileMenu.getByText('Sign In')).toBeVisible();
  });

  test('hero section displays translated title text', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Advanced Diabetes Management');
  });
});
