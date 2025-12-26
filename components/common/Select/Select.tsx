/**
 * Select Component
 * Feature: 008-common-components
 * 
 * Dropdown selection component with validation states and consistent styling.
 */

import * as React from 'react';
import { cn } from '@/lib/cn';
import type { SelectProps } from './Select.types';
import type { InputSize, InputValidationState } from '../Input/Input.types';

/**
 * Size-specific styles mapping (matches Input component)
 */
const sizeStyles: Record<InputSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-4 py-3 text-lg',
};

/**
 * Validation state-specific border colors (matches Input component)
 */
const validationStyles: Record<InputValidationState, string> = {
  default: 'border-border focus:border-border-focus focus:ring-border-focus',
  success: 'border-success focus:border-success focus:ring-success',
  error: 'border-error focus:border-error focus:ring-error',
};

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
    const effectiveValidationState: InputValidationState = 
      error ? 'error' : 
      success ? 'success' : 
      validationState || 'default';
    
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
          <label 
            htmlFor={selectId}
            className="block text-sm font-semibold text-text-primary mb-1.5"
          >
            {label}
            {required && <span className="text-error ml-1">*</span>}
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
          className={cn(
            // Base styles
            'block w-full rounded-md border bg-surface',
            'text-text-primary',
            'transition-colors duration-200',
            'focus:outline-none focus:ring-2 focus:ring-offset-0',
            'disabled:cursor-not-allowed disabled:opacity-60 disabled:bg-surface-elevated',
            // Size styles
            sizeStyles[size],
            // Validation styles
            validationStyles[effectiveValidationState],
            // Appearance for dropdown arrow
            'appearance-none bg-no-repeat',
            'bg-[right_0.75rem_center] bg-[length:1.25rem] pr-10',
            // Custom arrow using data URL (chevron down) - uses currentColor for dark theme compatibility
            'dark:bg-[url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%23d1d5db\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")]',
            'bg-[url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")]',
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
          <p
            id={feedbackId}
            className={cn(
              'mt-1.5 text-sm',
              error && 'text-error',
              success && 'text-success',
              !error && !success && 'text-text-secondary'
            )}
          >
            {feedbackMessage}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
