import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Activity,
  Droplet,
  Zap,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';
import {
  generateGlucoseReadings,
  generateDeviceStatus,
  generateDailySummary,
  generateInsulinDeliveries
} from '@/utils/mockData';
import { GlucoseReading } from '@/types/glucose';
import { DeviceStatus } from '@/types/device';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Area,
  AreaChart,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { format } from 'date-fns';

const OverviewSection = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [glucoseReadings, setGlucoseReadings] = useState<GlucoseReading[]>([]);
  const [deviceStatus, setDeviceStatus] = useState<DeviceStatus | null>(null);
  const [dailySummary, setDailySummary] = useState<ReturnType<typeof generateDailySummary> | null>(null);
  const [translations, setTranslations] = useState({
    welcomeBack: 'Welcome back',
    diabetesOverview: "Here's your diabetes management overview for today",
    currentGlucose: 'Current Glucose',
    timeInRange: 'Time in Range',
    totalInsulinToday: 'Total Insulin Today',
    pumpStatus: 'Pump Status',
    battery: 'Battery',
    reservoir: 'Reservoir',
    units: 'units',
    glucoseTrend: '24-Hour Glucose Trend',
    glucoseTrendDesc: 'Your glucose levels over the past 24 hours',
    timeInRangeTitle: 'Time in Range',
    timeInRangeDesc: 'Distribution of glucose levels today',
    recentActivity: 'Recent Activity',
    recentActivityDesc: 'Your latest insulin deliveries and glucose readings',
    bolus: 'Bolus',
    basal: 'Basal',
    delivery: 'Delivery',
    carbs: 'carbs',
    belowRange: 'Below Range',
    inRange: 'In Range',
    aboveRange: 'Above Range'
  });

  useEffect(() => {
    const loadTranslations = async () => {
      const newTranslations = {
        welcomeBack: await t('Welcome back'),
        diabetesOverview: await t("Here's your diabetes management overview for today"),
        currentGlucose: await t('Current Glucose'),
        timeInRange: await t('Time in Range'),
        totalInsulinToday: await t('Total Insulin Today'),
        pumpStatus: await t('Pump Status'),
        battery: await t('Battery'),
        reservoir: await t('Reservoir'),
        units: await t('units'),
        glucoseTrend: await t('24-Hour Glucose Trend'),
        glucoseTrendDesc: await t('Your glucose levels over the past 24 hours'),
        timeInRangeTitle: await t('Time in Range'),
        timeInRangeDesc: await t('Distribution of glucose levels today'),
        recentActivity: await t('Recent Activity'),
        recentActivityDesc: await t('Your latest insulin deliveries and glucose readings'),
        bolus: await t('Bolus'),
        basal: await t('Basal'),
        delivery: await t('Delivery'),
        carbs: await t('carbs'),
        belowRange: await t('Below Range'),
        inRange: await t('In Range'),
        aboveRange: await t('Above Range')
      };
      setTranslations(newTranslations);
    };
    loadTranslations();
  }, [t]);

  useEffect(() => {
    // Initialize mock data
    setGlucoseReadings(generateGlucoseReadings(24));
    setDeviceStatus(generateDeviceStatus());
    setDailySummary(generateDailySummary());

    // Simulate real-time updates
    const interval = setInterval(() => {
      setGlucoseReadings(generateGlucoseReadings(24));
      setDeviceStatus(generateDeviceStatus());
      setDailySummary(generateDailySummary());
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

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
    <div>
      {/* Welcome Message */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {translations.welcomeBack}, {user?.name}
        </h1>
        <p className="text-gray-600">
          {translations.diabetesOverview}
        </p>
      </div>

      {/* Stats Grid */}
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
                  {dailySummary?.currentGlucose.trend}
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

      {/* Charts Row */}
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

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>{translations.recentActivity}</CardTitle>
          <CardDescription>
            {translations.recentActivityDesc}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {generateInsulinDeliveries(1).slice(0, 5).map((delivery, index) => (
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
                      {delivery.type === 'bolus' ? translations.bolus : translations.basal} {translations.delivery}
                    </p>
                    <p className="text-sm text-gray-500">
                      {format(delivery.timestamp, 'HH:mm')} - {delivery.amount.toFixed(1)} {translations.units}
                      {delivery.carbsEntered && ` • ${delivery.carbsEntered}g ${translations.carbs}`}
                    </p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">
                  {format(delivery.timestamp, 'MMM d')}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OverviewSection;
