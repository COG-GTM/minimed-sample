import { test, expect, Page } from '@playwright/test';
import { login } from './helpers';

const NAV_ITEMS = [
  { label: 'Overview', sectionId: 'overview' },
  { label: 'Glucose Trend', sectionId: 'glucose-trend' },
  { label: 'Time in Range', sectionId: 'time-in-range' },
  { label: 'Recent Activity', sectionId: 'recent-activity' },
];

const headerNav = (page: Page) =>
  page.getByRole('navigation', { name: 'Dashboard sections' });

test.describe('Dashboard header quick navigation (desktop)', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('shows all section links in the header nav', async ({ page }) => {
    const nav = headerNav(page);
    await expect(nav).toBeVisible();
    for (const item of NAV_ITEMS) {
      await expect(nav.getByRole('button', { name: item.label })).toBeVisible();
    }
  });

  test('section nav dropdown is hidden on large screens', async ({ page }) => {
    await expect(
      page.getByRole('button', { name: 'Dashboard navigation' })
    ).toBeHidden();
  });

  for (const item of NAV_ITEMS.slice(1)) {
    test(`clicking "${item.label}" scrolls its section into view`, async ({ page }) => {
      await headerNav(page).getByRole('button', { name: item.label }).click();
      await expect(page.locator(`#${item.sectionId}`)).toBeInViewport();
    });
  }

  test('clicked section link becomes highlighted as active', async ({ page }) => {
    const link = headerNav(page).getByRole('button', { name: 'Recent Activity' });
    await link.click();
    await expect(page.locator('#recent-activity')).toBeInViewport();
    await expect(link).toHaveClass(/bg-white\/20/);
  });

  test('active highlight stays on the clicked link after scrolling settles', async ({ page }) => {
    const nav = headerNav(page);
    const link = nav.getByRole('button', { name: 'Time in Range' });
    await link.click();
    await expect(link).toHaveClass(/bg-white\/20/);
    await expect(page.locator('#time-in-range')).toBeInViewport();
    await page.waitForTimeout(1200);
    await expect(link).toHaveClass(/bg-white\/20/);
    for (const other of NAV_ITEMS.filter((i) => i.label !== 'Time in Range')) {
      await expect(nav.getByRole('button', { name: other.label })).not.toHaveClass(/bg-white\/20/);
    }
  });

  test('manual wheel scroll after a nav click resumes scroll-based highlighting', async ({ page }) => {
    const nav = headerNav(page);
    const clicked = nav.getByRole('button', { name: 'Recent Activity' });
    await clicked.click();
    await expect(page.locator('#recent-activity')).toBeInViewport();
    await expect(clicked).toHaveClass(/bg-white\/20/);

    await page.mouse.wheel(0, -20000);
    await expect(nav.getByRole('button', { name: 'Overview' })).toHaveClass(/bg-white\/20/);
    await expect(clicked).not.toHaveClass(/bg-white\/20/);
  });

  test('clicking the dashboard title scrolls back to top', async ({ page }) => {
    await headerNav(page).getByRole('button', { name: 'Recent Activity' }).click();
    await expect
      .poll(async () => page.evaluate(() => window.scrollY))
      .toBeGreaterThan(0);

    await page.getByRole('button', { name: /MiniMed.*Dashboard/ }).click();
    await expect
      .poll(async () => page.evaluate(() => window.scrollY))
      .toBe(0);
  });

  test('sections have ids and sticky-header scroll margin', async ({ page }) => {
    for (const item of NAV_ITEMS) {
      const section = page.locator(`#${item.sectionId}`);
      await expect(section).toHaveCount(1);
      await expect(section).toHaveClass(/scroll-mt-20/);
    }
  });

  test('user menu still works: sign out returns to landing page', async ({ page }) => {
    await page.getByRole('button', { name: /Sarah Johnson/ }).click();
    await page.getByRole('menuitem', { name: 'Sign out' }).click();
    await expect(page).toHaveURL(/\/$/);
  });
});

test.describe('Dashboard header quick navigation (mobile)', () => {
  test.use({ viewport: { width: 480, height: 800 } });

  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('inline nav is hidden and dropdown trigger is shown', async ({ page }) => {
    await expect(headerNav(page)).toBeHidden();
    await expect(
      page.getByRole('button', { name: 'Dashboard navigation' })
    ).toBeVisible();
  });

  test('dropdown lists all sections and navigates on click', async ({ page }) => {
    await page.getByRole('button', { name: 'Dashboard navigation' }).click();
    await expect(page.getByText('Dashboard sections')).toBeVisible();
    for (const item of NAV_ITEMS) {
      await expect(page.getByRole('menuitem', { name: item.label })).toBeVisible();
    }
    await page.getByRole('menuitem', { name: 'Recent Activity' }).click();
    await expect(page.locator('#recent-activity')).toBeInViewport();
  });

  test('sidebar toggle still opens and closes the sidebar', async ({ page }) => {
    const toggle = page.getByRole('button', { name: 'Open sidebar' });
    await expect(toggle).toBeVisible();
    await toggle.click();
    await expect(page.getByRole('button', { name: 'Close sidebar' })).toBeVisible();
    await page.getByRole('button', { name: 'Close sidebar' }).click();
    await expect(page.getByRole('button', { name: 'Open sidebar' })).toBeVisible();
  });
});
