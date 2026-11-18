import { act, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import { LanguageProvider, useLanguage, type Language } from '@/contexts/LanguageContext';
import { AuthProvider } from '@/contexts/AuthContext';
import Landing from '@/pages/Landing';
import Auth from '@/pages/Auth';
import Dashboard from '@/pages/Dashboard';
import { pageTranslations } from '@/services/pageTranslations';
import { translationService } from '@/services/translationService';

describe.each([
  ['es', 'Más información', 'Volver al inicio', 'Cerrar sesión', 'Entrega Basal'],
  ['fr', 'En savoir plus', 'Retour à l’accueil', 'Se déconnecter', 'Livraison Basale'],
  ['de', 'Mehr erfahren', 'Zur Startseite', 'Abmelden', 'Basale Abgabe'],
] as const)('%s page localization', (language, learnMore, backHome, signOut, basal) => {
  it('translates landing, auth and dashboard strings immediately', async () => {
    let selectLanguage: (language: Language) => void = () => {};
    function Harness() {
      const { setLanguage, tSync } = useLanguage();
      selectLanguage = setLanguage;
      return <><Landing /><Auth /><Dashboard /><p>{tSync('Sign out')}</p></>;
    }
    render(<MemoryRouter><LanguageProvider><AuthProvider><Harness /></AuthProvider></LanguageProvider></MemoryRouter>);
    await act(async () => selectLanguage(language));
    expect(screen.getByRole('button', { name: learnMore })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: backHome })).toBeInTheDocument();
    expect(screen.getByText(signOut)).toBeInTheDocument();
    expect(screen.getAllByText(basal).length).toBeGreaterThan(0);
    expect(screen.queryByText('Learn More')).not.toBeInTheDocument();
    expect(screen.queryByText('Back to Home')).not.toBeInTheDocument();
  });

  it('has translations for every added page string and glucose trend', async () => {
    for (const [source, translations] of Object.entries(pageTranslations)) {
      expect(translationService.translateSync(source, language)).toBe(translations[language]);
      expect(await translationService.translate(source, language)).toBe(translations[language]);
      expect(translations[language].length).toBeGreaterThan(0);
    }
  });
});
