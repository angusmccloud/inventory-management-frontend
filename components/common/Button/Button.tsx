/**
 * Button Component
 * Feature: 008-common-components
 * 
 * Primary action button with variants for different contexts and built-in loading states.
 */

import * as React from 'react';
import { cn } from '@/lib/cn';
import type { ButtonProps, ButtonVariant, ButtonSize } from './Button.types';

/**
 * Variant-specific styles mapping
 */
const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-primary-contrast hover:bg-primary-hover focus:ring-primary disabled:bg-primary/50',
  secondary: 'bg-secondary text-secondary-contrast hover:bg-secondary-hover focus:ring-secondary disabled:bg-secondary/50',
  danger: 'bg-error text-error-contrast hover:bg-error/90 focus:ring-error disabled:bg-error/50',
  warning: 'bg-warning text-warning-contrast hover:bg-warning/90 focus:ring-warning disabled:bg-warning/50',
};

/**
 * Size-specific styles mapping
 */
const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
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
 * Button component with variants, sizes, and loading states
 * 
 * @example
 * ```tsx
 * // Primary action
 * <Button variant="primary" onClick={handleSave}>
 *   Save Changes
 * </Button>
 * 
 * // With loading state
 * <Button variant="primary" loading={isSaving} onClick={handleSave}>
 *   Save Changes
 * </Button>
 * 
 * // With icons
 * <Button variant="danger" leftIcon={<TrashIcon className="h-5 w-5" />}>
 *   Delete Item
 * </Button>
 * ```
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      fullWidth = false,
      disabled = false,
      className,
      leftIcon,
      rightIcon,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        aria-busy={loading}
        aria-disabled={isDisabled}
        className={cn(
          // Base styles
          'inline-flex items-center justify-center gap-2',
          'font-semibold rounded-md',
          'transition-colors duration-200',
          'focus:outline-none focus:ring-2 focus:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-60',
          // Variant styles
          variantStyles[variant],
          // Size styles
          sizeStyles[size],
          // Full width
          fullWidth && 'w-full',
          // Custom classes
          className
        )}
        {...props}
      >
        {loading && <LoadingSpinner size={size} />}
        {!loading && leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
        <span>{children}</span>
        {!loading && rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
