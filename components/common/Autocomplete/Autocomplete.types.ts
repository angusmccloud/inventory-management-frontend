/**
 * Autocomplete Component Type Definitions
 * 
 * Flexible autocomplete input with search functionality.
 * Supports both selecting from suggestions and free-text input.
 */

import * as React from 'react';

/**
 * Autocomplete option structure
 */
export interface AutocompleteOption {
  /**
   * Unique identifier for the option
   */
  value: string;
  
  /**
   * Display label for the option
   */
  label: string;
  
  /**
   * Optional metadata for additional information
   * (e.g., location, quantity, description)
   */
  metadata?: Record<string, any>;
}

/**
 * Autocomplete component props
 * 
 * @example
 * <Autocomplete
 *   id="item-name"
 *   label="Item Name"
 *   value={name}
 *   onChange={(value) => setName(value)}
 *   onSearch={searchInventoryItems}
 *   placeholder="Start typing to search..."
 *   required
 * />
 */
export interface AutocompleteProps {
  /**
   * Input element ID (for label association)
   */
  id: string;
  
  /**
   * Input label text
   */
  label?: string;
  
  /**
   * Current input value
   */
  value: string;
  
  /**
   * Called when value changes (either from typing or selection)
   * @param value - The new input value
   * @param option - The selected option (if user selected from dropdown)
   */
  onChange: (value: string, option?: AutocompleteOption) => void;
  
  /**
   * Async search function to fetch matching options
   * @param query - The search query string
   * @returns Promise resolving to array of matching options
   */
  onSearch: (query: string) => Promise<AutocompleteOption[]>;
  
  /**
   * Placeholder text shown when input is empty
   */
  placeholder?: string;
  
  /**
   * Whether the input is required
   * @default false
   */
  required?: boolean;
  
  /**
   * Whether the input is disabled
   * @default false
   */
  disabled?: boolean;
  
  /**
   * Maximum character length
   */
  maxLength?: number;
  
  /**
   * Debounce delay in milliseconds before triggering search
   * @default 300
   */
  debounceMs?: number;
  
  /**
   * Minimum number of characters before triggering search
   * @default 2
   */
  minSearchLength?: number;
  
  /**
   * Message shown when no results are found
   * @default 'No results found'
   */
  emptyMessage?: string;
  
  /**
   * Optional keyboard event handler
   * (e.g., for Enter key quick-add functionality)
   */
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}
