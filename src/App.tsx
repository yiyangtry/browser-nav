import { lazy, Suspense, type ReactNode } from 'react';
import { Spin } from 'antd';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { Layout } from './components/common/Layout';

const NavigationPage = lazy(() => import('./pages/NavigationPage'));
const ManagementPage = lazy(() => import('./pages/ManagementPage'));
const Demo1Page = lazy(() => import('./pages/lab/Demo1Page'));

function withSuspense(element: ReactNode) {
  return (
    <Suspense
      fallback={
        <div className="route-loading">
          <Spin size="large" />
        </div>
      }
    >
      {element}
    </Suspense>
  );
}

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Layout />,
      children: [
        {
          index: true,
          element: withSuspense(<NavigationPage />),
        },
        {
          path: 'manage',
          element: withSuspense(<ManagementPage />),
        },
        {
          path: 'lab/demo1',
          element: withSuspense(<Demo1Page />),
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
