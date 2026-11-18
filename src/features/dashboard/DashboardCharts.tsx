import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { DashboardTranslations } from './useDashboardTranslations';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Area, AreaChart, PieChart, Pie, Cell } from 'recharts';
import { format } from 'date-fns';
import type { GlucoseReading } from '@/types/glucose';
import type { generateDailySummary } from '@/utils/mockData';
import { useLanguage } from '@/contexts/LanguageContext';

export function DashboardCharts({ glucoseReadings, dailySummary, translations }: {
  glucoseReadings: GlucoseReading[];
  dailySummary: ReturnType<typeof generateDailySummary> | null;
  translations: DashboardTranslations;
}) {
  const { tSync } = useLanguage();
  // Prepare chart data
  const chartData = glucoseReadings.map(reading => ({
    time: format(reading.timestamp, 'HH:mm'),
    value: reading.value,
    timestamp: reading.timestamp
  }));

  // Time in Range pie chart data
  const timeInRangeData = dailySummary ? [
    { name: translations.belowRange, value: dailySummary.timeInRange.below, color: '#ef4444' },
    { name: translations.inRange, value: dailySummary.timeInRange.inRange, color: '#10b981' },
    { name: translations.aboveRange, value: dailySummary.timeInRange.above, color: '#f59e0b' }
  ] : [];


  return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Glucose Trend Chart */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>{translations.glucoseTrend}</CardTitle>
                <CardDescription>
                  {translations.glucoseTrendDesc}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorGlucose" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="time" 
                      tick={{ fontSize: 12 }}
                      interval="preserveStartEnd"
                    />
                    <YAxis 
                      domain={[40, 250]}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip />
                    <ReferenceLine y={70} stroke="#ef4444" strokeDasharray="3 3" />
                    <ReferenceLine y={180} stroke="#ef4444" strokeDasharray="3 3" />
                    <ReferenceLine y={125} stroke="#10b981" strokeDasharray="3 3" />
                    <Area
                      name={tSync('Glucose')}
                      isAnimationActive={false}
                      type="monotone"
                      dataKey="value"
                      stroke="#3b82f6"
                      fillOpacity={1}
                      fill="url(#colorGlucose)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Time in Range Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle>{translations.timeInRangeTitle}</CardTitle>
                <CardDescription>
                  {translations.timeInRangeDesc}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      isAnimationActive={false}
                      data={timeInRangeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {timeInRangeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {timeInRangeData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: item.color }} />
                        <span className="text-sm text-gray-600">{item.name}</span>
                      </div>
                      <span className="text-sm font-medium">{item.value.toFixed(1)}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>


  );
}
