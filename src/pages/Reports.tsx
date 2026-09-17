import { useEffect, useState } from 'react';
import { format, subDays } from 'date-fns';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslations } from '@/hooks/useTranslations';
import { generateGlucoseReadings, calculateTimeInRange } from '@/utils/mockData';

interface DailyReport {
  day: string;
  below: number;
  inRange: number;
  above: number;
}

const Reports = () => {
  const [report, setReport] = useState<DailyReport[]>([]);
  const labels = useTranslations({
    title: 'Reports',
    subtitle: 'Weekly summary of your glucose control',
    weeklyTir: 'Weekly Time in Range',
    weeklyTirDesc: 'Percentage of readings in each range per day',
    belowRange: 'Below Range',
    inRange: 'In Range',
    aboveRange: 'Above Range',
    dailyBreakdown: 'Daily Breakdown',
    dailyBreakdownDesc: 'Time in range by day',
  });

  useEffect(() => {
    const days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), 6 - i);
      const tir = calculateTimeInRange(generateGlucoseReadings(24));
      return {
        day: format(date, 'EEE'),
        below: Math.round(tir.below),
        inRange: Math.round(tir.inRange),
        above: Math.round(tir.above),
      };
    });
    setReport(days);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{labels.title}</h1>
        <p className="text-gray-600">{labels.subtitle}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{labels.weeklyTir}</CardTitle>
          <CardDescription>{labels.weeklyTirDesc}</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={report}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="below" name={labels.belowRange} stackId="tir" fill="#ef4444" />
              <Bar dataKey="inRange" name={labels.inRange} stackId="tir" fill="#10b981" />
              <Bar dataKey="above" name={labels.aboveRange} stackId="tir" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{labels.dailyBreakdown}</CardTitle>
          <CardDescription>{labels.dailyBreakdownDesc}</CardDescription>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-600 border-b">
                <th className="py-2 font-medium">&nbsp;</th>
                <th className="py-2 font-medium text-right">{labels.belowRange}</th>
                <th className="py-2 font-medium text-right">{labels.inRange}</th>
                <th className="py-2 font-medium text-right">{labels.aboveRange}</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {report.map(row => (
                <tr key={row.day}>
                  <td className="py-2 font-medium text-gray-900">{row.day}</td>
                  <td className="py-2 text-right text-red-600">{row.below}%</td>
                  <td className="py-2 text-right text-green-600 font-semibold">{row.inRange}%</td>
                  <td className="py-2 text-right text-amber-600">{row.above}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
