import { test, expect } from '@playwright/test';

test.use({ timezoneId: 'UTC' });

test('recent activity advances across midnight on the dashboard tick, not a language change', async ({ page }) => {
  await page.clock.install({ time: new Date('2026-11-18T23:59:00Z') });
  await page.goto('/auth');
  await page.getByRole('button', { name: 'Demo Patient Account', exact: true }).click();
  await expect(page.getByText('Nov 18', { exact: true })).toHaveCount(5);
  await page.getByRole('button', { name: /English/ }).click();
  await page.getByRole('menuitem', { name: /Español/ }).click();
  await expect(page.getByText('nov 18', { exact: true })).toHaveCount(5);
  await page.clock.fastForward(90_000);
  await expect(page.getByText('nov 19', { exact: true })).toHaveCount(5);
  await expect(page.getByText('nov 18', { exact: true })).toHaveCount(0);
  await expect(page.getByText(/^(Administración de bolo|Entrega Basal)$/)).toHaveCount(5);
});
