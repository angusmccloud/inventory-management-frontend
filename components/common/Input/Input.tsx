/**
 * Input Component
 * Feature: 008-common-components
 * 
 * Form input component with validation states, labels, and icon support.
 */

import * as React from 'react';
import { cn } from '@/lib/cn';
import type { InputProps, InputSize, InputValidationState } from './Input.types';

/**
 * Size-specific styles mapping
 */
const sizeStyles: Record<InputSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-4 py-3 text-lg',
};

/**
 * Validation state-specific border colors
 */
const validationStyles: Record<InputValidationState, string> = {
  default: 'border-border focus:border-border-focus focus:ring-border-focus',
  success: 'border-success focus:border-success focus:ring-success',
  error: 'border-error focus:border-error focus:ring-error',
};

/**
 * Input component for form fields
 * 
 * @example
 * ```tsx
 * // Basic text input
 * <Input 
 *   label="Item Name"
 *   value={name}
 *   onChange={(e) => setName(e.target.value)}
 *   placeholder="Enter item name"
 *   required
 * />
 * 
 * // With validation error
 * <Input 
 *   label="Quantity"
 *   type="number"
 *   value={quantity}
 *   onChange={(e) => setQuantity(e.target.value)}
 *   error={quantityError}
 *   helpText="Minimum quantity is 1"
 * />
 * ```
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
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
      type = 'text',
      leftIcon,
      rightIcon,
      id,
      ...props
    },
    ref
  ) => {
    // Generate unique ID if not provided
    const inputId = id || React.useId();
    
    // Determine validation state from props
    const effectiveValidationState: InputValidationState = 
      error ? 'error' : 
      success ? 'success' : 
      validationState || 'default';
    
    // Help text or error/success message
    const feedbackMessage = error || success || helpText;
    const feedbackId = feedbackMessage ? `${inputId}-feedback` : undefined;

    return (
      <div className={cn('w-full', wrapperClassName)}>
        {/* Label */}
        {label && (
          <label 
            htmlFor={inputId}
            className="block text-sm font-semibold text-text-primary mb-1.5"
          >
            {label}
            {required && <span className="text-error ml-1">*</span>}
          </label>
        )}
        
        {/* Input wrapper (for icons) */}
        <div className="relative">
          {/* Left icon */}
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none">
              {leftIcon}
            </div>
          )}
          
          {/* Input element */}
          <input
            ref={ref}
            id={inputId}
            type={type}
            required={required}
            aria-invalid={effectiveValidationState === 'error'}
            aria-describedby={feedbackId}
            className={cn(
              // Base styles
              'block w-full rounded-md border bg-surface',
              'text-text-primary placeholder:text-text-disabled',
              'transition-colors duration-200',
              'focus:outline-none focus:ring-2 focus:ring-offset-0',
              'disabled:cursor-not-allowed disabled:opacity-60 disabled:bg-surface-elevated',
              // Size styles
              sizeStyles[size],
              // Validation styles
              validationStyles[effectiveValidationState],
              // Icon padding adjustments
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              // Custom classes
              className
            )}
            {...props}
          />
          
          {/* Right icon */}
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none">
              {rightIcon}
            </div>
          )}
        </div>
        
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

Input.displayName = 'Input';
