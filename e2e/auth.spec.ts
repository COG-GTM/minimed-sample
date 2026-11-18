import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/auth');
});

test('inputs render, accept typing, toggle password and require credentials', async ({ page }) => {
  const email = page.locator('#email');
  const password = page.locator('#password');
  await expect(email).toBeVisible();
  await expect(password).toBeVisible();
  await expect(email).toHaveAttribute('type', 'email');
  await expect(password).toHaveAttribute('type', 'password');
  await page.getByRole('button', { name: 'Sign In', exact: true }).click();
  expect(await email.evaluate((input: HTMLInputElement) => input.validity.valueMissing)).toBe(true);
  await expect(page).toHaveURL(/\/auth$/);
  await email.fill('patient@example.com');
  await password.fill('demo123');
  await expect(email).toHaveValue('patient@example.com');
  await expect(password).toHaveValue('demo123');
  await password.locator('..').getByRole('button').click();
  await expect(password).toHaveAttribute('type', 'text');
  await password.locator('..').getByRole('button').click();
  await expect(password).toHaveAttribute('type', 'password');
  await page.locator('#remember').check();
  await expect(page.locator('#remember')).toBeChecked();
});

test('invalid credentials show an error and re-enable sign-in', async ({ page }) => {
  await page.locator('#email').fill('unknown@example.com');
  await page.locator('#password').fill('wrong-password');
  await page.getByRole('button', { name: 'Sign In', exact: true }).click();
  await expect(page.getByText('Invalid email or password. Try patient@example.com / demo123', { exact: true })).toBeVisible();
  await expect(page).toHaveURL(/\/auth$/);
  await expect(page.getByRole('button', { name: 'Sign In', exact: true })).toBeEnabled();
  expect(await page.evaluate(() => localStorage.getItem('minimedUser'))).toBeNull();
});

for (const account of [
  { email: 'patient@example.com', name: 'Sarah Johnson', role: 'patient' },
  { email: 'doctor@example.com', name: 'Dr. Michael Chen', role: 'healthcare_provider' },
]) {
  test(`credential form signs in ${account.role} and restores remembered session on reload`, async ({ page }) => {
    await page.locator('#email').fill(account.email);
    await page.locator('#password').fill('demo123');
    await page.locator('#remember').check();
    await page.getByRole('button', { name: 'Sign In', exact: true }).click();
    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(page.getByRole('heading', { name: `Welcome back, ${account.name}` })).toBeVisible();
    const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('minimedUser')!));
    expect(stored).toMatchObject(account);
    expect(stored).not.toHaveProperty('password');
    await page.reload();
    await expect(page.getByRole('heading', { name: `Welcome back, ${account.name}` })).toBeVisible();
    await expect(page).toHaveURL(/\/dashboard$/);
  });
}

test('fresh protected-route navigation and reload render the sign-in page', async ({ page }) => {
  await page.goto('/dashboard');
  await expect(page).toHaveURL(/\/auth$/);
  await expect(page.locator('#email')).toBeVisible();
  await page.reload();
  await expect(page.locator('#password')).toBeVisible();
  await expect(page.getByRole('heading', { name: /Welcome back/ })).toHaveCount(0);
});

test('reloading the dashboard shows a loading status until its route is ready', async ({ page }) => {
  const welcome = page.getByRole('heading', { name: 'Welcome back, Sarah Johnson' });
  await page.getByRole('button', { name: 'Demo Patient Account', exact: true }).click();
  await expect(welcome).toBeVisible();

  const dashboardChunk = /\/(?:assets\/Dashboard-[^/]+\.js|src\/pages\/Dashboard\.tsx)(?:\?.*)?$/;
  const { promise, resolve } = Promise.withResolvers<void>();
  await page.route(dashboardChunk, async (route) => {
    await promise;
    await route.continue();
  });

  const loading = page.getByRole('status').filter({ hasText: 'Loading MiniMed…' });
  try {
    await Promise.all([
      page.waitForRequest(dashboardChunk),
      page.reload({ waitUntil: 'domcontentloaded' }),
    ]);
    await expect(loading).toBeVisible();
    await expect(welcome).toHaveCount(0);
  } finally {
    resolve();
  }

  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(welcome).toBeVisible();
  await expect(loading).toHaveCount(0);
});
