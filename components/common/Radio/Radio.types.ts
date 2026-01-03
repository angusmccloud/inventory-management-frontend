/**
 * Radio Component Type Definitions
 * 
 * Type-safe radio button with consistent styling and accessibility.
 */

/**
 * Radio option definition
 */
export interface RadioOption {
  /**
   * Unique value for this option
   */
  value: string;
  
  /**
   * Display label for the option (can be string or React element)
   */
  label: string | React.ReactNode;
  
  /**
   * Optional description text
   */
  description?: string;
  
  /**
   * Whether this option is disabled
   */
  disabled?: boolean;
}

/**
 * Radio component props
 */
export interface RadioProps {
  /**
   * Group name (required for radio button groups)
   */
  name: string;
  
  /**
   * Array of radio options
   */
  options: RadioOption[];
  
  /**
   * Currently selected value
   */
  value: string;
  
  /**
   * Change handler - receives selected value
   */
  onChange: (value: string) => void;
  
  /**
   * Optional label for the radio group
   */
  label?: string;
  
  /**
   * Help text shown below the radio group
   */
  helpText?: string;
  
  /**
   * Whether the entire radio group is disabled
   */
  disabled?: boolean;
  
  /**
   * Error message (shows red styling)
   */
  error?: string;
  
  /**
   * Whether this field is required
   */
  required?: boolean;
  
  /**
   * Additional CSS classes
   */
  className?: string;
}
