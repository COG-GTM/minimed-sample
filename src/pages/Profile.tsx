import { User } from 'lucide-react';
import DashboardSection from '@/components/DashboardSection';

const Profile = () => (
  <DashboardSection
    icon={User}
    title="Profile"
    description="View and update your personal account information"
  />
);

export default Profile;
