import { test, expect } from '@playwright/test';
import { login } from './helpers';

test.describe('Dashboard header', () => {
  test('brand links to dashboard and active section title is shown', async ({ page }) => {
    await login(page);
    const header = page.locator('header');
    await expect(header.getByRole('link', { name: /MiniMed/ })).toHaveAttribute('href', '/dashboard');
    await expect(header.getByText('Overview', { exact: true })).toBeVisible();
    await header.getByRole('link', { name: /MiniMed/ }).click();
    await expect(page).toHaveURL(/\/dashboard$/);
  });

  test('skip link moves focus to main content', async ({ page }) => {
    await login(page);
    await page.reload();
    const skipLink = page.getByRole('link', { name: 'Skip to main content' });
    await expect(skipLink).toBeAttached();
    await expect(page.locator('main#main-content')).toBeVisible();
    await expect(async () => {
      await page.locator('body').focus();
      await page.keyboard.press('Tab');
      await expect(skipLink).toBeFocused({ timeout: 1000 });
    }).toPass();
    await page.keyboard.press('Enter');
    await expect(page.locator('main#main-content')).toBeFocused();
  });

  test('notifications dropdown shows unread badge and marks all as read', async ({ page }) => {
    await login(page);
    const bell = page.getByRole('button', { name: 'Notifications (3)' });
    await expect(bell).toBeVisible();
    await expect(bell).toContainText('3');

    await bell.click();
    const menu = page.getByRole('menu');
    await expect(menu.getByText('Notifications', { exact: true })).toBeVisible();
    await expect(menu.getByRole('menuitem', { name: 'Your glucose is within target range.' })).toBeVisible();
    await expect(menu.getByRole('menuitem', { name: 'Your weekly report is ready.' })).toBeVisible();
    await expect(menu.getByRole('menuitem', { name: 'Your pump is connected.' })).toBeVisible();

    await menu.getByRole('menuitem', { name: 'Mark all as read' }).click();
    await expect(menu).toBeHidden();
    const readBell = page.getByRole('button', { name: 'Notifications (0)' });
    await expect(readBell).toBeVisible();
    await expect(readBell).not.toContainText(/\d/);

    await readBell.click();
    await expect(page.getByRole('menuitem', { name: 'Mark all as read' })).toHaveAttribute('aria-disabled', 'true');
  });

  test('user menu shows patient name, email and role', async ({ page }) => {
    await login(page, 'patient');
    await page.getByRole('button', { name: 'User menu' }).click();
    const menu = page.getByRole('menu');
    await expect(menu.getByText('Sarah Johnson')).toBeVisible();
    await expect(menu.getByText('patient@example.com')).toBeVisible();
    await expect(menu.getByText('Patient', { exact: true })).toBeVisible();
  });

  test('user menu shows healthcare provider role for doctor', async ({ page }) => {
    await login(page, 'doctor');
    await page.getByRole('button', { name: 'User menu' }).click();
    const menu = page.getByRole('menu');
    await expect(menu.getByText('Dr. Michael Chen')).toBeVisible();
    await expect(menu.getByText('doctor@example.com')).toBeVisible();
    await expect(menu.getByText('Doctor', { exact: true })).toBeVisible();
  });

  test('header aria-labels are localized', async ({ page }) => {
    await login(page);
    await page.locator('header').getByRole('button', { name: /English/ }).click();
    await page.getByRole('menuitem', { name: /Español/ }).click();
    await expect(page.getByRole('button', { name: 'Notificaciones (3)' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Menú de usuario' })).toBeVisible();
  });
});

test.describe('Dashboard header (mobile)', () => {
  test.use({ viewport: { width: 375, height: 740 } });

  test('sidebar toggle exposes aria-expanded and controls the sidebar', async ({ page }) => {
    await login(page);
    const toggle = page.getByRole('button', { name: 'Toggle sidebar' });
    await expect(toggle).toHaveAttribute('aria-controls', 'dashboard-sidebar');
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    const sidebar = page.locator('aside#dashboard-sidebar');
    await expect(sidebar).toHaveClass(/-translate-x-full/);

    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(sidebar).toHaveClass(/translate-x-0/);
    await expect(sidebar).toBeInViewport();
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(sidebar).toHaveClass(/-translate-x-full/);
  });

  test('active section title is hidden on small screens; controls stay in view', async ({ page }) => {
    await login(page);
    const header = page.locator('header');
    await expect(header.getByText('Overview', { exact: true })).toBeHidden();
    await expect(page.getByRole('button', { name: 'Notifications (3)' })).toBeInViewport();
    await expect(page.getByRole('button', { name: 'User menu' })).toBeInViewport();
  });

  for (const width of [320, 375, 768]) {
    test(`header stays a single 80px row at ${width}px so the sidebar offset matches`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 });
      await login(page);
      const header = page.locator('header').first();
      const headerBox = await header.boundingBox();
      expect(headerBox?.height).toBe(80);

      await page.getByRole('button', { name: /sidebar/i }).click();
      const sidebar = page.locator('aside#dashboard-sidebar');
      await expect(sidebar).toBeInViewport();
      const sidebarBox = await sidebar.boundingBox();
      expect(sidebarBox?.y).toBe(80);
    });
  }
});
