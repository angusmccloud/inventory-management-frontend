/**
 * TabNavigation Component
 * Feature: 008-common-components
 * 
 * Tab-based content switching with keyboard navigation and ARIA support.
 */

'use client';

import * as React from 'react';
import { TabNavigationProps } from './TabNavigation.types';
import { Badge } from '../Badge/Badge';
import { cn } from '@/lib/cn';

/**
 * TabNavigation component
 */
export const TabNavigation: React.FC<TabNavigationProps> = ({ 
  tabs, 
  activeTab, 
  onChange, 
  orientation = 'horizontal',
  responsiveMode = 'tabs',
  className 
}) => {
  const tabRefs = React.useRef<Map<string, HTMLButtonElement>>(new Map());
  
  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent, currentIndex: number) => {
    const enabledTabs = tabs.filter(tab => !tab.disabled);
    const currentTab = tabs[currentIndex];
    if (!currentTab) return;
    const currentTabIndex = enabledTabs.findIndex(tab => tab.id === currentTab.id);
    
    let nextIndex = currentTabIndex;
    
    if (orientation === 'horizontal') {
      if (e.key === 'ArrowRight') {
        nextIndex = (currentTabIndex + 1) % enabledTabs.length;
        e.preventDefault();
      } else if (e.key === 'ArrowLeft') {
        nextIndex = (currentTabIndex - 1 + enabledTabs.length) % enabledTabs.length;
        e.preventDefault();
      }
    } else {
      if (e.key === 'ArrowDown') {
        nextIndex = (currentTabIndex + 1) % enabledTabs.length;
        e.preventDefault();
      } else if (e.key === 'ArrowUp') {
        nextIndex = (currentTabIndex - 1 + enabledTabs.length) % enabledTabs.length;
        e.preventDefault();
      }
    }
    
    if (e.key === 'Home') {
      nextIndex = 0;
      e.preventDefault();
    } else if (e.key === 'End') {
      nextIndex = enabledTabs.length - 1;
      e.preventDefault();
    }
    
    if (nextIndex !== currentTabIndex) {
      const nextTab = enabledTabs[nextIndex];
      if (nextTab) {
        onChange(nextTab.id);
        tabRefs.current.get(nextTab.id)?.focus();
      }
    }
  };
  
  // Determine if we should show dropdown (based on responsiveMode)
  const showDropdown = responsiveMode === 'dropdown';
  const showAutoResponsive = responsiveMode === 'auto';
  
  return (
    <>
      {/* Dropdown view (mobile for 'auto' mode, always for 'dropdown' mode) */}
      {(showDropdown || showAutoResponsive) && (
        <div className={cn(
          showAutoResponsive && 'md:hidden',
          'w-full',
          className
        )}>
          <label htmlFor="tab-select" className="sr-only">
            Select tab
          </label>
          <select
            id="tab-select"
            value={activeTab}
            onChange={(e) => onChange(e.target.value)}
            className={cn(
              'w-full px-4 py-2 text-sm font-medium',
              'border border-border rounded-md',
              'bg-surface text-text-default',
              'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          >
            {tabs.map((tab) => (
              <option key={tab.id} value={tab.id} disabled={tab.disabled}>
                {tab.label}
                {tab.badge !== undefined && tab.badge > 0 ? ` (${tab.badge})` : ''}
              </option>
            ))}
          </select>
        </div>
      )}
      
      {/* Tabs view (desktop for 'auto' mode, always for 'tabs' mode) */}
      <div 
        role="tablist"
        aria-orientation={orientation}
        className={cn(
          'flex',
          showAutoResponsive && 'hidden md:flex',
          showDropdown && 'hidden',
          orientation === 'horizontal' 
            ? 'border-b border-border' 
            : 'flex-col border-r border-border',
          className
        )}
      >
      {tabs.map((tab, index) => {
        const isActive = tab.id === activeTab;
        
        return (
          <button
            key={tab.id}
            ref={(el) => {
              if (el) {
                tabRefs.current.set(tab.id, el);
              } else {
                tabRefs.current.delete(tab.id);
              }
            }}
            role="tab"
            aria-selected={isActive}
            aria-controls={`tabpanel-${tab.id}`}
            id={`tab-${tab.id}`}
            disabled={tab.disabled}
            tabIndex={isActive ? 0 : -1}
            onClick={() => !tab.disabled && onChange(tab.id)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
              orientation === 'horizontal' ? '-mb-px' : '',
              isActive
                ? orientation === 'horizontal'
                  ? 'border-b-2 border-primary text-text-default'
                  : 'border-r-2 border-primary text-text-default bg-primary/10'
                : 'border-b-2 border-transparent text-text-secondary hover:text-text-default hover:border-border',
              tab.disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            {/* Icon */}
            {tab.icon && (
              <span className="flex-shrink-0">
                {React.isValidElement(tab.icon)
                  ? React.cloneElement(tab.icon, {
                      className: cn('h-5 w-5', (tab.icon.props as { className?: string }).className),
                    } as React.HTMLAttributes<HTMLElement>)
                  : tab.icon}
              </span>
            )}
            
            {/* Label */}
            <span>{tab.label}</span>
            
            {/* Badge */}
            {tab.badge !== undefined && tab.badge > 0 && (
              <Badge 
                variant={isActive ? 'primary' : 'default'} 
                size="sm"
              >
                {tab.badge}
              </Badge>
            )}
          </button>
        );
      })}
      </div>
    </>
  );
};

TabNavigation.displayName = 'TabNavigation';

export default TabNavigation;
