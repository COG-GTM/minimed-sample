import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export function useTranslations<T extends Record<string, string>>(source: T): T {
  const { t } = useLanguage();
  const [translations, setTranslations] = useState<T>(source);
  const sourceKey = JSON.stringify(source);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const entries = await Promise.all(
        Object.entries(source).map(async ([key, text]) => [key, await t(text)] as const)
      );
      if (!cancelled) {
        setTranslations(Object.fromEntries(entries) as T);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t, sourceKey]);

  return translations;
}
