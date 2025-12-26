/**
 * Select Component Types
 * Feature: 008-common-components
 * 
 * Type definitions for dropdown selection components.
 */

import * as React from 'react';
import type { BaseInputProps } from '../Input/Input.types';

/**
 * Select option value type
 */
export interface SelectOption<T = string> {
  /**
   * Display label
   */
  label: string;
  
  /**
   * Option value
   */
  value: T;
  
  /**
   * Disable this option
   * @default false
   */
  disabled?: boolean;
}

/**
 * Select component props (dropdown selection)
 * 
 * @example
 * ```tsx
 * const storageOptions = [
 *   { label: 'Pantry', value: 'pantry' },
 *   { label: 'Fridge', value: 'fridge' },
 *   { label: 'Freezer', value: 'freezer' },
 * ];
 * 
 * <Select 
 *   label="Storage Location"
 *   options={storageOptions}
 *   value={location}
 *   onChange={setLocation}
 *   placeholder="Select location..."
 *   required
 * />
 * ```
 */
export interface SelectProps<T = string> 
  extends BaseInputProps, 
    Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size' | 'onChange' | 'value'> {
  /**
   * Select options
   */
  options: SelectOption<T>[];
  
  /**
   * Placeholder option (shown when no value selected)
   */
  placeholder?: string;
  
  /**
   * Selected value
   */
  value?: T;
  
  /**
   * Change handler (receives typed value, not event)
   */
  onChange?: (value: T) => void;
}
