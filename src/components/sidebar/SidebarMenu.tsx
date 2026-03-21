import { MenuItem } from '@/types';
import { MenuItemComponent } from './MenuItem';
import { MenuDivider } from './MenuDivider';
import { SubMenu } from './SubMenu';
import './SidebarMenu.css';

interface SidebarMenuProps {
  items: MenuItem[];
  isCollapsed?: boolean;
  expandedGroups?: Record<string, boolean>;
  onToggleGroup?: (groupId: string) => void;
}

/**
 * SidebarMenu - Root menu component that renders menu items
 *
 * Automatically handles:
 * - Different menu item types (link, action, divider, custom)
 * - Nested menu structures
 * - Icons and badges
 * - Active state highlighting
 *
 * @example
 * ```tsx
 * <SidebarMenu
 *   items={menuItems}
 *   isCollapsed={false}
 *   expandedGroups={expandedGroups}
 *   onToggleGroup={toggleGroup}
 * />
 * ```
 */
export function SidebarMenu({
  items,
  isCollapsed = false,
  expandedGroups = {},
  onToggleGroup,
}: SidebarMenuProps) {
  // Filter out invisible items
  const visibleItems = items.filter(item => item.visible !== false);

  if (visibleItems.length === 0) {
    return (
      <div className="sidebar-menu__empty">
        No menu items
      </div>
    );
  }

  return (
    <ul className="sidebar-menu" role="list">
      {visibleItems.map((item) => {
        // Handle divider type
        if (item.type === 'divider') {
          return <MenuDivider key={item.id} />;
        }

        // Handle items with children (submenu)
        if (item.children && item.children.length > 0) {
          return (
            <SubMenu
              key={item.id}
              item={item}
              isCollapsed={isCollapsed}
              isExpanded={expandedGroups[item.id] || false}
              onToggle={() => onToggleGroup?.(item.id)}
            />
          );
        }

        // Handle regular menu items
        return (
          <MenuItemComponent
            key={item.id}
            item={item}
            isCollapsed={isCollapsed}
          />
        );
      })}
    </ul>
  );
}
