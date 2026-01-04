/**
 * Select Component
 * Feature: 008-common-components
 *
 * Dropdown selection component with validation states and consistent styling.
 */

import * as React from 'react';
import { cn } from '@/lib/cn';
import type { SelectProps } from './Select.types';
import type { InputValidationState } from '../Input/Input.types';
import { Text } from '@/components/common/Text/Text';

/**
 * Select component for dropdown selections
 *
 * @example
 * ```tsx
 * // Basic select
 * const options = [
 *   { label: 'Pantry', value: 'pantry' },
 *   { label: 'Fridge', value: 'fridge' },
 * ];
 *
 * <Select
 *   label="Storage Location"
 *   options={options}
 *   value={location}
 *   onChange={setLocation}
 *   required
 * />
 *
 * // With validation error
 * <Select
 *   label="Category"
 *   options={categoryOptions}
 *   value={category}
 *   onChange={setCategory}
 *   error="Please select a category"
 * />
 * ```
 */
export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      helpText,
      error,
      success,
      validationState,
      size = 'md',
      required = false,
      className,
      wrapperClassName,
      options,
      placeholder,
      value,
      onChange,
      id,
      children,
      ...props
    },
    ref
  ) => {
    // Generate unique ID if not provided
    const selectId = id || React.useId();

    // Determine validation state from props
    const effectiveValidationState: InputValidationState = error
      ? 'error'
      : success
        ? 'success'
        : validationState || 'default';

    // Help text or error/success message
    const feedbackMessage = error || success || helpText;
    const feedbackId = feedbackMessage ? `${selectId}-feedback` : undefined;

    // Handle change event and extract value
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      if (onChange) {
        onChange(e.target.value as any); // Type assertion for generic value
      }
    };

    return (
      <div className={cn('w-full', wrapperClassName)}>
        {/* Label */}
        {label && (
          <label htmlFor={selectId} className="mb-1 block text-sm font-medium text-text-default">
            {label}
            {required && <span className="ml-1 text-error">*</span>}
          </label>
        )}

        {/* Select element */}
        <select
          ref={ref}
          id={selectId}
          required={required}
          aria-invalid={effectiveValidationState === 'error'}
          aria-describedby={feedbackId}
          value={value as any} // Type assertion for generic value
          onChange={handleChange}
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")",
            backgroundPosition: 'right 0.75rem center',
            backgroundSize: '1.25rem',
            backgroundRepeat: 'no-repeat',
          }}
          className={cn(
            // Base styles - match textarea/input exactly
            'block w-full rounded-md border-0',
            'px-3 py-2 pr-10',
            'text-text-default',
            '!bg-surface',
            'ring-1 ring-inset ring-border',
            'placeholder:text-text-disabled',
            'focus:ring-2 focus:ring-inset focus:ring-border-focus',
            'disabled:cursor-not-allowed disabled:opacity-60',
            'transition-colors duration-200',
            'appearance-none',
            // Feature 011-mobile-responsive-ui: Touch target sizing
            'min-h-[44px] md:min-h-[36px]',
            // Error/success states
            error && 'ring-error focus:ring-error',
            success && 'ring-primary focus:ring-primary',
            // Custom classes
            className
          )}
          {...props}
        >
          {/* Render children if provided, otherwise render options */}
          {children ? (
            children
          ) : (
            <>
              {/* Placeholder option */}
              {placeholder && (
                <option value="" disabled>
                  {placeholder}
                </option>
              )}

              {/* Options from props */}
              {options?.map((option) => (
                <option
                  key={String(option.value)}
                  value={option.value as any}
                  disabled={option.disabled}
                >
                  {option.label}
                </option>
              ))}
            </>
          )}
        </select>

        {/* Feedback message (help text, error, or success) */}
        {feedbackMessage && (
          <Text
            as="p"
            variant="caption"
            color={error ? 'error' : success ? 'primary' : 'secondary'}
            id={feedbackId}
            className="mt-1"
          >
            {feedbackMessage}
          </Text>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
