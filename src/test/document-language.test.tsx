import { act, render } from '@testing-library/react';
import { expect, it } from 'vitest';
import { LanguageProvider, useLanguage, type Language } from '@/contexts/LanguageContext';

it('sets document language and title initially and whenever the selected language changes', async () => {
  let selectLanguage: (language: Language) => void = () => {};
  function Harness() {
    selectLanguage = useLanguage().setLanguage;
    return null;
  }
  const originalTitle = document.title;
  const originalLanguage = document.documentElement.lang;
  try {
    document.documentElement.lang = 'fr';
    document.title = '';
    render(<LanguageProvider><Harness /></LanguageProvider>);
    expect(document.documentElement.lang).toBe('en');
    expect(document.title).toBe('MiniMed Dashboard - Advanced Diabetes Management');

    for (const [language, title] of [
      ['es', 'Panel MiniMed - Gestión avanzada de la diabetes'],
      ['fr', 'Tableau de bord MiniMed - Gestion avancée du diabète'],
      ['de', 'MiniMed Dashboard - Fortgeschrittenes Diabetes-Management'],
      ['en', 'MiniMed Dashboard - Advanced Diabetes Management'],
    ] as const) {
      await act(async () => selectLanguage(language));
      expect(document.documentElement.lang).toBe(language);
      expect(document.title).toBe(title);
    }
  } finally {
    document.title = originalTitle;
    document.documentElement.lang = originalLanguage;
  }
});
