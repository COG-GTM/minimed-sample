import { Wifi } from 'lucide-react';
import DashboardSection from '@/components/DashboardSection';

const Devices = () => (
  <DashboardSection
    icon={Wifi}
    title="Device Status"
    description="Monitor your pump and sensor connectivity and status"
  />
);

export default Devices;
