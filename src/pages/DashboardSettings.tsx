import { Settings } from 'lucide-react';
import DashboardSection from '@/components/DashboardSection';

const DashboardSettings = () => (
  <DashboardSection
    icon={Settings}
    title="Settings"
    description="Configure your dashboard preferences and device settings"
  />
);

export default DashboardSettings;
