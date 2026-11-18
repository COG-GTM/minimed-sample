import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { DashboardTranslations } from './useDashboardTranslations';
import type { InsulinDelivery } from '@/types/device';
import { format } from 'date-fns';
import { Zap, Droplet } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { enUS, es, fr, de } from 'date-fns/locale';

export function RecentActivity({ translations, deliveries }: {
  translations: DashboardTranslations;
  deliveries: InsulinDelivery[];
}) {
  const { language, tSync } = useLanguage();
  const locale = { en: enUS, es, fr, de }[language];
  return (
          <Card>
            <CardHeader>
              <CardTitle>{translations.recentActivity}</CardTitle>
              <CardDescription>
                {translations.recentActivityDesc}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {deliveries.map((delivery, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        delivery.type === 'bolus' ? 'bg-blue-100' : 'bg-green-100'
                      }`}>
                        {delivery.type === 'bolus' ? (
                          <Zap className="h-5 w-5 text-blue-600" />
                        ) : (
                          <Droplet className="h-5 w-5 text-green-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {tSync(delivery.type === 'bolus' ? 'Bolus Delivery' : 'Basal Delivery')}
                        </p>
                        <p className="text-sm text-gray-500">
                          {format(delivery.timestamp, 'HH:mm')} - {delivery.amount.toFixed(1)} {translations.units}
                          {delivery.carbsEntered && ` • ${delivery.carbsEntered}g ${translations.carbs}`}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">
                      {format(delivery.timestamp, 'MMM d', { locale })}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
  );
}
