import { test, expect } from '@playwright/test';
import { login } from './helpers';

test.describe('Landing header (desktop)', () => {
  test('skip link is the first tab stop and moves focus to main content', async ({ page }) => {
    await page.goto('/');
    const skip = page.getByRole('link', { name: 'Skip to main content' });
    await expect(skip).toHaveAttribute('href', '#main-content');
    await page.keyboard.press('Tab');
    await expect(skip).toBeFocused();
    await expect(skip).toBeInViewport();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/#main-content$/);
    await expect(page.locator('main#main-content')).toBeFocused();
  });

  test('brand logo links home', async ({ page }) => {
    await page.goto('/#support');
    const brand = page.locator('header').getByRole('link', { name: /MiniMed/ });
    await expect(brand).toHaveAttribute('href', '/');
    await brand.click();
    await expect(page).toHaveURL(/\/$/);
  });

  test('nav links target real section anchors and scroll to them', async ({ page }) => {
    await page.goto('/');
    const nav = page.locator('header nav').first();
    await expect(nav.getByRole('link', { name: 'Products' })).toHaveAttribute('href', '#products');
    await expect(nav.getByRole('link', { name: 'Support' })).toHaveAttribute('href', '#support');
    await expect(nav.getByRole('link', { name: 'Healthcare Professionals' })).toHaveAttribute('href', '#healthcare');

    await nav.getByRole('link', { name: 'Healthcare Professionals' }).click();
    await expect(page).toHaveURL(/#healthcare$/);
    await expect(page.locator('section#healthcare')).toBeInViewport();

    await nav.getByRole('link', { name: 'Support' }).click();
    await expect(page).toHaveURL(/#support$/);
    await expect(page.locator('section#support')).toBeInViewport();
  });

  test('sticky header stays visible and gains shadow after scrolling', async ({ page }) => {
    await page.goto('/');
    const header = page.locator('header');
    await expect(header).toHaveClass(/shadow-sm/);
    await expect(header).not.toHaveClass(/shadow-xl/);
    await page.mouse.wheel(0, 800);
    await expect(header).toHaveClass(/shadow-xl/);
    await expect(header).toHaveClass(/backdrop-blur-lg/);
    await expect(header).toBeInViewport();
    await page.evaluate(() => window.scrollTo(0, 0));
    await expect(header).toHaveClass(/shadow-sm/);
  });

  test('shows Sign In when signed out and navigates to /auth', async ({ page }) => {
    await page.goto('/');
    const header = page.locator('header');
    await expect(header.getByRole('button', { name: 'Dashboard', exact: true })).toHaveCount(0);
    await header.getByRole('button', { name: 'Sign In' }).click();
    await expect(page).toHaveURL(/\/auth$/);
  });

  test('shows Dashboard instead of Sign In when authenticated', async ({ page }) => {
    await login(page);
    await page.goto('/');
    const header = page.locator('header');
    await expect(header.getByRole('button', { name: 'Sign In' })).toHaveCount(0);
    await header.getByRole('button', { name: 'Dashboard', exact: true }).click();
    await expect(page).toHaveURL(/\/dashboard$/);
  });

  test('desktop nav is hidden below the lg breakpoint', async ({ page }) => {
    await page.setViewportSize({ width: 1000, height: 800 });
    await page.goto('/');
    await expect(page.locator('header nav').first().getByRole('link', { name: 'Products' })).toBeHidden();
    await expect(page.getByRole('button', { name: 'Open menu' })).toBeVisible();
  });

  test('localized labels update when the language changes', async ({ page }) => {
    await page.goto('/');
    await page.locator('header').getByRole('button', { name: /English/ }).click();
    await page.getByRole('menuitem', { name: /Español/ }).click();
    const nav = page.locator('header nav').first();
    await expect(nav.getByRole('link', { name: 'Productos' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Profesionales de la Salud' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Saltar al contenido principal' })).toHaveAttribute('href', '#main-content');
  });
});

test.describe('Landing header (mobile)', () => {
  test.use({ viewport: { width: 375, height: 740 } });

  test('menu toggle exposes aria state and opens/closes the menu', async ({ page }) => {
    await page.goto('/');
    const toggle = page.getByRole('button', { name: 'Open menu' });
    const menu = page.locator('nav#landing-menu');
    await expect(toggle).toHaveAttribute('aria-controls', 'landing-menu');
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(menu).toBeHidden();

    await toggle.click();
    const close = page.getByRole('button', { name: 'Close menu' });
    await expect(close).toHaveAttribute('aria-expanded', 'true');
    await expect(menu).toBeVisible();
    await expect(menu.getByRole('link', { name: 'Products' })).toHaveAttribute('href', '#products');

    await close.click();
    await expect(menu).toBeHidden();
    await expect(page.getByRole('button', { name: 'Open menu' })).toHaveAttribute('aria-expanded', 'false');
  });

  test('Escape closes the menu and returns focus to the toggle', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Open menu' }).click();
    const menu = page.locator('nav#landing-menu');
    await expect(menu).toBeVisible();
    await menu.getByRole('link', { name: 'Support' }).focus();
    await page.keyboard.press('Escape');
    await expect(menu).toBeHidden();
    await expect(page.getByRole('button', { name: 'Open menu' })).toBeFocused();
  });

  test('clicking a menu link closes the menu and scrolls to the section', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Open menu' }).click();
    const menu = page.locator('nav#landing-menu');
    await menu.getByRole('link', { name: 'Healthcare Professionals' }).click();
    await expect(menu).toBeHidden();
    await expect(page).toHaveURL(/#healthcare$/);
    await expect(page.locator('section#healthcare')).toBeInViewport();
  });

  test('mobile Sign In closes menu and navigates to /auth', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Open menu' }).click();
    const menu = page.locator('nav#landing-menu');
    await expect(menu.getByRole('button', { name: 'Go to Dashboard' })).toHaveCount(0);
    await menu.getByRole('button', { name: 'Sign In' }).click();
    await expect(page).toHaveURL(/\/auth$/);
  });

  test('mobile menu shows Go to Dashboard when authenticated', async ({ page }) => {
    await login(page);
    await page.goto('/');
    await page.getByRole('button', { name: 'Open menu' }).click();
    const menu = page.locator('nav#landing-menu');
    await expect(menu.getByRole('button', { name: 'Sign In' })).toHaveCount(0);
    await menu.getByRole('button', { name: 'Go to Dashboard' }).click();
    await expect(page).toHaveURL(/\/dashboard$/);
  });
});
