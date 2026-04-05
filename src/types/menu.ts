import type { ReactNode } from 'react';

/**
 * Menu item type definitions for the sidebar menu system
 */
export interface MenuItem {
  /** Unique identifier for the menu item */
  id: string;
  /** Display label for the menu item */
  label: string;
  /** Icon element for the menu item (optional) */
  icon?: ReactNode;
  /** Type of menu item: link, action, divider, or custom */
  type?: 'link' | 'action' | 'divider' | 'custom';
  /** Route path for navigation links (used when type is 'link') */
  path?: string;
  /** Click handler for action items (used when type is 'action') */
  onClick?: () => void;
  /** Child menu items for nested/submenu structures */
  children?: MenuItem[];
  /** Badge content - can be a number or string */
  badge?: number | string;
  /** Whether the menu item is disabled */
  disabled?: boolean;
  /** Whether the menu item is visible */
  visible?: boolean;
}

/**
 * Configuration options for the sidebar layout
 */
export interface SidebarConfig {
  /** Array of menu items to display */
  items: MenuItem[];
  /** Default collapsed state for desktop */
  defaultCollapsed?: boolean;
  /** Width of sidebar when expanded (default: 256px) */
  expandedWidth?: number;
  /** Width of sidebar when collapsed (default: 64px) */
  collapsedWidth?: number;
  /** Custom header component */
  header?: ReactNode;
  /** Custom footer component */
  footer?: ReactNode;
}

/**
 * Type for grouped menu items
 */
export type MenuGroup = {
  id: string;
  label: string;
  items: MenuItem[];
};

/**
 * Props for menu item components
 */
export interface MenuItemProps {
  item: MenuItem;
  isActive?: boolean;
  isCollapsed?: boolean;
  onToggle?: (itemId: string) => void;
  expandedItems?: Record<string, boolean>;
}

/**
 * Props for sidebar layout component
 */
export interface SidebarLayoutProps {
  children: ReactNode;
  menuConfig: SidebarConfig;
}

/**
 * Storage key for sidebar state persistence
 */
export const SIDEBAR_STORAGE_KEY = 'sidebar-state-v1';
