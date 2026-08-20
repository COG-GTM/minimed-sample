import { Activity } from 'lucide-react';
import DashboardSection from '@/components/DashboardSection';

const GlucoseMonitoring = () => (
  <DashboardSection
    icon={Activity}
    title="Glucose Monitoring"
    description="Review your continuous glucose monitoring data and trends"
  />
);

export default GlucoseMonitoring;
