import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';
// render - sample page
const CustomerListPage = Loadable(lazy(() => import('pages/customers/ListPage')));
const CustomerCreatePage = Loadable(lazy(() => import('pages/customers/CreatePage')));
const CustomerDetailPage = Loadable(lazy(() => import('pages/customers/DetailPage')));
const CustomerEditPage = Loadable(lazy(() => import('pages/customers/EditPage')));

// ==============================|| MAIN ROUTING ||============================== //

const CustomerRoutes = {
    path: '/customers',
    children: [
        {
            index: true,
            element: <CustomerListPage />
        },
        {
            path: 'create',
            element: <CustomerCreatePage />
        },
        {
            path: ':id',
            element: <CustomerDetailPage />
        },
        {
            path: ':id/edit',
            element: <CustomerEditPage />
        }
    ]
};

export default CustomerRoutes;
