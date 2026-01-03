/**
 * Badge Component
 * Feature: 008-common-components
 * 
 * Small status or count indicator with multiple variants and sizes.
 */

import * as React from 'react';
import { cn } from '@/lib/cn';
import type { BadgeProps, BadgeVariant, BadgeSize } from './Badge.types';

/**
 * Variant-specific styles (background and text colors)
 * Matches Button component pattern for consistent contrast
 */
const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-surface-elevated text-text-secondary border border-border',
  primary: 'bg-primary text-primary-contrast border border-primary',
  success: 'bg-success text-success-contrast border border-success',
  warning: 'bg-warning text-warning-contrast border border-warning',
  error: 'bg-error text-error-contrast border border-error',
  info: 'bg-info text-info-contrast border border-info',
  neutral: 'bg-surface-elevated text-text-secondary border border-border',
};

/**
 * Size-specific styles (padding and text size)
 */
const sizeStyles: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-0.5 text-sm',
  lg: 'px-3 py-1 text-base',
};

/**
 * Dot-only variant styles (circular dots)
 */
const dotStyles: Record<BadgeVariant, string> = {
  default: 'bg-surface-elevated border-border',
  primary: 'bg-primary',
  success: 'bg-success',
  warning: 'bg-warning',
  error: 'bg-error',
  info: 'bg-info',
  neutral: 'bg-surface-elevated border-border',
};

/**
 * Badge component
 * 
 * Status indicator or count badge with multiple variants and sizes.
 * Can render as text badge or dot-only indicator.
 * 
 * @example
 * ```tsx
 * // Status badges
 * <Badge variant="success">Active</Badge>
 * <Badge variant="error">Removed</Badge>
 * <Badge variant="warning">Low Stock</Badge>
 * 
 * // Count badges
 * <Badge variant="primary">{unreadCount}</Badge>
 * <Badge variant="info">12</Badge>
 * 
 * // Dot indicators
 * <Badge variant="success" dot />
 * <Badge variant="error" dot />
 * 
 * // Different sizes
 * <Badge size="sm" variant="primary">Small</Badge>
 * <Badge size="lg" variant="success">Large</Badge>
 * ```
 */
export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  size = 'md',
  children,
  dot = false,
  className,
  ...props
}) => {
  // Dot-only indicator
  if (dot) {
    return (
      <span
        className={cn(
          'inline-block rounded-full border',
          'w-2 h-2',
          dotStyles[variant],
          className
        )}
        {...props}
      />
    );
  }

  // Text badge
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center',
        'rounded-full font-medium whitespace-nowrap',
        'leading-none',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

Badge.displayName = 'Badge';
