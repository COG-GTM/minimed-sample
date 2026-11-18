import { Suspense } from 'react';
import { act, render, screen } from '@testing-library/react';
import { it, expect } from 'vitest';
import { LanguageProvider, useLanguage, type Language } from '@/contexts/LanguageContext';
import RouteLoading from '@/components/RouteLoading';

it('localizes the suspended route fallback in every supported language', async () => {
  const pending = new Promise<never>(() => {});
  function PendingRoute(): never { throw pending; }
  let selectLanguage: (language: Language) => void = () => {};
  function Harness() {
    selectLanguage = useLanguage().setLanguage;
    return <Suspense fallback={<RouteLoading />}><PendingRoute /></Suspense>;
  }
  render(<LanguageProvider><Harness /></LanguageProvider>);
  expect(screen.getByRole('status')).toHaveTextContent('Loading MiniMed…');
  for (const [language, text] of [
    ['es', 'Cargando MiniMed…'],
    ['fr', 'Chargement de MiniMed…'],
    ['de', 'MiniMed wird geladen…'],
  ] as const) {
    await act(async () => selectLanguage(language));
    expect(screen.getByRole('status')).toHaveTextContent(text);
  }
});
