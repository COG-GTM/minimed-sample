import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Battery, Droplet, Wifi, WifiOff } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useTranslations } from '@/hooks/useTranslations';
import { generateDeviceStatus } from '@/utils/mockData';
import { DeviceStatus } from '@/types/device';

const DeviceStatusPage = () => {
  const [device, setDevice] = useState<DeviceStatus | null>(null);
  const labels = useTranslations({
    title: 'Device Status',
    subtitle: 'Your insulin pump and sensor connectivity',
    connected: 'Connected',
    disconnected: 'Disconnected',
    battery: 'Battery',
    reservoir: 'Reservoir',
    unitsRemaining: 'units remaining',
    deviceInfo: 'Device Information',
    deviceInfoDesc: 'Pump details and firmware',
    model: 'Model',
    serialNumber: 'Serial Number',
    firmware: 'Firmware Version',
    lastSync: 'Last Sync',
  });

  useEffect(() => {
    setDevice(generateDeviceStatus());
  }, []);

  if (!device) return null;

  const details = [
    { label: labels.model, value: device.model },
    { label: labels.serialNumber, value: device.serialNumber },
    { label: labels.firmware, value: device.firmwareVersion },
    { label: labels.lastSync, value: format(device.lastSync, 'MMM d, yyyy HH:mm') },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{labels.title}</h1>
        <p className="text-gray-600">{labels.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">{labels.connected}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-3">
              {device.connected ? (
                <Wifi className="h-8 w-8 text-green-500" />
              ) : (
                <WifiOff className="h-8 w-8 text-red-500" />
              )}
              <span className={`text-xl font-semibold ${device.connected ? 'text-green-600' : 'text-red-600'}`}>
                {device.connected ? labels.connected : labels.disconnected}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">{labels.battery}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <Battery className="h-8 w-8 text-medtronic-brightBlue" />
              <span className="text-3xl font-bold text-gray-900">{device.batteryLevel.toFixed(0)}%</span>
            </div>
            <Progress value={device.batteryLevel} className="h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">{labels.reservoir}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <Droplet className="h-8 w-8 text-medtronic-brightBlue" />
              <span className="text-3xl font-bold text-gray-900">{device.reservoirLevel.toFixed(0)}U</span>
            </div>
            <p className="text-sm text-gray-500">{labels.unitsRemaining}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{labels.deviceInfo}</CardTitle>
          <CardDescription>{labels.deviceInfoDesc}</CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="divide-y">
            {details.map(detail => (
              <div key={detail.label} className="flex items-center justify-between py-3">
                <dt className="text-sm text-gray-600">{detail.label}</dt>
                <dd className="font-medium text-gray-900">{detail.value}</dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeviceStatusPage;
