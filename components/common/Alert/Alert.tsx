/**
 * Alert Component
 * Feature: 008-common-components
 * 
 * Contextual message display for notifications and feedback with severity variants.
 */

'use client';

import * as React from 'react';
import { 
  InformationCircleIcon, 
  CheckCircleIcon, 
  ExclamationTriangleIcon,
  XCircleIcon,
  XMarkIcon 
} from '@heroicons/react/24/outline';
import { AlertProps, AlertSeverity } from './Alert.types';
import { cn } from '@/lib/cn';
import { IconButton } from '@/components/common/IconButton/IconButton';

/**
 * Get severity-specific styles and icon
 */
const getSeverityConfig = (severity: AlertSeverity) => {
  const configs = {
    info: {
      container: 'bg-secondary/10 border-secondary/30',
      icon: 'text-secondary',
      title: 'text-text-default',
      text: 'text-text-secondary',
      iconComponent: InformationCircleIcon,
      role: 'status' as const,
    },
    success: {
      container: 'bg-primary/10 border-primary/30',
      icon: 'text-primary',
      title: 'text-text-default',
      text: 'text-text-secondary',
      iconComponent: CheckCircleIcon,
      role: 'status' as const,
    },
    warning: {
      container: 'bg-tertiary/10 border-tertiary/30',
      icon: 'text-tertiary',
      title: 'text-text-default',
      text: 'text-text-secondary',
      iconComponent: ExclamationTriangleIcon,
      role: 'alert' as const,
    },
    error: {
      container: 'bg-error/10 border-error/30',
      icon: 'text-error',
      title: 'text-text-default',
      text: 'text-text-secondary',
      iconComponent: XCircleIcon,
      role: 'alert' as const,
    },
  };
  
  return configs[severity];
};

/**
 * Alert component
 */
export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ 
    severity, 
    title, 
    children, 
    dismissible = false, 
    onDismiss,
    className,
    ...props 
  }, ref) => {
    const config = getSeverityConfig(severity);
    const IconComponent = config.iconComponent;
    
    return (
      <div
        ref={ref}
        role={config.role}
        aria-live={severity === 'error' || severity === 'warning' ? 'assertive' : 'polite'}
        className={cn(
          'rounded-lg border p-4',
          config.container,
          className
        )}
        {...props}
      >
        <div className="flex items-start gap-3">
          {/* Icon */}
          <IconComponent className={cn('h-5 w-5 flex-shrink-0 mt-0.5', config.icon)} />
          
          {/* Content */}
          <div className="flex-1 space-y-1">
            {title && (
              <p className={cn('text-sm font-semibold', config.title)}>
                {title}
              </p>
            )}
            <div className={cn('text-sm', config.text)}>
              {children}
            </div>
          </div>
          
          {/* Dismiss button */}
          {dismissible && onDismiss && (
            <IconButton
              icon={<XMarkIcon className="h-4 w-4" />}
              variant="secondary"
              size="sm"
              onClick={onDismiss}
              aria-label="Dismiss alert"
            />
          )}
        </div>
      </div>
    );
  }
);

Alert.displayName = 'Alert';

export default Alert;
