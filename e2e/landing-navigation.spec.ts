import { test, expect } from '@playwright/test';

test.describe('Landing page navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Products link scrolls to features section', async ({ page }) => {
    const productsLink = page.locator('header nav a[href="#features"]');
    await expect(productsLink).toBeVisible();
    await productsLink.click();
    await expect(page).toHaveURL(/#features/);
  });

  test('Support link scrolls to support section', async ({ page }) => {
    const supportLink = page.locator('header nav a[href="#support"]');
    await expect(supportLink).toBeVisible();
    await supportLink.click();
    await expect(page).toHaveURL(/#support/);
  });

  test('Healthcare Professionals button navigates to auth', async ({ page }) => {
    await page.locator('header nav button', { hasText: /Healthcare/ }).click();
    await expect(page).toHaveURL('/auth');
  });

  test('Sign In button navigates to auth page', async ({ page }) => {
    await page.locator('header').getByRole('button', { name: /Sign In/i }).click();
    await expect(page).toHaveURL('/auth');
  });

  test('features section has id="features"', async ({ page }) => {
    const featuresSection = page.locator('section#features');
    await expect(featuresSection).toBeVisible();
    await expect(featuresSection.getByText('Comprehensive Diabetes Management')).toBeVisible();
  });

  test('support section has id="support"', async ({ page }) => {
    const supportSection = page.locator('section#support');
    await expect(supportSection).toBeVisible();
    await expect(supportSection.getByText('Ready to Take Control?')).toBeVisible();
  });

  test('footer MiniMed 780G links to features', async ({ page }) => {
    const footerLink = page.locator('footer a[href="#features"]', { hasText: 'MiniMed 780G' });
    await expect(footerLink).toBeVisible();
  });

  test('footer CareLink navigates to auth', async ({ page }) => {
    const careLinkButton = page.locator('footer button', { hasText: 'CareLink Software' });
    await expect(careLinkButton).toBeVisible();
    await careLinkButton.click();
    await expect(page).toHaveURL('/auth');
  });

  test('footer support links point to #support', async ({ page }) => {
    const supportLinks = page.locator('footer a[href="#support"]');
    await expect(supportLinks).toHaveCount(3);
  });

  test('coming soon footer items are aria-disabled', async ({ page }) => {
    const disabledLinks = page.locator('footer a[aria-disabled="true"]');
    const count = await disabledLinks.count();
    expect(count).toBeGreaterThanOrEqual(6);
  });
});
