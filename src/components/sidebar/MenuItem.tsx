import { NavLink } from 'react-router-dom';
import { MenuItem as MenuItemType } from '@/types';
import { Badge } from './Badge';
import './MenuItem.css';

interface MenuItemProps {
  item: MenuItemType;
  isCollapsed?: boolean;
  isActive?: boolean;
}

/**
 * MenuItem - Individual menu item component
 *
 * Renders a single menu item with:
 * - Icon (optional)
 * - Label
 * - Badge (optional)
 * - Active state highlighting
 * - Disabled state handling
 * - Keyboard navigation support
 *
 * @example
 * ```tsx
 * <MenuItem
 *   item={{
 *     id: 'home',
 *     label: 'Home',
 *     icon: Home,
 *     path: '/',
 *     badge: 5
 *   }}
 *   isCollapsed={false}
 * />
 * ```
 */
export function MenuItemComponent({ item, isCollapsed = false, isActive }: MenuItemProps) {
  // Don't render if disabled and no special handling needed
  if (item.disabled) {
    return (
      <li className="menu-item menu-item--disabled">
        <span className="menu-item__link" tabIndex={-1}>
          <MenuItemContent item={item} isCollapsed={isCollapsed} />
        </span>
      </li>
    );
  }

  // Handle action type (button without navigation)
  if (item.type === 'action') {
    return (
      <li className="menu-item">
        <button
          className="menu-item__button"
          onClick={item.onClick}
          aria-label={item.label}
          disabled={item.disabled}
        >
          <MenuItemContent item={item} isCollapsed={isCollapsed} />
        </button>
      </li>
    );
  }

  // Handle custom component type
  if (item.type === 'custom') {
    return <li>{/* Custom component rendering would go here */}</li>;
  }

  // Handle link type (default)
  const linkContent = (
    <NavLink
      to={item.path || ''}
      className={({ isActive: isLinkActive }) =>
        `menu-item__link ${isLinkActive || isActive ? 'menu-item__link--active' : ''}`
      }
      aria-label={item.label}
      aria-current={isActive ? 'page' : undefined}
      end
    >
      <MenuItemContent item={item} isCollapsed={isCollapsed} />
    </NavLink>
  );

  return <li className="menu-item">{linkContent}</li>;
}

interface MenuItemContentProps {
  item: MenuItemType;
  isCollapsed: boolean;
}

/**
 * MenuItemContent - Internal component for rendering menu item content
 */
function MenuItemContent({ item, isCollapsed }: MenuItemContentProps) {
  const Icon = item.icon;
  const hasBadge = item.badge !== undefined;

  return (
    <>
      {/* Icon */}
      {Icon && (
        <span className="menu-item__icon" aria-hidden="true">
          <Icon size={20} strokeWidth={2} />
        </span>
      )}

      {/* Label - hidden when collapsed unless there's no icon */}
      {!isCollapsed || !Icon ? (
        <span className="menu-item__label">
          {item.label}
        </span>
      ) : null}

      {/* Badge */}
      {hasBadge && !isCollapsed && (
        <Badge value={item.badge!} />
      )}

      {/* Chevron for submenu indication (always shown on desktop) */}
      {/* Note: This is handled by SubMenu component */}
    </>
  );
}
