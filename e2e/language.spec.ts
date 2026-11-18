import { test, expect } from '@playwright/test';

const languages = [
  { label: 'Español', welcome: 'Bienvenido a MiniMed', email: 'Correo electrónico', password: 'Contraseña', signIn: 'Iniciar Sesión', glucose: 'Glucosa Actual', trend: 'Tendencia de Glucosa de 24 Horas', activity: 'Actividad Reciente' },
  { label: 'Français', welcome: 'Bienvenue à MiniMed', email: 'E-mail', password: 'Mot de passe', signIn: 'Se connecter', glucose: 'Glucose Actuel', trend: 'Tendance Glucose 24 Heures', activity: 'Activité Récente' },
  { label: 'Deutsch', welcome: 'Willkommen bei MiniMed', email: 'E-Mail', password: 'Passwort', signIn: 'Anmelden', glucose: 'Aktueller Glukosewert', trend: '24-Stunden-Glukose-Trend', activity: 'Letzte Aktivität' },
  { label: 'English', welcome: 'Welcome to MiniMed', email: 'Email', password: 'Password', signIn: 'Sign In', glucose: 'Current Glucose', trend: '24-Hour Glucose Trend', activity: 'Recent Activity' },
];

test('auth switches through every language and back to English without losing typed values', async ({ page }) => {
  await page.goto('/auth');
  await page.locator('#email').fill('patient@example.com');
  await page.locator('#password').fill('demo123');
  let current = 'English';
  for (const language of languages) {
    await page.getByRole('button', { name: new RegExp(current) }).click();
    await page.getByRole('menuitem', { name: new RegExp(language.label) }).click();
    await expect(page.getByText(language.welcome, { exact: true })).toBeVisible();
    await expect(page.getByLabel(language.email, { exact: true })).toHaveValue('patient@example.com');
    await expect(page.getByLabel(language.password, { exact: true })).toHaveValue('demo123');
    await expect(page.getByRole('button', { name: language.signIn, exact: true })).toBeVisible();
    current = language.label;
  }
});

test('dashboard switches metric, chart and activity translations through every language', async ({ page }) => {
  await page.goto('/auth');
  await page.getByRole('button', { name: 'Demo Patient Account', exact: true }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
  let current = 'English';
  for (const language of languages) {
    await page.getByRole('button', { name: new RegExp(current) }).click();
    await page.getByRole('menuitem', { name: new RegExp(language.label) }).click();
    for (const text of [language.glucose, language.trend, language.activity]) {
      await expect(page.getByText(text, { exact: true })).toBeVisible();
    }
    current = language.label;
  }
});
