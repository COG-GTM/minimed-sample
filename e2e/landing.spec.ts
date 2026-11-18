import { test, expect } from '@playwright/test';

test('the mobile landing menu stays usable after changing language', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');

  const header = page.getByRole('banner');
  const englishToggle = header.getByRole('button', { name: 'Toggle menu', exact: true });
  await expect(header.getByRole('button', { name: 'Sign In', exact: true })).toBeHidden();
  await englishToggle.click();
  await header.getByRole('button', { name: /English/ }).click();
  await page.getByRole('menuitem', { name: 'Español' }).click();

  const spanishToggle = header.getByRole('button', { name: 'Abrir o cerrar menú', exact: true });
  const signIn = header.getByRole('button', { name: 'Iniciar Sesión', exact: true });
  await expect(header.getByRole('link', { name: 'Productos', exact: true })).toBeVisible();
  await spanishToggle.click();
  await expect(signIn).toBeHidden();
  await spanishToggle.click();
  await signIn.click();

  await expect(page).toHaveURL('/auth');
  await expect(page.getByText('Bienvenido a MiniMed', { exact: true })).toBeVisible();
});
