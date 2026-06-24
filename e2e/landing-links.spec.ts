import { test, expect } from '@playwright/test';

test.describe('Landing page navigation links', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('desktop nav Products link scrolls to features section', async ({ page }) => {
    const productsLink = page.locator('header nav a[href="#features"]');
    await expect(productsLink).toBeVisible();
    await productsLink.click();
    await expect(page).toHaveURL(/#features/);
  });

  test('desktop nav Support link scrolls to support section', async ({ page }) => {
    const supportLink = page.locator('header nav a[href="#support"]');
    await expect(supportLink).toBeVisible();
    await supportLink.click();
    await expect(page).toHaveURL(/#support/);
  });

  test('desktop nav Healthcare Professionals navigates to auth', async ({ page }) => {
    const healthcareBtn = page.locator('header nav button');
    await expect(healthcareBtn).toBeVisible();
    await healthcareBtn.click();
    await expect(page).toHaveURL(/\/auth/);
  });

  test('Sign In button navigates to auth page', async ({ page }) => {
    await page.locator('header').getByRole('button', { name: /sign in/i }).click();
    await expect(page).toHaveURL(/\/auth/);
  });

  test('features section exists with id="features"', async ({ page }) => {
    const featuresSection = page.locator('section#features');
    await expect(featuresSection).toBeVisible();
  });

  test('support/CTA section exists with id="support"', async ({ page }) => {
    const supportSection = page.locator('section#support');
    await expect(supportSection).toBeVisible();
  });

  test('hero CTA button navigates to auth', async ({ page }) => {
    const heroSection = page.locator('section.relative.overflow-hidden');
    const ctaButton = heroSection.getByRole('button').first();
    await ctaButton.click();
    await expect(page).toHaveURL(/\/auth/);
  });

  test('footer MiniMed 780G link points to #features', async ({ page }) => {
    const footer = page.locator('footer');
    const link = footer.getByRole('link', { name: /minimed 780g/i });
    await expect(link).toHaveAttribute('href', '#features');
  });

  test('footer CareLink link navigates to auth', async ({ page }) => {
    const footer = page.locator('footer');
    const carelinkLink = footer.getByRole('button', { name: /carelink/i });
    await carelinkLink.click();
    await expect(page).toHaveURL(/\/auth/);
  });

  test('footer support links point to #support', async ({ page }) => {
    const footer = page.locator('footer');
    const supportLinks = footer.locator('a[href="#support"]');
    const count = await supportLinks.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('footer disabled links have aria-disabled and coming soon title', async ({ page }) => {
    const footer = page.locator('footer');
    const disabledLinks = footer.locator('a[aria-disabled="true"]');
    const count = await disabledLinks.count();
    expect(count).toBeGreaterThanOrEqual(1);
    const firstDisabled = disabledLinks.first();
    await expect(firstDisabled).toHaveAttribute('title', 'Coming soon');
  });

  test('CTA section "Start Your Journey" button navigates to auth', async ({ page }) => {
    const ctaSection = page.locator('section#support');
    await ctaSection.getByRole('button', { name: /start your journey/i }).click();
    await expect(page).toHaveURL(/\/auth/);
  });
});
