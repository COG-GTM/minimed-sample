import { expect, test } from '@playwright/test';

const english = { code: 'en', label: 'English', title: 'MiniMed Dashboard - Advanced Diabetes Management' };
const spanish = { code: 'es', label: 'Español', title: 'Panel MiniMed - Gestión avanzada de la diabetes' };

test('the document language and tab title follow each language selection', async ({ page }) => {
  await page.goto('/');
  const html = page.locator('html');
  await expect(html).toHaveAttribute('lang', english.code);
  await expect(page).toHaveTitle(english.title);

  let activeLabel = english.label;
  for (const language of [
    spanish,
    { code: 'fr', label: 'Français', title: 'Tableau de bord MiniMed - Gestion avancée du diabète' },
    { code: 'de', label: 'Deutsch', title: 'MiniMed Dashboard - Fortgeschrittenes Diabetes-Management' },
    english,
  ]) {
    await page.getByRole('button', { name: new RegExp(activeLabel) }).click();
    await page.getByRole('menuitem', { name: language.label }).click();
    await expect(html).toHaveAttribute('lang', language.code);
    await expect(page).toHaveTitle(language.title);
    activeLabel = language.label;
  }
});

test('localized document metadata survives sign-in and sign-out navigation', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /English/ }).click();
  await page.getByRole('menuitem', { name: spanish.label }).click();
  const html = page.locator('html');

  await page.getByRole('button', { name: 'Comienza tu camino', exact: true }).click();
  await expect(page.getByRole('link', { name: 'Volver al inicio' })).toBeVisible();
  await expect(html).toHaveAttribute('lang', spanish.code);
  await expect(page).toHaveTitle(spanish.title);

  await page.getByLabel('Correo electrónico', { exact: true }).fill('patient@example.com');
  await page.getByLabel('Contraseña', { exact: true }).fill('demo123');
  await page.getByRole('button', { name: 'Iniciar Sesión', exact: true }).click();
  const account = page.getByRole('button', { name: 'Sarah Johnson' });
  await expect(account).toBeVisible();
  await expect(html).toHaveAttribute('lang', spanish.code);
  await expect(page).toHaveTitle(spanish.title);

  await account.click();
  await page.getByRole('menuitem', { name: 'Cerrar sesión', exact: true }).click();
  const journey = page.getByRole('button', { name: 'Comienza tu camino', exact: true });
  await expect(journey).toBeVisible();
  await expect(html).toHaveAttribute('lang', spanish.code);
  await expect(page).toHaveTitle(spanish.title);

  await page.reload();
  await expect(page.getByRole('heading', { name: 'Advanced Diabetes Management', exact: true })).toBeVisible();
  await expect(html).toHaveAttribute('lang', english.code);
  await expect(page).toHaveTitle(english.title);
});
