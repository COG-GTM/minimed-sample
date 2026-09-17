import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Area, AreaChart, CartesianGrid, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslations } from '@/hooks/useTranslations';
import { generateGlucoseReadings, calculateTimeInRange } from '@/utils/mockData';
import { GlucoseReading } from '@/types/glucose';

const GlucoseMonitoring = () => {
  const [readings, setReadings] = useState<GlucoseReading[]>([]);
  const labels = useTranslations({
    title: 'Glucose Monitoring',
    subtitle: 'Continuous glucose readings from your sensor',
    average: 'Average Glucose',
    highest: 'Highest',
    lowest: 'Lowest',
    timeInRange: 'Time in Range',
    trend: '24-Hour Glucose Trend',
    trendDesc: 'Sensor readings every 5 minutes',
    recentReadings: 'Recent Readings',
    recentReadingsDesc: 'Latest sensor values',
  });

  useEffect(() => {
    setReadings(generateGlucoseReadings(24));
  }, []);

  const values = readings.map(r => r.value);
  const average = values.length ? Math.round(values.reduce((a, b) => a + b, 0) / values.length) : 0;
  const highest = values.length ? Math.max(...values) : 0;
  const lowest = values.length ? Math.min(...values) : 0;
  const tir = calculateTimeInRange(readings);
  const chartData = readings.map(r => ({ time: format(r.timestamp, 'HH:mm'), value: r.value }));

  const stats = [
    { label: labels.average, value: `${average}`, unit: 'mg/dL' },
    { label: labels.highest, value: `${highest}`, unit: 'mg/dL' },
    { label: labels.lowest, value: `${lowest}`, unit: 'mg/dL' },
    { label: labels.timeInRange, value: `${Math.round(tir.inRange)}%`, unit: '70-180 mg/dL' },
  ];

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
              <p className="text-3xl font-bold text-medtronic-deepPurple">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.unit}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{labels.trend}</CardTitle>
          <CardDescription>{labels.trendDesc}</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorGlucoseDetail" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" tick={{ fontSize: 12 }} interval="preserveStartEnd" />
              <YAxis domain={[40, 250]} tick={{ fontSize: 12 }} />
              <Tooltip />
              <ReferenceLine y={70} stroke="#ef4444" strokeDasharray="3 3" />
              <ReferenceLine y={180} stroke="#ef4444" strokeDasharray="3 3" />
              <Area type="monotone" dataKey="value" stroke="#3b82f6" fill="url(#colorGlucoseDetail)" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{labels.recentReadings}</CardTitle>
          <CardDescription>{labels.recentReadingsDesc}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="divide-y">
            {[...readings].reverse().slice(0, 8).map(reading => (
              <div key={reading.id} className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-600">{format(reading.timestamp, 'MMM d, HH:mm')}</span>
                <span className="text-sm capitalize text-gray-500">{reading.trend.replace('_', ' ')}</span>
                <span className="font-semibold text-gray-900">{reading.value} mg/dL</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GlucoseMonitoring;
