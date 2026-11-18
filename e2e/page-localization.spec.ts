import { test, expect } from '@playwright/test';

const languages = [
  { label: 'English', hero: 'Advanced Diabetes Management', feature: 'Comprehensive Diabetes Management', journey: 'Start Your Journey', privacy: 'Privacy Policy', back: 'Back to Home', show: 'Show password', hide: 'Hide password', signIn: 'Sign In', error: 'Invalid email or password. Try patient@example.com / demo123', notifications: 'Notifications', account: 'My Account', profile: 'Profile', logout: 'Sign out', glucose: 'Glucose' },
  { label: 'Español', hero: 'Gestión Avanzada de la Diabetes', feature: 'Gestión integral de la diabetes', journey: 'Comienza tu camino', privacy: 'Política de privacidad', back: 'Volver al inicio', show: 'Mostrar contraseña', hide: 'Ocultar contraseña', signIn: 'Iniciar Sesión', error: 'Correo o contraseña incorrectos. Prueba patient@example.com / demo123', notifications: 'Notificaciones', account: 'Mi cuenta', profile: 'Perfil', logout: 'Cerrar sesión', glucose: 'Glucosa' },
  { label: 'Français', hero: 'Gestion Avancée du Diabète', feature: 'Gestion complète du diabète', journey: 'Commencez votre parcours', privacy: 'Politique de confidentialité', back: 'Retour à l’accueil', show: 'Afficher le mot de passe', hide: 'Masquer le mot de passe', signIn: 'Se connecter', error: 'E-mail ou mot de passe incorrect. Essayez patient@example.com / demo123', notifications: 'Notifications', account: 'Mon compte', profile: 'Profil', logout: 'Se déconnecter', glucose: 'Glucose' },
  { label: 'Deutsch', hero: 'Fortgeschrittenes Diabetes-Management', feature: 'Umfassendes Diabetesmanagement', journey: 'Starten Sie jetzt', privacy: 'Datenschutzrichtlinie', back: 'Zur Startseite', show: 'Passwort anzeigen', hide: 'Passwort ausblenden', signIn: 'Anmelden', error: 'Ungültige E-Mail oder ungültiges Passwort. Versuchen Sie patient@example.com / demo123', notifications: 'Benachrichtigungen', account: 'Mein Konto', profile: 'Profil', logout: 'Abmelden', glucose: 'Glukose' },
];

for (const language of languages) {
  test(`${language.label}: full-page copy and accessible controls stay localized across navigation`, async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /English/ }).click();
    await page.getByRole('menuitem', { name: language.label }).click();
    await expect(page.getByRole('heading', { name: language.hero, exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: language.feature, exact: true })).toBeVisible();
    await expect(page.locator('footer').getByRole('link', { name: language.privacy })).toBeVisible();
    await page.getByRole('button', { name: language.journey, exact: true }).click();
    await expect(page).toHaveURL(/\/auth$/);
    await expect(page.getByRole('link', { name: language.back })).toBeVisible();
    await page.locator('#email').fill('patient@example.com');
    await page.locator('#password').fill('incorrect-password');
    await page.getByRole('button', { name: language.show, exact: true }).click();
    await expect(page.locator('#password')).toHaveAttribute('type', 'text');
    await page.getByRole('button', { name: language.hide, exact: true }).click();
    await expect(page.locator('#password')).toHaveAttribute('type', 'password');
    await page.getByRole('button', { name: language.signIn, exact: true }).click();
    await expect(page.getByText(language.error, { exact: true })).toBeVisible();
    await page.locator('#password').fill('demo123');
    await page.getByRole('button', { name: language.signIn, exact: true }).click();
    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(page.getByText(language.error, { exact: true })).toHaveCount(0);
    await expect(page.getByRole('button', { name: language.notifications, exact: true })).toBeVisible();
    const chart = page.locator('.recharts-wrapper').filter({ has: page.locator('.recharts-area-curve') });
    await chart.getByRole('application').focus();
    await expect(chart.locator('.recharts-tooltip-item-name')).toHaveText(language.glucose);
    await page.getByRole('button', { name: 'Sarah Johnson' }).click();
    await expect(page.getByText(language.account, { exact: true })).toBeVisible();
    await expect(page.getByRole('menuitem', { name: language.profile, exact: true })).toBeVisible();
    await page.getByRole('menuitem', { name: language.logout, exact: true }).click();
    await expect(page).toHaveURL('/');
    await expect(page.getByRole('heading', { name: language.hero, exact: true })).toBeVisible();
    await page.reload();
    await expect(page).toHaveURL('/');
    await expect(page.getByRole('heading', { name: 'Advanced Diabetes Management', exact: true })).toBeVisible();
  });
}
