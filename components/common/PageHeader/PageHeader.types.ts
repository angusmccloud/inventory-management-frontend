/**
 * PageHeader Component Type Definitions
 * Feature: 008-common-components
 * 
 * Page title header with optional breadcrumbs, description, and actions.
 */

import * as React from 'react';

/**
 * Breadcrumb item definition
 */
export interface Breadcrumb {
  /**
   * Breadcrumb label
   */
  label: string;
  
  /**
   * Breadcrumb link destination (if clickable)
   * If not provided, breadcrumb is rendered as plain text (current page)
   */
  href?: string;
}

/**
 * PageHeader component props
 * Page title header with optional breadcrumbs, description, and actions.
 * 
 * @example
 * <PageHeader 
 *   title="Inventory"
 *   description="Manage your household items and supplies"
 *   action={
 *     <Button variant="primary" onClick={() => setShowAddForm(true)}>
 *       Add Item
 *     </Button>
 *   }
 * />
 * 
 * @example
 * <PageHeader 
 *   breadcrumbs={[
 *     { label: 'Dashboard', href: '/dashboard' },
 *     { label: 'Settings', href: '/settings' },
 *     { label: 'Members' },
 *   ]}
 *   title="Family Members"
 *   action={<Button onClick={handleInvite}>Invite Member</Button>}
 *   secondaryActions={[
 *     <IconButton icon={<CogIcon />} aria-label="Settings" key="settings" />
 *   ]}
 * />
 */
export interface PageHeaderProps {
  /**
   * Page title (main heading)
   */
  title: string;
  
  /**
   * Page description (optional subtitle/supporting text)
   */
  description?: string;
  
  /**
   * Breadcrumb navigation (optional, shown above title)
   */
  breadcrumbs?: Breadcrumb[];
  
  /**
   * Primary action button (top-right)
   */
  action?: React.ReactNode;
  
  /**
   * Additional actions (shown after primary action)
   */
  secondaryActions?: React.ReactNode[];
  
  /**
   * Additional CSS classes
   */
  className?: string;
}
