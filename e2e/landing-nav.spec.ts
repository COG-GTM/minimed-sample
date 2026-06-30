import { test, expect } from '@playwright/test';

test.describe('Landing page navigation and footer links', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('navigation')).toBeVisible();
  });

  test('scroll-target sections exist with matching ids', async ({ page }) => {
    await expect(page.locator('section#features')).toHaveCount(1);
    await expect(page.locator('section#support')).toHaveCount(1);
  });

  test('desktop nav links point at the correct anchors', async ({ page }) => {
    const nav = page.getByRole('navigation');
    await expect(nav.getByRole('link', { name: 'Products' })).toHaveAttribute('href', '#features');
    await expect(nav.getByRole('link', { name: 'Support' })).toHaveAttribute('href', '#support');
  });

  test('clicking Products jumps to the features section', async ({ page }) => {
    await page.getByRole('navigation').getByRole('link', { name: 'Products' }).click();
    await expect(page).toHaveURL(/#features$/);
    await expect(page.locator('section#features')).toBeInViewport();
  });

  test('clicking Support jumps to the support section', async ({ page }) => {
    await page.getByRole('navigation').getByRole('link', { name: 'Support' }).click();
    await expect(page).toHaveURL(/#support$/);
    await expect(page.locator('section#support')).toBeInViewport();
  });

  test('Healthcare Professionals nav link routes to /auth', async ({ page }) => {
    await page.getByRole('navigation').getByRole('link', { name: 'Healthcare Professionals' }).click();
    await expect(page).toHaveURL(/\/auth$/);
    await expect(page.getByText('Welcome to MiniMed')).toBeVisible();
  });

  test('footer product/support links point at the correct anchors', async ({ page }) => {
    const footer = page.locator('footer');
    await expect(footer.getByRole('link', { name: 'MiniMed 780G' })).toHaveAttribute('href', '#features');
    await expect(footer.getByRole('link', { name: 'Customer Service' })).toHaveAttribute('href', '#support');
    await expect(footer.getByRole('link', { name: 'Training' })).toHaveAttribute('href', '#support');
    await expect(footer.getByRole('link', { name: 'Resources' })).toHaveAttribute('href', '#support');
  });

  test('footer CareLink Software link routes to /auth', async ({ page }) => {
    await page.locator('footer').getByRole('link', { name: 'CareLink Software' }).click();
    await expect(page).toHaveURL(/\/auth$/);
    await expect(page.getByText('Welcome to MiniMed')).toBeVisible();
  });

  test('coming-soon links are marked aria-disabled with a title', async ({ page }) => {
    const comingSoon = ['Guardian Sensors', 'About Us', 'Careers', 'Contact', 'Privacy Policy', 'Terms of Use', 'Regulatory'];
    const footer = page.locator('footer');
    for (const name of comingSoon) {
      const link = footer.getByRole('link', { name });
      await expect(link).toHaveAttribute('aria-disabled', 'true');
      await expect(link).toHaveAttribute('title', 'Coming soon');
    }
  });

  test('mobile menu links mirror desktop nav behavior', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await page.getByRole('button').filter({ has: page.locator('svg') }).last().click();
    const mobileMenu = page.locator('.md\\:hidden').filter({ hasText: 'Products' });
    await expect(mobileMenu.getByRole('link', { name: 'Products' })).toHaveAttribute('href', '#features');
    await expect(mobileMenu.getByRole('link', { name: 'Support' })).toHaveAttribute('href', '#support');
    await mobileMenu.getByRole('link', { name: 'Healthcare Professionals' }).click();
    await expect(page).toHaveURL(/\/auth$/);
  });
});
