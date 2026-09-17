import { Activity, Droplet, FileText, Home, LucideIcon, Settings, Wifi } from 'lucide-react';

export interface NavItem {
  path: string;
  label: string;
  icon: LucideIcon;
  end?: boolean;
}

export const appNavItems: NavItem[] = [
  { path: '/dashboard', label: 'Overview', icon: Home, end: true },
  { path: '/dashboard/glucose', label: 'Glucose Monitoring', icon: Activity },
  { path: '/dashboard/insulin', label: 'Insulin Management', icon: Droplet },
  { path: '/dashboard/device', label: 'Device Status', icon: Wifi },
  { path: '/dashboard/reports', label: 'Reports', icon: FileText },
  { path: '/dashboard/settings', label: 'Settings', icon: Settings },
];
