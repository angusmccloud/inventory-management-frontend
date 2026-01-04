/**
 * ToggleButton Component
 * Feature: 008-common-components
 *
 * Accessible toggle button with consistent theming.
 * Supports all theme variants and follows WCAG 2.1 AA standards.
 */

'use client';

import * as React from 'react';
import { cn } from '@/lib/cn';
import { Text } from '@/components/common/Text/Text';
import type {
  ToggleButtonProps,
  ToggleButtonVariant,
  ToggleButtonSize,
} from './ToggleButton.types';

/**
 * Variant-specific styles for the toggle background when active
 */
const variantStyles: Record<ToggleButtonVariant, string> = {
  primary: 'bg-primary',
  secondary: 'bg-secondary',
  tertiary: 'bg-tertiary',
  success: 'bg-success',
  warning: 'bg-warning',
  error: 'bg-error',
};

/**
 * Size-specific dimensions
 * Feature: 011-mobile-responsive-ui - Touch-friendly sizing
 */
const sizeStyles: Record<ToggleButtonSize, { container: string; thumb: string }> = {
  sm: {
    container: 'h-5 w-9',
    thumb: 'h-4 w-4',
  },
  md: {
    container: 'h-6 w-11',
    thumb: 'h-5 w-5',
  },
  lg: {
    container: 'h-7 w-14',
    thumb: 'h-6 w-6',
  },
};

/**
 * ToggleButton Component
 *
 * A styled toggle switch that follows design system theming.
 * Accessible with proper ARIA attributes and keyboard support.
 */
export const ToggleButton: React.FC<ToggleButtonProps> = ({
  checked,
  onChange,
  label,
  visibleLabel,
  description,
  variant = 'primary',
  size = 'md',
  disabled = false,
  error,
  helpText,
  name,
  className = '',
  testId,
}) => {
  const id = React.useId();
  const hasError = Boolean(error);
  const displayLabel = visibleLabel !== undefined ? visibleLabel : label;

  const handleChange = (): void => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>): void => {
    // Space or Enter toggles the button
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      handleChange();
    }
  };

  return (
    <div className={className}>
      <div className="flex items-center justify-between">
        {/* Label */}
        {displayLabel && (
          <label
            htmlFor={id}
            className={cn(
              'text-sm font-medium text-text-primary',
              disabled && 'cursor-not-allowed opacity-50'
            )}
          >
            {displayLabel}
          </label>
        )}

        {/* Toggle Button */}
        <button
          id={id}
          type="button"
          role="switch"
          aria-checked={checked}
          aria-label={label}
          aria-describedby={
            helpText || error || description
              ? `${id}-${error ? 'error' : description ? 'desc' : 'help'}`
              : undefined
          }
          onClick={handleChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          data-testid={testId}
          className={cn(
            // Base styles
            'relative inline-flex flex-shrink-0 rounded-full transition-colors duration-200 ease-in-out',
            'focus:outline-none focus:ring-2 focus:ring-offset-2',

            // Size
            sizeStyles[size].container,

            // Active/Inactive state
            checked
              ? cn(variantStyles[variant], 'focus:ring-' + variant.toLowerCase())
              : 'bg-border focus:ring-border',

            // Disabled state
            disabled && 'cursor-not-allowed opacity-50',
            !disabled && 'cursor-pointer'
          )}
          style={{
            // Ensure proper focus ring color using CSS variable
            ['--tw-ring-color' as string]: checked
              ? `rgb(var(--color-${variant}))`
              : 'rgb(var(--color-border))',
            // Prevent height changes
            minHeight: 'fit-content',
            maxHeight: 'fit-content',
          }}
        >
          {/* Input for form submission */}
          {name && (
            <input
              type="checkbox"
              name={name}
              checked={checked}
              onChange={() => {}}
              className="sr-only"
              tabIndex={-1}
              aria-hidden="true"
            />
          )}

          {/* Thumb/Knob */}
          <span
            aria-hidden="true"
            className={cn(
              'pointer-events-none inline-block rounded-full bg-white shadow-lg',
              'transform transition duration-200 ease-in-out',

              // Size
              sizeStyles[size].thumb,

              // Position based on checked state
              checked
                ? size === 'sm'
                  ? 'translate-x-4'
                  : size === 'md'
                    ? 'translate-x-5'
                    : 'translate-x-7'
                : 'translate-x-0.5'
            )}
            style={{
              marginTop: '0.125rem',
              marginBottom: '0.125rem',
            }}
          />
        </button>
      </div>

      {/* Description */}
      {description && (
        <Text id={`${id}-desc`} variant="bodySmall" className="mt-1 text-text-secondary">
          {description}
        </Text>
      )}

      {/* Help Text */}
      {helpText && !hasError && (
        <Text id={`${id}-help`} variant="bodySmall" className="mt-1 text-text-secondary">
          {helpText}
        </Text>
      )}

      {/* Error Message */}
      {hasError && (
        <Text id={`${id}-error`} variant="bodySmall" className="mt-1 text-error" role="alert">
          {error}
        </Text>
      )}
    </div>
  );
};

ToggleButton.displayName = 'ToggleButton';
