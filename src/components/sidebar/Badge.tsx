import './Badge.css';

interface BadgeProps {
  value: number | string;
}

/**
 * Badge - Display numeric or status badges on menu items
 *
 * @example
 * ```tsx
 * <Badge value={5} />        // Numeric badge
 * <Badge value="New" />      // Status badge
 * <Badge value={99} />       // Shows "99+"
 * ```
 */
export function Badge({ value }: BadgeProps) {
  // Format large numbers
  const displayValue = typeof value === 'number' && value > 99 ? '99+' : value;

  // Determine badge type based on value
  const getBadgeType = (): string => {
    if (typeof value === 'number') {
      return 'badge--numeric';
    }
    return 'badge--status';
  };

  return (
    <span className={`badge ${getBadgeType()}`} aria-label={`${value} items`}>
      {displayValue}
    </span>
  );
}
