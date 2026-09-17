import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Droplet, Zap, Syringe } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslations } from '@/hooks/useTranslations';
import { generateInsulinDeliveries } from '@/utils/mockData';
import { InsulinDelivery } from '@/types/device';

const InsulinManagement = () => {
  const [deliveries, setDeliveries] = useState<InsulinDelivery[]>([]);
  const labels = useTranslations({
    title: 'Insulin Management',
    subtitle: 'Basal and bolus insulin delivered over the past 7 days',
    totalInsulin: 'Total Insulin',
    basal: 'Basal',
    bolus: 'Bolus',
    correction: 'Correction',
    units: 'units',
    history: 'Delivery History',
    historyDesc: 'Most recent insulin deliveries',
    carbs: 'carbs',
  });

  useEffect(() => {
    setDeliveries(generateInsulinDeliveries(7));
  }, []);

  const sum = (type?: InsulinDelivery['type']) =>
    deliveries.filter(d => !type || d.type === type).reduce((acc, d) => acc + d.amount, 0);

  const stats = [
    { label: labels.totalInsulin, value: sum(), icon: Droplet, color: 'text-medtronic-deepPurple' },
    { label: labels.basal, value: sum('basal'), icon: Droplet, color: 'text-green-600' },
    { label: labels.bolus, value: sum('bolus'), icon: Zap, color: 'text-blue-600' },
    { label: labels.correction, value: sum('correction'), icon: Syringe, color: 'text-medtronic-coral' },
  ];

  const typeLabel = (type: InsulinDelivery['type']) =>
    type === 'basal' ? labels.basal : type === 'bolus' ? labels.bolus : labels.correction;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{labels.title}</h1>
        <p className="text-gray-600">{labels.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(stat => (
          <Card key={stat.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{stat.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-3xl font-bold ${stat.color}`}>{stat.value.toFixed(1)}</p>
                  <p className="text-sm text-gray-500">{labels.units}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{labels.history}</CardTitle>
          <CardDescription>{labels.historyDesc}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="divide-y">
            {deliveries.slice(0, 15).map(delivery => (
              <div key={delivery.id} className="flex items-center justify-between py-3">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      delivery.type === 'bolus' ? 'bg-blue-100' : delivery.type === 'basal' ? 'bg-green-100' : 'bg-orange-100'
                    }`}
                  >
                    {delivery.type === 'bolus' ? (
                      <Zap className="h-5 w-5 text-blue-600" />
                    ) : delivery.type === 'basal' ? (
                      <Droplet className="h-5 w-5 text-green-600" />
                    ) : (
                      <Syringe className="h-5 w-5 text-orange-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{typeLabel(delivery.type)}</p>
                    <p className="text-sm text-gray-500">
                      {format(delivery.timestamp, 'MMM d, HH:mm')}
                      {delivery.carbsEntered && ` • ${Math.round(delivery.carbsEntered)}g ${labels.carbs}`}
                    </p>
                  </div>
                </div>
                <span className="font-semibold text-gray-900">
                  {delivery.amount.toFixed(1)} {labels.units}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InsulinManagement;
