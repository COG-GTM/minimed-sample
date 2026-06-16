import { test, expect } from '@playwright/test';
import { login, sidebar } from './helpers';

// The mobile sidebar is hidden off-canvas (`-translate-x-full`) at narrow widths
// and toggled by the header menu button. `navigateTo` in Dashboard.tsx closes it
// after navigation, and tapping the overlay also dismisses it.
const CLOSED = /-translate-x-full/;

test.describe('Mobile sidebar (Dashboard.tsx sidebarOpen behavior)', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  const menuButton = (page: import('@playwright/test').Page) =>
    page.locator('header button').filter({ has: page.locator('svg.lucide-menu') });

  test('menu button opens the sidebar, then navigating closes it', async ({ page }) => {
    const aside = page.locator('aside');

    // Precondition: sidebar starts collapsed off-canvas on mobile.
    await expect(aside).toHaveClass(CLOSED);

    await menuButton(page).click();
    await expect(aside).not.toHaveClass(CLOSED);

    await sidebar(page).getByRole('button', { name: 'Glucose Monitoring', exact: true }).click();
    await expect(page).toHaveURL('/dashboard/glucose');
    await expect(page.getByRole('heading', { level: 1, name: 'Glucose Monitoring' })).toBeVisible();

    // Sidebar auto-closes after navigation on mobile.
    await expect(aside).toHaveClass(CLOSED);
  });

  test('tapping the overlay closes the sidebar', async ({ page }) => {
    const aside = page.locator('aside');
    const overlay = page.locator('div.fixed.inset-0.bg-black\\/50');

    await menuButton(page).click();
    await expect(aside).not.toHaveClass(CLOSED);
    await expect(overlay).toBeVisible();

    // Tap to the right of the 256px-wide rail so the click lands on the overlay,
    // not the sidebar itself.
    await overlay.click({ position: { x: 340, y: 400 } });
    await expect(aside).toHaveClass(CLOSED);
    await expect(overlay).toHaveCount(0);
  });
});
