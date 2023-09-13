import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import MainLayout from 'layout/MainLayout';

// render - dashboard
const Dashboard = Loadable(lazy(() => import('pages/dashboard')));

// render - overview
const OverviewPageDefault = Loadable(lazy(() => import('pages/overview')));

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
      //     path: 'default',
      //     element: <Dashboard />,
      //   },
      // ],
    },
  ],
};

export default MainRoutes;
