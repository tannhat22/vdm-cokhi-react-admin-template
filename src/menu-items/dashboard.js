// assets
import { DashboardOutlined, HomeOutlined, LayoutOutlined, SettingOutlined, StockOutlined } from '@ant-design/icons';

// icons
const icons = {
  DashboardOutlined,
  HomeOutlined,
  LayoutOutlined,
  SettingOutlined,
  StockOutlined,
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const dashboard = {
  id: 'group-dashboard',
  title: 'Navigation',
  type: 'group',
  children: [
    {
      id: 'layout',
      title: 'Layout',
      type: 'item',
      url: '/layout',
      icon: icons.LayoutOutlined,
      breadcrumbs: false,
    },
    {
      id: 'overview',
      title: 'Overview',
      type: 'item',
      url: '/overview/default',
      icon: icons.HomeOutlined,
      breadcrumbs: true,
    },
    {
      id: 'analysis',
      title: 'Analysis',
      type: 'item',
      url: '/analysis',
      icon: icons.StockOutlined,
      breadcrumbs: true,
    },
    {
      id: 'dashboard',
      title: 'Dashboard',
      type: 'item',
      url: '/dashboard',
      icon: icons.DashboardOutlined,
      breadcrumbs: true,
    },
    {
      id: 'setting',
      title: 'Setting',
      type: 'item',
      url: '/setting',
      icon: icons.SettingOutlined,
      breadcrumbs: true,
    },
  ],
};

export default dashboard;
