import { test, expect } from '@playwright/test';
import { login } from './helpers';

const locales = [
  [
    "English",
    "Skip to main content",
    "Dashboard",
    "Go to Dashboard",
    "Open menu",
    "Close menu",
    "Toggle sidebar",
    "Notifications",
    "Mark all as read",
    "User menu",
    "Patient",
    "Doctor",
    "Your glucose is within target range.",
    "Your weekly report is ready.",
    "Your pump is connected."
  ],
  [
    "Español",
    "Saltar al contenido principal",
    "Panel",
    "Ir al panel",
    "Abrir menú",
    "Cerrar menú",
    "Alternar barra lateral",
    "Notificaciones",
    "Marcar todo como leído",
    "Menú de usuario",
    "Paciente",
    "Médico",
    "Tu glucosa está dentro del rango objetivo.",
    "Tu informe semanal está listo.",
    "Tu bomba está conectada."
  ],
  [
    "Français",
    "Aller au contenu principal",
    "Tableau de bord",
    "Aller au tableau de bord",
    "Ouvrir le menu",
    "Fermer le menu",
    "Afficher ou masquer le volet latéral",
    "Notifications",
    "Tout marquer comme lu",
    "Menu utilisateur",
    "Patient",
    "Médecin",
    "Votre glycémie est dans la plage cible.",
    "Votre rapport hebdomadaire est prêt.",
    "Votre pompe est connectée."
  ],
  [
    "Deutsch",
    "Zum Hauptinhalt springen",
    "Dashboard",
    "Zum Dashboard",
    "Menü öffnen",
    "Menü schließen",
    "Seitenleiste umschalten",
    "Benachrichtigungen",
    "Alle als gelesen markieren",
    "Benutzermenü",
    "Patient",
    "Arzt",
    "Ihr Glukosewert liegt im Zielbereich.",
    "Ihr Wochenbericht ist bereit.",
    "Ihre Pumpe ist verbunden."
  ]
] as const;

for (const [language, skip, dashboard, goDashboard, openMenu, closeMenu, toggleSidebar, notifications, markRead, userMenu, patient, doctor, ...messages] of locales) {
  for (const role of ['patient', 'doctor'] as const) {
    test(`${language} header strings for ${role}`, async ({ page }) => {
      await login(page, role);
      await page.locator('header').getByRole('button', { name: /English/ }).click();
      await page.getByRole('menuitem', { name: new RegExp(language) }).click();
      await expect(page.getByRole('link', { name: skip, exact: true })).toHaveAttribute('href', '#main-content');

      await page.getByRole('button', { name: `${notifications} (3)`, exact: true }).click();
      const menu = page.getByRole('menu');
      await expect(menu.getByText(notifications, { exact: true })).toBeVisible();
      for (const message of messages) {
        await expect(menu.getByRole('menuitem', { name: message, exact: true })).toBeVisible();
      }
      await menu.getByRole('menuitem', { name: markRead, exact: true }).click();
      await expect(page.getByRole('button', { name: `${notifications} (0)`, exact: true })).toBeVisible();
      await page.getByRole('button', { name: userMenu, exact: true }).click();
      await expect(menu.getByText(role === 'patient' ? patient : doctor, { exact: true })).toBeVisible();
      await menu.getByRole('menuitem').first().focus();
      await page.keyboard.press('Escape');
      await expect(menu).toBeHidden();

      await page.setViewportSize({ width: 375, height: 740 });
      await expect(page.getByRole('button', { name: toggleSidebar, exact: true })).toBeVisible();

      await page.goto('/');
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.locator('header').getByRole('button', { name: /English/ }).click();
      await page.getByRole('menuitem', { name: new RegExp(language) }).click();
      await expect(page.locator('header').getByRole('button', { name: dashboard, exact: true })).toBeVisible();
      await page.setViewportSize({ width: 375, height: 740 });
      await page.getByRole('button', { name: openMenu, exact: true }).click();
      await expect(page.getByRole('button', { name: closeMenu, exact: true })).toHaveAttribute('aria-expanded', 'true');
      await expect(page.locator('#landing-menu').getByRole('button', { name: goDashboard, exact: true })).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(page.getByRole('button', { name: openMenu, exact: true })).toBeFocused();
    });
  }
}
