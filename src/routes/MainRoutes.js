import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import MainLayout from 'layout/MainLayout';

// render - overview
const OverviewPageDefault = Loadable(lazy(() => import('pages/overview')));

// render - overview
const Analysis = Loadable(lazy(() => import('pages/analysis')));

// render - dashboard
const Dashboard = Loadable(lazy(() => import('pages/dashboard')));

// render - layout
const Layout = Loadable(lazy(() => import('pages/layout')));

// render - setting
const Setting = Loadable(lazy(() => import('pages/setting')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: <Layout />,
    },
    {
      path: 'layout',
      element: <Layout />,
    },
    {
      path: 'overview',
      // element: <OverviewPageDefault />,
      children: [
        {
          path: 'default',
          element: <OverviewPageDefault />,
        },
      ],
    },
    {
      path: 'analysis',
      element: <Analysis />,
    },
    {
      path: 'dashboard',
      element: <Dashboard />,
    },
    {
      path: 'setting',
      element: <Setting />,
    },
  ],
};

export default MainRoutes;
