import { useState } from 'react';
import { X, AlertTriangle, Activity, Droplet, Wifi, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

interface Notification {
  id: string;
  type: 'glucose_alert' | 'insulin_delivery' | 'device_status' | 'system';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

const generateMockNotifications = (): Notification[] => {
  const now = new Date();
  return [
    {
      id: '1',
      type: 'glucose_alert',
      title: 'High Glucose Alert',
      message: 'Your glucose level is 195 mg/dL, above target range.',
      timestamp: new Date(now.getTime() - 10 * 60000),
      read: false,
    },
    {
      id: '2',
      type: 'insulin_delivery',
      title: 'Bolus Delivered',
      message: 'Meal bolus of 4.2 units delivered successfully.',
      timestamp: new Date(now.getTime() - 45 * 60000),
      read: false,
    },
    {
      id: '3',
      type: 'device_status',
      title: 'Sensor Expiring Soon',
      message: 'Your CGM sensor will expire in 6 hours. Please prepare a replacement.',
      timestamp: new Date(now.getTime() - 2 * 3600000),
      read: false,
    },
    {
      id: '4',
      type: 'glucose_alert',
      title: 'Glucose Back in Range',
      message: 'Your glucose level returned to target range at 142 mg/dL.',
      timestamp: new Date(now.getTime() - 3 * 3600000),
      read: true,
    },
    {
      id: '5',
      type: 'insulin_delivery',
      title: 'Auto Correction',
      message: 'Auto correction bolus of 0.8 units delivered.',
      timestamp: new Date(now.getTime() - 5 * 3600000),
      read: true,
    },
    {
      id: '6',
      type: 'device_status',
      title: 'Pump Connected',
      message: 'MiniMed 780G reconnected via Bluetooth.',
      timestamp: new Date(now.getTime() - 8 * 3600000),
      read: true,
    },
    {
      id: '7',
      type: 'system',
      title: 'Software Update Available',
      message: 'A new firmware update (v7.5.0) is available for your pump.',
      timestamp: new Date(now.getTime() - 24 * 3600000),
      read: true,
    },
  ];
};

const getNotificationIcon = (type: Notification['type']) => {
  switch (type) {
    case 'glucose_alert':
      return <AlertTriangle className="h-5 w-5 text-amber-500" />;
    case 'insulin_delivery':
      return <Droplet className="h-5 w-5 text-blue-500" />;
    case 'device_status':
      return <Wifi className="h-5 w-5 text-green-500" />;
    case 'system':
      return <Activity className="h-5 w-5 text-purple-500" />;
  }
};

const getNotificationBgColor = (type: Notification['type']) => {
  switch (type) {
    case 'glucose_alert':
      return 'bg-amber-50';
    case 'insulin_delivery':
      return 'bg-blue-50';
    case 'device_status':
      return 'bg-green-50';
    case 'system':
      return 'bg-purple-50';
  }
};

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState<Notification[]>(generateMockNotifications);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 z-40"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gradient-medtronic text-white">
          <div>
            <h2 className="text-lg font-semibold">Notifications</h2>
            {unreadCount > 0 && (
              <p className="text-sm text-white/80">{unreadCount} unread</p>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-white hover:bg-white/20 text-xs"
              >
                <Check className="h-4 w-4 mr-1" />
                Mark all read
              </Button>
            )}
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <Activity className="h-12 w-12 mb-2 opacity-50" />
              <p>No notifications</p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map(notification => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                    !notification.read ? 'border-l-4 border-l-medtronic-brightBlue' : ''
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${getNotificationBgColor(notification.type)}`}>
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className={`text-sm font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-600'}`}>
                          {notification.title}
                        </p>
                        {!notification.read && (
                          <span className="w-2 h-2 bg-medtronic-brightBlue rounded-full flex-shrink-0 ml-2" />
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {format(notification.timestamp, 'MMM d, h:mm a')}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default NotificationsPanel;
