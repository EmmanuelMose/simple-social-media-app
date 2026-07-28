import { 
  AiOutlineUser, 
  AiOutlineBarChart, 
  AiOutlineFileText, 
  AiOutlineMessage,
  AiOutlineLogout 
} from 'react-icons/ai';

export type DrawerItem = {
  id: string;
  name: string;
  icon: React.ComponentType<{ size?: number }>;
  link: string;
  requiresElectionClosed?: boolean;
};

export const adminDrawerData: DrawerItem[] = [
  {
    id: 'users',
    name: 'Manage Users',
    icon: AiOutlineUser,
    link: 'manage-users',
  },
  {
    id: 'results',
    name: 'View Results',
    icon: AiOutlineBarChart,
    link: 'view-results',
  },
  {
    id: 'reports',
    name: 'Reports',
    icon: AiOutlineFileText,
    link: 'reports',
  },
  {
    id: 'analytics',
    name: 'Analytics',
    icon: AiOutlineBarChart,
    link: 'analytics',
  },
  {
    id: 'complaints',
    name: 'Complaints',
    icon: AiOutlineMessage,
    link: 'complaints',
  },
  {
    id: 'logout',
    name: 'Log Out',
    icon: AiOutlineLogout,
    link: 'logout',
  },
];