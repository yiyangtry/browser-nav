import { Beaker, Home, Settings } from 'lucide-react';
import { MenuItem, SidebarConfig } from '@/types';

/**
 * Main menu configuration for the sidebar
 *
 * This array defines all menu items that appear in the sidebar navigation.
 * Each item can have:
 * - id: unique identifier
 * - label: display text
 * - icon: Lucide React icon component
 * - path: route path for navigation
 * - type: 'link' (default), 'action', 'divider', or 'custom'
 * - children: array of child items for nested menus
 * - badge: number or string for badges
 * - disabled: whether the item is disabled
 * - visible: whether the item is visible
 */
export const menuItems: MenuItem[] = [
  {
    id: 'home',
    label: '首页',
    icon: Home,
    path: '/',
    type: 'link',
  },
  {
    id: 'manage',
    label: '管理',
    icon: Settings,
    path: '/manage',
    type: 'link',
  },
  {
    id: 'lab',
    label: '实验室',
    icon: Beaker,
    children: [
      {
        id: 'lab-demo1',
        label: 'Demo 1',
        path: '/lab/demo1',
        type: 'link',
      },
    ],
  },
];

/**
 * Sidebar configuration object
 *
 * Contains the menu items and optional sidebar settings.
 * This can be customized to change the sidebar width or add header/footer content.
 */
export const menuConfig: SidebarConfig = {
  items: menuItems,
  defaultCollapsed: false,
  expandedWidth: 256,
  collapsedWidth: 64,
  // header: <div>Your Logo Here</div>,
  // footer: <div>User Info</div>,
};
