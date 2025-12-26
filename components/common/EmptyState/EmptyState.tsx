/**
 * EmptyState Component
 * Feature: 008-common-components
 * 
 * Placeholder displayed when no data is available in a list or view.
 */

'use client';

import * as React from 'react';
import { EmptyStateProps } from './EmptyState.types';
import { Button } from '../Button/Button';
import { Text } from '../Text/Text';
import { cn } from '@/lib/cn';

/**
 * EmptyState component
 */
export const EmptyState: React.FC<EmptyStateProps> = ({ 
  icon, 
  title, 
  description, 
  action,
  secondaryAction,
  className 
}) => {
  return (
    <div 
      className={cn(
        'flex flex-col items-center justify-center text-center py-12 px-4',
        className
      )}
    >
      {/* Icon */}
      {icon && (
        <div className="mb-4 text-gray-400 dark:text-gray-500">
          {React.isValidElement(icon) 
            ? React.cloneElement(icon as React.ReactElement<{ className?: string }>, { 
                className: cn(
                  'h-12 w-12 mx-auto',
                  (icon as React.ReactElement<{ className?: string }>).props.className
                )
              })
            : icon
          }
        </div>
      )}
      
      {/* Title */}
      <Text 
        variant="h3" 
        className="mb-2 text-gray-900 dark:text-gray-100"
      >
        {title}
      </Text>
      
      {/* Description */}
      {description && (
        <Text 
          variant="body" 
          className="mb-6 text-gray-600 dark:text-gray-400 max-w-md"
        >
          {description}
        </Text>
      )}
      
      {/* Actions */}
      {(action || secondaryAction) && (
        <div className="flex flex-col gap-3 items-center">
          {/* Primary Action */}
          {action && (
            <Button
              variant={action.variant || 'primary'}
              onClick={action.onClick}
            >
              {action.label}
            </Button>
          )}
          
          {/* Secondary Action */}
          {secondaryAction && (
            <button
              type="button"
              onClick={secondaryAction.onClick}
              className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 focus:outline-none focus:underline"
            >
              {secondaryAction.label}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

EmptyState.displayName = 'EmptyState';

export default EmptyState;
