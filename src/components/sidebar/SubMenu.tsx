import { useRef } from 'react';
import { MenuItem } from '@/types';
import { ChevronDown } from 'lucide-react';
import { MenuItemComponent } from './MenuItem';
import './SubMenu.css';

interface SubMenuProps {
  item: MenuItem;
  isCollapsed?: boolean;
  isExpanded?: boolean;
  onToggle?: () => void;
}

/**
 * SubMenu - Expandable menu section with child items
 *
 * Handles:
 * - Toggle expand/collapse
 * - Smooth animations
 * - ARIA attributes for accessibility
 * - Keyboard navigation
 *
 * @example
 * ```tsx
 * <SubMenu
 *   item={{
 *     id: 'settings',
 *     label: 'Settings',
 *     icon: Settings,
 *     children: [...]
 *   }}
 *   isExpanded={true}
 *   onToggle={handleToggle}
 * />
 * ```
 */
export function SubMenu({ item, isCollapsed = false, isExpanded = false, onToggle }: SubMenuProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const Icon = item.icon;

  // Handle keyboard interaction
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onToggle?.();
    }
  };

  // Handle toggle with animation
  const handleToggle = () => {
    onToggle?.();
  };

  // Filter visible child items
  const visibleChildren = item.children?.filter(child => child.visible !== false) || [];

  if (visibleChildren.length === 0) {
    return null;
  }

  return (
    <li className="submenu">
      {/* Submenu Trigger */}
      <div
        className={`submenu__trigger ${isExpanded ? 'submenu__trigger--active' : ''}`}
        onClick={!item.disabled ? handleToggle : undefined}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={item.disabled ? -1 : 0}
        aria-expanded={isExpanded}
        aria-haspopup="true"
        aria-disabled={item.disabled}
      >
        {/* Icon */}
        {Icon && (
          <span className="submenu__icon" aria-hidden="true">
            <Icon size={20} strokeWidth={2} />
          </span>
        )}

        {/* Label */}
        {!isCollapsed && (
          <span className="submenu__label">
            {item.label}
          </span>
        )}

        {/* Chevron */}
        {!isCollapsed && (
          <span className="submenu__chevron" aria-hidden="true">
            <ChevronDown
              size={16}
              style={{
                transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s ease',
              }}
            />
          </span>
        )}

        {/* Badge */}
        {item.badge !== undefined && !isCollapsed && (
          <span className="submenu__badge" aria-label={`${item.badge} items`}>
            {typeof item.badge === 'number' && item.badge > 99 ? '99+' : item.badge}
          </span>
        )}
      </div>

      {/* Submenu Content */}
      <div
        ref={contentRef}
        className={`submenu__content ${isExpanded ? 'submenu__content--expanded' : ''}`}
        aria-hidden={!isExpanded}
      >
        <ul className="submenu__list" role="list">
          {visibleChildren.map((child) => (
            <MenuItemComponent
              key={child.id}
              item={child}
              isCollapsed={false}
            />
          ))}
        </ul>
      </div>
    </li>
  );
}
