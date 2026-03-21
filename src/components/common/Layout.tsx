import { Outlet } from 'react-router-dom';
import { SidebarLayout } from '@/components/sidebar/SidebarLayout';
import { menuConfig } from '@/config/menuConfig';

/**
 * Main layout component that wraps the application with sidebar navigation
 *
 * This component:
 * - Renders the SidebarLayout with menu configuration
 * - Provides the outlet for nested routes
 * - Integrates the sidebar with the existing routing system
 */
export function Layout() {
  return (
    <SidebarLayout menuConfig={menuConfig}>
      <Outlet />
    </SidebarLayout>
  );
}
