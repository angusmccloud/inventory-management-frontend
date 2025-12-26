/**
 * EmptyState Component Type Definitions
 * Feature: 008-common-components
 * 
 * Placeholder displayed when no data is available in a list or view.
 */

import * as React from 'react';
import { ButtonVariant } from '../Button/Button.types';

/**
 * EmptyState component props
 * Placeholder displayed when no data is available in a list or view.
 * 
 * @example
 * <EmptyState 
 *   icon={<BoxIcon />}
 *   title="No Inventory Items"
 *   description="Add your first item to get started."
 *   action={{
 *     label: "Add Item",
 *     onClick: () => setShowAddForm(true),
 *     variant: "primary"
 *   }}
 * />
 * 
 * @example
 * <EmptyState 
 *   icon={<UserGroupIcon />}
 *   title="No Members Yet"
 *   description="Invite family members to collaborate."
 *   action={{
 *     label: "Invite Member",
 *     onClick: handleInvite
 *   }}
 *   secondaryAction={{
 *     label: "Learn More",
 *     onClick: () => router.push('/docs/members')
 *   }}
 * />
 */
export interface EmptyStateProps {
  /**
   * Icon to display (React element, usually from Heroicons)
   */
  icon?: React.ReactNode;
  
  /**
   * Primary message title
   */
  title: string;
  
  /**
   * Supporting description text
   */
  description?: string;
  
  /**
   * Primary action button
   */
  action?: {
    /**
     * Button label
     */
    label: string;
    
    /**
     * Click handler
     */
    onClick: () => void;
    
    /**
     * Button variant
     * @default 'primary'
     */
    variant?: ButtonVariant;
  };
  
  /**
   * Secondary action button (link-style, shown below primary)
   */
  secondaryAction?: {
    /**
     * Link label
     */
    label: string;
    
    /**
     * Click handler
     */
    onClick: () => void;
  };
  
  /**
   * Additional CSS classes
   */
  className?: string;
}
