/**
 * IconButton Component
 * Feature: 008-common-components
 * 
 * Button optimized for icon-only display with proper touch targets and accessibility.
 */

import * as React from 'react';
import { cn } from '@/lib/cn';
import type { IconButtonProps } from './IconButton.types';
import type { ButtonVariant, ButtonSize } from '../Button/Button.types';

/**
 * Variant-specific styles mapping (same as Button)
 */
const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-primary-contrast hover:bg-primary-hover focus:ring-primary disabled:bg-primary/50',
  secondary: 'bg-secondary text-secondary-contrast hover:bg-secondary-hover focus:ring-secondary disabled:bg-secondary/50',
  tertiary: 'bg-transparent text-text-primary hover:bg-surface-elevated focus:ring-primary disabled:opacity-50',
  danger: 'bg-error text-error-contrast hover:bg-error/90 focus:ring-error disabled:bg-error/50',
  warning: 'bg-warning text-warning-contrast hover:bg-warning/90 focus:ring-warning disabled:bg-warning/50',
};

/**
 * Size-specific styles mapping (square buttons with proper touch targets)
 * Feature: 011-mobile-responsive-ui - Verified WCAG 2.1 AA touch target sizes
 */
const sizeStyles: Record<ButtonSize, string> = {
  sm: 'p-1.5 min-h-[44px] min-w-[44px] md:min-h-[32px] md:min-w-[32px]',      // 44px mobile, 32px desktop
  md: 'p-2 min-h-[44px] min-w-[44px] md:min-h-[40px] md:min-w-[40px]',        // 44px mobile, 40px desktop
  lg: 'p-3 min-h-[48px] min-w-[48px]',                                         // 48px all breakpoints
};

/**
 * Loading spinner component
 */
const LoadingSpinner: React.FC<{ size: ButtonSize }> = ({ size }) => {
  const spinnerSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  return (
    <svg
      className={cn('animate-spin', spinnerSizes[size])}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
};

/**
 * IconButton component for icon-only actions
 * 
 * @example
 * ```tsx
 * // Edit button
 * <IconButton 
 *   icon={<PencilIcon className="h-5 w-5" />}
 *   aria-label="Edit item"
 *   variant="secondary"
 *   onClick={handleEdit}
 * />
 * 
 * // Delete button with loading
 * <IconButton 
 *   icon={<TrashIcon className="h-5 w-5" />}
 *   aria-label="Delete item"
 *   variant="danger"
 *   loading={isDeleting}
 *   onClick={handleDelete}
 * />
 * ```
 */
export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      icon,
      'aria-label': ariaLabel,
      label,
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled = false,
      className,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        aria-label={ariaLabel}
        aria-busy={loading}
        aria-disabled={isDisabled}
        title={label || ariaLabel}
        className={cn(
          // Base styles
          'inline-flex items-center justify-center',
          'rounded-md',
          'transition-colors duration-200',
          'focus:outline-none focus:ring-2 focus:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-60',
          // Variant styles
          variantStyles[variant],
          // Size styles (square with proper touch targets)
          sizeStyles[size],
          // Custom classes
          className
        )}
        {...props}
      >
        {loading ? <LoadingSpinner size={size} /> : icon}
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';
