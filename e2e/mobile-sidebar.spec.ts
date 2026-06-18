import { test, expect } from '@playwright/test';
import { login } from './helpers';

// Use a phone-sized viewport so the sidebar renders as a toggleable overlay
// (the `lg:` breakpoint that keeps it permanently docked is 1024px).
test.use({ viewport: { width: 390, height: 844 } });

test.describe('Mobile sidebar overlay', () => {
  test('opens via the menu button and closes after navigating', async ({ page }) => {
    await login(page);

    const sidebar = page.getByRole('complementary');
    const overlay = page.locator('.bg-black\\/50');
    const menuButton = page.locator('header button').first();

    // Precondition: sidebar starts off-screen and the overlay is absent.
    await expect(sidebar).toHaveClass(/-translate-x-full/);
    await expect(overlay).toHaveCount(0);

    // Opening the sidebar slides it in and shows the dimming overlay.
    await menuButton.click();
    await expect(sidebar).not.toHaveClass(/-translate-x-full/);
    await expect(overlay).toBeVisible();

    // Navigating closes the sidebar overlay and routes to the sub-page.
    await sidebar.getByRole('button', { name: 'Reports', exact: true }).click();
    await expect(page).toHaveURL(/\/dashboard\/reports$/);
    await expect(page.getByRole('heading', { level: 1, name: 'Reports' })).toBeVisible();
    await expect(sidebar).toHaveClass(/-translate-x-full/);
    await expect(overlay).toHaveCount(0);
  });

  test('closes when tapping the overlay backdrop', async ({ page }) => {
    await login(page);

    const sidebar = page.getByRole('complementary');
    const overlay = page.locator('.bg-black\\/50');
    const menuButton = page.locator('header button').first();

    await menuButton.click();
    await expect(overlay).toBeVisible();

    await overlay.click();
    await expect(sidebar).toHaveClass(/-translate-x-full/);
    await expect(overlay).toHaveCount(0);
  });
});
