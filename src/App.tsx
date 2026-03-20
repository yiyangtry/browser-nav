import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { Layout } from './components/common/Layout';

const NavigationPage = lazy(() => import('./pages/NavigationPage'));
const ManagementPage = lazy(() => import('./pages/ManagementPage'));

const router = createBrowserRouter([
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
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);

export function App() {
  return <RouterProvider router={router} />;
}
