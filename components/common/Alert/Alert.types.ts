/**
 * Alert Component Type Definitions
 * Feature: 008-common-components
 * 
 * Contextual message display for notifications and feedback.
 */

import * as React from 'react';

/**
 * Alert severity levels
 */
export type AlertSeverity = 
  | 'info'       // Informational (blue)
  | 'success'    // Success message (green)
  | 'warning'    // Warning/caution (yellow)
  | 'error';     // Error message (red)

/**
 * Alert component props
 * Contextual message display for notifications and feedback.
 * 
 * @example
 * <Alert severity="success" title="Item Added">
 *   {item.name} has been added to your inventory.
 * </Alert>
 * 
 * @example
 * <Alert severity="error" dismissible onDismiss={handleDismiss}>
 *   Failed to save changes. Please try again.
 * </Alert>
 */
export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Alert severity (determines color, icon, and ARIA attributes)
   */
  severity: AlertSeverity;
  
  /**
   * Alert title (optional, displayed as bold text above message)
   */
  title?: string;
  
  /**
   * Alert message content
   */
  children: React.ReactNode;
  
  /**
   * Show close/dismiss button
   * @default false
   */
  dismissible?: boolean;
  
  /**
   * Callback when alert is dismissed (close button clicked)
   */
  onDismiss?: () => void;
  
  /**
   * Additional CSS classes
   */
  className?: string;
}
