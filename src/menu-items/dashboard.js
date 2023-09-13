// assets
import { DashboardOutlined, HomeOutlined } from '@ant-design/icons';

// icons
const icons = {
  DashboardOutlined,
  HomeOutlined,
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const dashboard = {
  id: 'group-dashboard',
  title: 'Navigation',
  type: 'group',
  children: [
    {
      id: 'overview',
      title: 'Overview',
      type: 'item',
      url: '/overview/default',
      icon: icons.HomeOutlined,
      breadcrumbs: false,
    },
    {
      id: 'dashboard',
      title: 'Dashboard',
      type: 'item',
      url: '/dashboard',
      icon: icons.DashboardOutlined,
      breadcrumbs: false,
    },
  ],
};

export default dashboard;
