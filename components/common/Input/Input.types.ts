/**
 * Input Component Type Definitions
 * Feature: 008-common-components
 *
 * Form input components with validation states and consistent styling.
 */

import * as React from 'react';

/**
 * Input component types (HTML5 input types)
 */
export type InputType = 'text' | 'number' | 'email' | 'password' | 'tel' | 'url';

/**
 * Input validation state (visual feedback only)
 */
export type InputValidationState =
  | 'default' // Normal state
  | 'success' // Valid input (green border)
  | 'error'; // Invalid input (red border)

/**
 * Input size variants
 */
export type InputSize =
  | 'sm' // Small: px-3 py-1.5 text-sm
  | 'md' // Medium: px-4 py-2 text-base (default)
  | 'lg'; // Large: px-4 py-3 text-lg

/**
 * Base input props (shared between Input, TextArea, and Select)
 */
export interface BaseInputProps {
  /**
   * Input label (associated via htmlFor or wrapper)
   */
  label?: string;

  /**
   * Help text shown below input (neutral)
   */
  helpText?: string;

  /**
   * Error message (sets validationState to 'error', shown in red)
   */
  error?: string;

  /**
   * Success message (sets validationState to 'success', shown in green)
   */
  success?: string;

  /**
   * Validation state (visual only, doesn't block submission)
   * Auto-set when error or success props provided
   */
  validationState?: InputValidationState;

  /**
   * Input size
   * @default 'md'
   */
  size?: InputSize;

  /**
   * Required field indicator (shows asterisk on label)
   * @default false
   */
  required?: boolean;

  /**
   * Additional CSS classes for input element
   */
  className?: string;

  /**
   * Additional CSS classes for wrapper div
   */
  wrapperClassName?: string;
}

/**
 * Input component props (single-line text input)
 *
 * @example
 * <Input
 *   label="Item Name"
 *   placeholder="Enter item name"
 *   value={name}
 *   onChange={(e) => setName(e.target.value)}
 *   required
 * />
 *
 * @example
 * <Input
 *   type="number"
 *   label="Quantity"
 *   value={quantity}
 *   onChange={(e) => setQuantity(Number(e.target.value))}
 *   error={quantityError}
 *   helpText="Minimum quantity is 1"
 * />
 */
export interface InputProps
  extends BaseInputProps, Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /**
   * Input type
   * @default 'text'
   */
  type?: InputType;

  /**
   * Icon to display inside input (left side)
   */
  leftIcon?: React.ReactNode;

  /**
   * Icon to display inside input (right side)
   */
  rightIcon?: React.ReactNode;
}
