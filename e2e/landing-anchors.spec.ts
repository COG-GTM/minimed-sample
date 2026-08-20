import { test, expect, Page } from '@playwright/test';

test.describe('Landing page anchor navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('anchor target elements exist', async ({ page }) => {
    for (const id of ['home', 'products', 'healthcare', 'support', 'legal']) {
      await expect(page.locator(`#${id}`)).toBeAttached();
    }
  });

  test('anchor sections have scroll offset for the sticky header', async ({ page }) => {
    for (const id of ['home', 'products', 'healthcare', 'support']) {
      const margin = await page
        .locator(`#${id}`)
        .evaluate((el) => getComputedStyle(el).scrollMarginTop);
      expect(margin, `#${id} scroll-margin-top`).toBe('80px');
    }
  });

  test('html has smooth scroll behavior', async ({ page }) => {
    const behavior = await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior
    );
    expect(behavior).toBe('smooth');
  });

  for (const [label, hash] of [
    ['Products', '#products'],
    ['Support', '#support'],
    ['Healthcare Professionals', '#healthcare'],
  ] as const) {
    test(`desktop nav ${label} link points to ${hash} and scrolls`, async ({ page }) => {
      const link = page.locator('header nav a', { hasText: label });
      await expect(link).toHaveAttribute('href', hash);
      await link.click();
      await expect(page).toHaveURL(new RegExp(`${hash}$`));
      await expect(page.locator(hash)).toBeInViewport();
    });
  }

  test('footer links point to on-page anchors', async ({ page }) => {
    const cases: Array<[string, string]> = [
      ['MiniMed 780G', '#products'],
      ['Guardian Sensors', '#products'],
      ['CareLink Software', '#products'],
      ['Customer Service', '#healthcare'],
      ['Training', '#healthcare'],
      ['Resources', '#healthcare'],
      ['About Us', '#home'],
      ['Careers', '#home'],
      ['Contact', '#home'],
      ['Privacy Policy', '#legal'],
      ['Terms of Use', '#legal'],
      ['Regulatory', '#legal'],
    ];
    for (const [label, hash] of cases) {
      await expect(page.locator('footer a', { hasText: label })).toHaveAttribute('href', hash);
    }
  });

  test('footer About Us link scrolls back to the hero section', async ({ page }) => {
    await page.locator('footer').scrollIntoViewIfNeeded();
    await page.locator('footer a', { hasText: 'About Us' }).click();
    await expect(page).toHaveURL(/#home$/);
    await expect
      .poll(async () =>
        page.locator('#home').evaluate((el) => Math.round(el.getBoundingClientRect().top))
      )
      .toBeLessThan(200);
  });
});

test.describe('Landing page mobile menu', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  const mobileMenu = (page: Page) => page.locator('header div.md\\:hidden.bg-white');

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.locator('header button.md\\:hidden').click();
    await expect(mobileMenu(page)).toBeVisible();
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
