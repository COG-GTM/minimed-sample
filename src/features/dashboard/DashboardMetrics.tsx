import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { DashboardTranslations } from './useDashboardTranslations';
import { Progress } from '@/components/ui/progress';
import { Activity, Droplet, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import type { DeviceStatus } from '@/types/device';
import type { generateDailySummary } from '@/utils/mockData';
import { useLanguage } from '@/contexts/LanguageContext';

const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'rising':
      case 'rising_quickly':
        return <ArrowUp className="h-4 w-4 text-medtronic-coral" />;
      case 'falling':
      case 'falling_quickly':
        return <ArrowDown className="h-4 w-4 text-medtronic-brightBlue" />;
      default:
        return <Minus className="h-4 w-4 text-medical-green" />;
    }
  };

const getGlucoseColor = (value: number) => {
    if (value < 70) return 'text-red-600';
    if (value > 180) return 'text-medtronic-coral';
    return 'text-medical-green';
  };


export function DashboardMetrics({ dailySummary, deviceStatus, translations }: {
  dailySummary: ReturnType<typeof generateDailySummary> | null;
  deviceStatus: DeviceStatus | null;
  translations: DashboardTranslations;
}) {
  const { tSync } = useLanguage();
  return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Current Glucose */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {translations.currentGlucose}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-3xl font-bold ${dailySummary ? getGlucoseColor(dailySummary.currentGlucose.value) : ''}`}>
                      {dailySummary?.currentGlucose.value || '--'}
                    </p>
                    <p className="text-sm text-gray-500">mg/dL</p>
                  </div>
                  <div className="flex flex-col items-center">
                    {dailySummary && getTrendIcon(dailySummary.currentGlucose.trend)}
                    <span className="text-xs text-gray-500 mt-1">
                      {dailySummary && tSync(dailySummary.currentGlucose.trend)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Time in Range */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {translations.timeInRange}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold text-green-600">
                      {dailySummary ? Math.round(dailySummary.timeInRange.inRange) : '--'}%
                    </p>
                    <p className="text-sm text-gray-500">70-180 mg/dL</p>
                  </div>
                  <Activity className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            {/* Total Insulin */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {translations.totalInsulinToday}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold text-blue-600">
                      {dailySummary?.totalInsulin || '--'}
                    </p>
                    <p className="text-sm text-gray-500">{translations.units}</p>
                  </div>
                  <Droplet className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            {/* Device Status */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {translations.pumpStatus}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{translations.battery}</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={deviceStatus?.batteryLevel} className="w-20 h-2" />
                      <span className="text-sm font-medium">{deviceStatus?.batteryLevel.toFixed(0)}%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{translations.reservoir}</span>
                    <span className="text-sm font-medium">{deviceStatus?.reservoirLevel.toFixed(0)}U</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>


  );
}
