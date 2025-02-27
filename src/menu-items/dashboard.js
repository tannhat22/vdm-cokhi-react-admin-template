// assets
import {
  BarChartOutlined,
  DashboardOutlined,
  HomeOutlined,
  EyeOutlined,
  SettingOutlined,
  StockOutlined,
} from '@ant-design/icons';
// icons
const icons = {
  BarChartOutlined,
  DashboardOutlined,
  HomeOutlined,
  EyeOutlined,
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
      icon: icons.HomeOutlined,
      breadcrumbs: false,
    },
    {
      id: 'overview',
      title: 'Overview',
      type: 'item',
      url: '/overview/default',
      icon: icons.EyeOutlined,
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
      id: 'stageAnalysis',
      title: 'Stage Analysis',
      type: 'item',
      url: '/stageanalysis',
      icon: icons.BarChartOutlined,
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
