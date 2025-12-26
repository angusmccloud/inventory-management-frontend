/**
 * Badge Component Types
 * Feature: 008-common-components
 * 
 * Type definitions for status indicator badge components.
 */

import * as React from 'react';

/**
 * Badge visual variants
 */
export type BadgeVariant = 
  | 'default'    // Neutral gray
  | 'primary'    // Brand blue
  | 'success'    // Green (positive status)
  | 'warning'    // Yellow (caution status)
  | 'error'      // Red (negative status)
  | 'info'       // Light blue (informational)
  | 'neutral';   // Alternative gray (alias for default)

/**
 * Badge size variants
 */
export type BadgeSize = 
  | 'sm'         // px-2 py-0.5 text-xs
  | 'md'         // px-2.5 py-0.5 text-sm (default)
  | 'lg';        // px-3 py-1 text-base

/**
 * Badge component props
 * Small status or count indicator.
 * 
 * @example
 * ```tsx
 * // Status badge
 * <Badge variant="success">Active</Badge>
 * <Badge variant="error">Removed</Badge>
 * 
 * // Count badge
 * <Badge variant="primary">{unreadCount}</Badge>
 * 
 * // Dot indicator
 * <Badge variant="warning" dot />
 * ```
 */
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /**
   * Badge variant (determines color)
   * @default 'default'
   */
  variant?: BadgeVariant;
  
  /**
   * Badge size
   * @default 'md'
   */
  size?: BadgeSize;
  
  /**
   * Badge content (text or number)
   */
  children?: React.ReactNode;
  
  /**
   * Dot indicator only (no text, shows colored dot)
   * @default false
   */
  dot?: boolean;
  
  /**
   * Additional CSS classes
   */
  className?: string;
}
