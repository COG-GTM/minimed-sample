import { FileText } from 'lucide-react';
import DashboardSection from '@/components/DashboardSection';

const Reports = () => (
  <DashboardSection
    icon={FileText}
    title="Reports"
    description="Generate and download your diabetes management reports"
  />
);

export default Reports;
