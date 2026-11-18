import { test, expect } from '@playwright/test';

test('sign-out stays home when the landing route has not loaded yet', async ({ page }) => {
  await page.goto('/auth');
  await page.getByRole('button', { name: 'Demo Patient Account', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Welcome back, Sarah Johnson' })).toBeVisible();
  const landingChunk = /\/(?:assets\/Landing-[^/]+\.js|src\/pages\/Landing\.tsx)(?:\?.*)?$/;
  const { promise, resolve } = Promise.withResolvers<void>();
  await page.route(landingChunk, async (route) => {
    await promise;
    await route.continue();
  });
  await page.getByRole('button', { name: 'Sarah Johnson' }).click();
  try {
    await Promise.all([
      page.waitForRequest(landingChunk),
      page.getByRole('menuitem', { name: 'Sign out', exact: true }).click(),
    ]);
    await expect.poll(() => page.evaluate(() => localStorage.getItem('minimedUser'))).toBeNull();
    expect(await page.evaluate(() => sessionStorage.getItem('minimedUser'))).toBeNull();
    await expect(page).toHaveURL('/');
  } finally {
    resolve();
  }
  await expect(page.getByRole('heading', { name: 'Advanced Diabetes Management' })).toBeVisible();
  await expect(page).toHaveURL('/');
  await page.reload();
  await expect(page).toHaveURL('/');
  await expect(page.getByRole('heading', { name: 'Advanced Diabetes Management' })).toBeVisible();
  await page.goto('/dashboard');
  await expect(page).toHaveURL(/\/auth$/);
});
