import { test, expect } from '@playwright/test';

for (const width of [320, 375, 430]) {
  test(`${width}px: localized header controls work and chart content fits its container`, async ({ page }) => {
    await page.setViewportSize({ width, height: 812 });
    await page.goto('/auth');
    await page.getByRole('button', { name: 'Demo Patient Account', exact: true }).click();
    await expect(page).toHaveURL(/\/dashboard$/);
    await page.getByRole('button', { name: /English/ }).click();
    await page.getByRole('menuitem', { name: /Deutsch/ }).click();
    const menu = page.getByRole('button', { name: 'Menü umschalten' });
    await menu.click();
    await expect(page.locator('aside')).toBeInViewport();
    await expect(page.locator('aside').getByRole('button').first()).toBeInViewport();
    await menu.click();
    await expect(page.locator('aside')).not.toBeInViewport();
    const charts = page.locator('.recharts-responsive-container');
    await expect(charts).toHaveCount(2);
    for (const chart of await charts.all()) {
      await chart.scrollIntoViewIfNeeded();
      await expect(chart.locator('svg.recharts-surface')).toBeVisible();
      await expect.poll(() => chart.evaluate((element) => {
        const container = element.getBoundingClientRect();
        const svg = element.querySelector('svg.recharts-surface')!.getBoundingClientRect();
        return svg.width > 0 && svg.left >= container.left - 1 && svg.right <= container.right + 1
          && svg.left >= 0 && svg.right <= window.innerWidth;
      })).toBe(true);
    }
    await page.getByRole('button', { name: 'Sarah Johnson' }).click();
    await expect(page.getByRole('menuitem', { name: 'Abmelden', exact: true })).toBeInViewport();
    await page.getByRole('menuitem', { name: 'Abmelden', exact: true }).click();
    await expect(page).toHaveURL('/');
  });
}
