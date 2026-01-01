/**
 * TabNavigation Component Type Definitions
 * Feature: 008-common-components
 * 
 * Tab-based content switching with keyboard navigation.
 */

import * as React from 'react';

/**
 * Tab item definition
 */
export interface Tab {
  /**
   * Unique tab identifier
   */
  id: string;
  
  /**
   * Tab label (visible text)
   */
  label: string;
  
  /**
   * Tab icon (optional, shown before label)
   */
  icon?: React.ReactNode;
  
  /**
   * Disable this tab
   * @default false
   */
  disabled?: boolean;
  
  /**
   * Badge count (optional, shown after label)
   */
  badge?: number;
}

/**
 * TabNavigation component props
 * Tab-based content switching with keyboard navigation.
 * 
 * @example
 * const tabs = [
 *   { id: 'inventory', label: 'Inventory', icon: <BoxIcon /> },
 *   { id: 'shopping', label: 'Shopping List', badge: 5 },
 *   { id: 'members', label: 'Members' },
 * ];
 * 
 * <TabNavigation 
 *   tabs={tabs}
 *   activeTab={activeTab}
 *   onChange={setActiveTab}
 * />
 * 
 * @example
 * <TabNavigation 
 *   tabs={settingsTabs}
 *   activeTab={currentSection}
 *   onChange={handleSectionChange}
 *   orientation="vertical"
 * />
 */
export interface TabNavigationProps {
  /**
   * Array of tab definitions
   */
  tabs: Tab[];
  
  /**
   * Currently active tab ID
   */
  activeTab: string;
  
  /**
   * Tab change handler
   */
  onChange: (tabId: string) => void;
  
  /**
   * Tab orientation
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical';
  
  /**
   * Responsive display mode
   * Feature: 011-mobile-responsive-ui
   * - 'tabs': Always show as tabs (default)
   * - 'dropdown': Always show as dropdown/select
   * - 'auto': Show tabs on desktop (>=md), dropdown on mobile (<md)
   * @default 'tabs'
   */
  responsiveMode?: 'tabs' | 'dropdown' | 'auto';
  
  /**
   * Additional CSS classes
   */
  className?: string;
}
