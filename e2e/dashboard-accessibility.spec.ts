import { test, expect, Page } from '@playwright/test';

async function loginAsPatient(page: Page) {
  await page.goto('/auth');
  await page.fill('#email', 'patient@example.com');
  await page.fill('#password', 'demo123');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/dashboard');
}

test.describe('Dashboard Page - Header Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsPatient(page);
  });

  test('skip navigation link exists and targets main content', async ({ page }) => {
    const skipLink = page.locator('a[href="#main-content"]');
    await expect(skipLink).toHaveCount(1);
    await expect(skipLink).toHaveText('Skip to main content');

    const main = page.locator('main#main-content');
    await expect(main).toBeAttached();
  });

  test('skip navigation link becomes visible on focus', async ({ page }) => {
    const skipLink = page.locator('a[href="#main-content"]');
    await skipLink.focus();
    await expect(skipLink).toBeVisible();
  });

  test('header has role="banner"', async ({ page }) => {
    const header = page.locator('header[role="banner"]');
    await expect(header).toBeAttached();
  });

  test('header actions nav has aria-label', async ({ page }) => {
    const nav = page.locator('nav[aria-label="Header actions"]');
    await expect(nav).toBeAttached();
  });

  test('sidebar toggle button has aria-expanded and aria-controls', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    const toggleBtn = page.locator('button[aria-controls="sidebar-nav"]');
    await expect(toggleBtn).toBeVisible();
    await expect(toggleBtn).toHaveAttribute('aria-expanded', 'false');
    await expect(toggleBtn).toHaveAttribute('aria-label', 'Open sidebar');
  });

  test('sidebar toggle updates aria-expanded on click', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    const toggleBtn = page.locator('button[aria-controls="sidebar-nav"]');

    await toggleBtn.click();
    await expect(toggleBtn).toHaveAttribute('aria-expanded', 'true');
    await expect(toggleBtn).toHaveAttribute('aria-label', 'Close sidebar');
  });

  test('sidebar closes on Escape key', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    const toggleBtn = page.locator('button[aria-controls="sidebar-nav"]');

    await toggleBtn.click();
    await expect(toggleBtn).toHaveAttribute('aria-expanded', 'true');

    await page.keyboard.press('Escape');
    await expect(toggleBtn).toHaveAttribute('aria-expanded', 'false');
  });

  test('sidebar has aria-label and contains labeled nav', async ({ page }) => {
    const sidebar = page.locator('aside[aria-label="Sidebar navigation"]');
    await expect(sidebar).toBeAttached();

    const innerNav = sidebar.locator('nav[aria-label="Dashboard sections"]');
    await expect(innerNav).toBeAttached();
  });

  test('active sidebar item has aria-current="page"', async ({ page }) => {
    const activeItem = page.locator('button[aria-current="page"]');
    await expect(activeItem).toHaveCount(1);
  });

  test('sidebar icon SVGs are aria-hidden', async ({ page }) => {
    const sidebar = page.locator('aside[aria-label="Sidebar navigation"]');
    const icons = sidebar.locator('svg[aria-hidden="true"]');
    const count = await icons.count();
    expect(count).toBeGreaterThanOrEqual(6);
  });

  test('notification bell has aria-label', async ({ page }) => {
    const bell = page.locator('button[aria-label*="Notifications"]');
    await expect(bell).toBeAttached();
  });

  test('notification bell icon is aria-hidden', async ({ page }) => {
    const bell = page.locator('button[aria-label*="Notifications"]');
    const icon = bell.locator('svg');
    await expect(icon).toHaveAttribute('aria-hidden', 'true');
  });

  test('user account dropdown has aria-label with user name', async ({ page }) => {
    const accountBtn = page.locator('button[aria-label*="Account menu for"]');
    await expect(accountBtn).toBeAttached();
  });

  test('dropdown icons are aria-hidden', async ({ page }) => {
    const accountBtn = page.locator('button[aria-label*="Account menu for"]');
    const icons = accountBtn.locator('svg[aria-hidden="true"]');
    const count = await icons.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('sidebar toggle menu icon is aria-hidden', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    const toggleBtn = page.locator('button[aria-controls="sidebar-nav"]');
    const icon = toggleBtn.locator('svg');
    await expect(icon).toHaveAttribute('aria-hidden', 'true');
  });

  test('mobile sidebar overlay has aria-hidden and role=presentation', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    const toggleBtn = page.locator('button[aria-controls="sidebar-nav"]');
    await toggleBtn.click();

    const overlay = page.locator('div[role="presentation"][aria-hidden="true"]');
    await expect(overlay).toBeAttached();
  });
});
