import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';
import CustomerRoutes from './CustomerRoutes';

// render - sample page
const SamplePage = Loadable(lazy(() => import('pages/extra-pages/sample-page')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
    path: '/',
    element: <DashboardLayout />,
    children: [
        {
            index: true,
            element: <SamplePage />
        },
        CustomerRoutes
    ],
};

export default MainRoutes;
