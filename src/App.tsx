import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { Layout } from './components/common/Layout';

const NavigationPage = lazy(() => import('./pages/NavigationPage'));
const ManagementPage = lazy(() => import('./pages/ManagementPage'));
const Demo1Page = lazy(() => import('./pages/lab/Demo1Page'));

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Layout />,
      children: [
        {
          index: true,
          element: (
            <Suspense fallback={<div>Loading...</div>}>
              <NavigationPage />
            </Suspense>
          ),
        },
        {
          path: 'manage',
          element: (
            <Suspense fallback={<div>Loading...</div>}>
              <ManagementPage />
            </Suspense>
          ),
        },
        {
          path: 'lab/demo1',
          element: (
            <Suspense fallback={<div>Loading...</div>}>
              <Demo1Page />
            </Suspense>
          ),
        },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/" replace />,
    },
  ],
  {
    basename: '/browser-nav',
  }
);

export function App() {
  return <RouterProvider router={router} />;
}
