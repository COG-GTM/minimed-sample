import { test, expect, Page } from '@playwright/test';

test.describe('Landing page anchor navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('anchor target sections exist with scroll offset', async ({ page }) => {
    await expect(page.locator('section#products')).toBeVisible();
    await expect(page.locator('section#healthcare')).toBeVisible();
    await expect(page.locator('section#support')).toBeVisible();
    for (const id of ['products', 'healthcare', 'support']) {
      await expect(page.locator(`section#${id}`)).toHaveClass(/scroll-mt-20/);
    }
  });

  test('desktop nav Products link points to #products and scrolls', async ({ page }) => {
    const link = page.locator('header nav a', { hasText: 'Products' });
    await expect(link).toHaveAttribute('href', '#products');
    await link.click();
    await expect(page).toHaveURL(/#products$/);
  });

  test('desktop nav Support link points to #support and scrolls', async ({ page }) => {
    const link = page.locator('header nav a', { hasText: 'Support' });
    await expect(link).toHaveAttribute('href', '#support');
    await link.click();
    await expect(page).toHaveURL(/#support$/);
    await expect
      .poll(async () =>
        page.locator('section#support').evaluate((el) => Math.round(el.getBoundingClientRect().top))
      )
      .toBeLessThan(200);
  });

  test('desktop nav Healthcare Professionals link points to #healthcare and scrolls', async ({ page }) => {
    const link = page.locator('header nav a', { hasText: 'Healthcare Professionals' });
    await expect(link).toHaveAttribute('href', '#healthcare');
    await link.click();
    await expect(page).toHaveURL(/#healthcare$/);
    await expect
      .poll(async () =>
        page.locator('section#healthcare').evaluate((el) => Math.round(el.getBoundingClientRect().top))
      )
      .toBeLessThan(200);
  });

  test('html has smooth scroll behavior', async ({ page }) => {
    const behavior = await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior);
    expect(behavior).toBe('smooth');
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

  for (const [label, hash] of [
    ['Products', '#products'],
    ['Support', '#support'],
    ['Healthcare Professionals', '#healthcare'],
  ] as const) {
    test(`${label} link points to ${hash} and closes the menu on click`, async ({ page }) => {
      const link = mobileMenu(page).locator('a', { hasText: label });
      await expect(link).toHaveAttribute('href', hash);
      await link.click();
      await expect(page).toHaveURL(new RegExp(`${hash}$`));
      await expect(mobileMenu(page)).toBeHidden();
    });
  }
});
