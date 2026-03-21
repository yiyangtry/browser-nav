import './MenuDivider.css';

/**
 * MenuDivider - Horizontal separator line for visual grouping
 *
 * @example
 * ```tsx
 * <MenuDivider />
 * ```
 */
export function MenuDivider() {
  return <li className="menu-divider" role="separator" aria-orientation="horizontal" />;
}
