/**
 * PageHeader Component
 * Feature: 008-common-components
 * 
 * Page title header with breadcrumbs, description, and action buttons.
 */

'use client';

import * as React from 'react';
import { ChevronRightIcon } from '@heroicons/react/20/solid';
import { PageHeaderProps } from './PageHeader.types';
import { Text } from '../Text/Text';
import { Link } from '../Link/Link';
import { cn } from '@/lib/cn';

/**
 * PageHeader component
 */
export const PageHeader: React.FC<PageHeaderProps> = ({ 
  title, 
  description, 
  breadcrumbs,
  action,
  secondaryActions,
  className 
}) => {
  return (
    <div className={cn('mb-6', className)}>
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="mb-2" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-sm">
            {breadcrumbs.map((breadcrumb, index) => {
              const isLast = index === breadcrumbs.length - 1;
              
              return (
                <li key={index} className="flex items-center gap-2">
                  {breadcrumb.href ? (
                    <Link 
                      href={breadcrumb.href} 
                      variant="subtle"
                      className="hover:text-gray-900 dark:hover:text-gray-100"
                    >
                      {breadcrumb.label}
                    </Link>
                  ) : (
                    <span 
                      className="text-gray-600 dark:text-gray-400"
                      aria-current={isLast ? 'page' : undefined}
                    >
                      {breadcrumb.label}
                    </span>
                  )}
                  
                  {!isLast && (
                    <ChevronRightIcon 
                      className="h-4 w-4 text-gray-400 dark:text-gray-500" 
                      aria-hidden="true" 
                    />
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      )}
      
      {/* Title and Actions Row */}
      <div className="flex items-start justify-between gap-4">
        {/* Title and Description */}
        <div className="flex-1 min-w-0">
          <Text 
            as="h1" 
            variant="h1" 
            className="text-gray-900 dark:text-gray-100"
          >
            {title}
          </Text>
          
          {description && (
            <Text 
              variant="body" 
              className="mt-2 text-gray-600 dark:text-gray-400"
            >
              {description}
            </Text>
          )}
        </div>
        
        {/* Actions */}
        {(action || (secondaryActions && secondaryActions.length > 0)) && (
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Secondary Actions */}
            {secondaryActions && secondaryActions.length > 0 && (
              <>
                {secondaryActions.map((secondaryAction, index) => (
                  <React.Fragment key={index}>
                    {secondaryAction}
                  </React.Fragment>
                ))}
              </>
            )}
            
            {/* Primary Action */}
            {action}
          </div>
        )}
      </div>
    </div>
  );
};

PageHeader.displayName = 'PageHeader';

export default PageHeader;
