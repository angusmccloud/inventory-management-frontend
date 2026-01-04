/**
 * Card Component
 * Feature: 008-common-components
 *
 * Container component for grouping related content with consistent styling,
 * elevation, padding, and optional interactive behavior.
 */

import * as React from 'react';
import { cn } from '@/lib/cn';
import type { CardProps, CardElevation, CardPadding } from './Card.types';

/**
 * Elevation-specific styles mapping
 */
const elevationStyles: Record<CardElevation, string> = {
  flat: 'shadow-none',
  low: 'shadow-sm',
  medium: 'shadow-md',
  high: 'shadow-lg',
};

/**
 * Padding-specific styles mapping
 */
const paddingStyles: Record<CardPadding, string> = {
  none: 'p-0',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
};

/**
 * Card component for consistent content containers
 *
 * @example
 * ```tsx
 * // Basic card
 * <Card elevation="low" padding="md">
 *   <h3>Card Title</h3>
 *   <p>Card content goes here...</p>
 * </Card>
 *
 * // Interactive/clickable card
 * <Card
 *   interactive
 *   onClick={() => router.push(`/items/${item.id}`)}
 * >
 *   <ItemSummary item={item} />
 * </Card>
 *
 * // Card with custom padding
 * <Card padding="none">
 *   <div className="p-4 border-b">Header</div>
 *   <div className="p-4">Body</div>
 * </Card>
 * ```
 */
export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    { children, elevation = 'low', padding = 'md', interactive = false, className, ...props },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          // Base styles
          'rounded-lg border border-border bg-surface',
          'transition-shadow duration-200',
          // Elevation/shadow
          elevationStyles[elevation],
          // Padding
          paddingStyles[padding],
          // Interactive styles
          interactive && [
            'cursor-pointer',
            'hover:bg-surface-hover',
            'hover:shadow-md',
            'focus:outline-none focus:ring-2 focus:ring-border-focus',
          ],
          // Custom classes
          className
        )}
        tabIndex={interactive ? 0 : undefined}
        role={interactive ? 'button' : undefined}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
