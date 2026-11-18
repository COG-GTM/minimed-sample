import { useLanguage } from '@/contexts/LanguageContext';

export default function RouteLoading() {
  const { tSync } = useLanguage();
  return <div role="status" className="p-8 text-primary">{tSync('app.loading')}</div>;
}
