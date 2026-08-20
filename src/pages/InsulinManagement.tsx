import { Droplet } from 'lucide-react';
import DashboardSection from '@/components/DashboardSection';

const InsulinManagement = () => (
  <DashboardSection
    icon={Droplet}
    title="Insulin Management"
    description="Manage your basal and bolus insulin delivery settings"
  />
);

export default InsulinManagement;
