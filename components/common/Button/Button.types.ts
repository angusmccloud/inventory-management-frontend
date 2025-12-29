/**
 * Button and IconButton Component Type Definitions
 * Feature: 008-common-components
 * 
 * Primary action buttons with variants for different contexts.
 */

import * as React from 'react';

/**
 * Button visual style variants
 */
export type ButtonVariant = 
  | 'primary'    // Main call-to-action (filled, high contrast)
  | 'secondary'  // Alternative actions (outlined or subtle fill)
  | 'danger'     // Destructive actions (red/warning color)
  | 'warning';   // Warning/cancel actions (amber color)

/**
 * Button size variants
 */
export type ButtonSize = 
  | 'sm'         // Small: px-3 py-1.5 text-sm
  | 'md'         // Medium: px-4 py-2 text-base (default)
  | 'lg';        // Large: px-6 py-3 text-lg

/**
 * Button component props
 * 
 * @example
 * <Button variant="primary" onClick={handleSave} loading={isSaving}>
 *   Save Changes
 * </Button>
 * 
 * @example
 * <Button variant="danger" leftIcon={<TrashIcon />} onClick={handleDelete}>
 *   Delete Item
 * </Button>
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Button visual variant
   * @default 'primary'
   */
  variant?: ButtonVariant;
  
  /**
   * Button size
   * @default 'md'
   */
  size?: ButtonSize;
  
  /**
   * Button content (text label)
   */
  children: React.ReactNode;
  
  /**
   * Loading state (shows spinner, disables interaction)
   * @default false
   */
  loading?: boolean;
  
  /**
   * Full width button (w-full)
   * @default false
   */
  fullWidth?: boolean;
  
  /**
   * Additional CSS classes
   */
  className?: string;
  
  /**
   * Icon to display before children (left side)
   */
  leftIcon?: React.ReactNode;
  
  /**
   * Icon to display after children (right side)
   */
  rightIcon?: React.ReactNode;
}
