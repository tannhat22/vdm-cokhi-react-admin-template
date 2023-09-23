import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import MainLayout from 'layout/MainLayout';

// render - overview
const OverviewPageDefault = Loadable(lazy(() => import('pages/overview')));

// render - dashboard
const Dashboard = Loadable(lazy(() => import('pages/dashboard')));

// render - setting
const Setting = Loadable(lazy(() => import('pages/setting')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: <OverviewPageDefault />,
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
      path: 'dashboard',
      element: <Dashboard />,
      // children: [
      //   {
      //     path: ':machinename',
      //     element: <Dashboard />,
      //   },
      // ],
    },
    {
      path: 'setting',
      element: <Setting />,
    },
  ],
};

export default MainRoutes;
