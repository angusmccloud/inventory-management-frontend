/**
 * Checkbox Component Type Definitions
 *
 * Type-safe checkbox with consistent styling and accessibility.
 */

/**
 * Checkbox component props
 */
export interface CheckboxProps {
  /**
   * Checkbox label text
   */
  label: string;

  /**
   * Optional description text shown below label
   */
  description?: string;

  /**
   * Whether the checkbox is checked
   */
  checked: boolean;

  /**
   * Change handler - receives checked state
   */
  onChange: (checked: boolean) => void;

  /**
   * Whether the checkbox is disabled
   */
  disabled?: boolean;

  /**
   * Whether this field is required
   */
  required?: boolean;

  /**
   * Error message (shows red styling)
   */
  error?: string;

  /**
   * Help text shown below the checkbox
   */
  helpText?: string;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Name attribute for form submissions
   */
  name?: string;
}
