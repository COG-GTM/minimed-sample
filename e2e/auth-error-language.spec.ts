import { test, expect } from '@playwright/test';

test('changing language translates an existing sign-in error without clearing the form', async ({ page }) => {
  await page.goto('/auth');
  const email = page.locator('#email');
  const password = page.locator('#password');
  const englishError = page.getByText('Invalid email or password. Try patient@example.com / demo123', { exact: true });
  const spanishError = page.getByText('Correo o contraseña incorrectos. Prueba patient@example.com / demo123', { exact: true });

  await email.fill('patient@example.com');
  await password.fill('incorrect-password');
  await page.getByRole('button', { name: 'Sign In', exact: true }).click();
  await expect(englishError).toBeVisible();

  await page.getByRole('button', { name: /English/ }).click();
  await page.getByRole('menuitem', { name: 'Español' }).click();
  await expect(spanishError).toBeVisible();
  await expect(englishError).toHaveCount(0);
  await expect(email).toHaveValue('patient@example.com');
  await expect(password).toHaveValue('incorrect-password');

  await password.fill('demo123');
  await page.getByRole('button', { name: 'Iniciar Sesión', exact: true }).click();
  await expect(page).toHaveURL('/dashboard');
  await expect(page.getByRole('button', { name: 'Sarah Johnson' })).toBeVisible();
});
