/**
 * ToggleButton Component Type Definitions
 * Feature: 008-common-components
 *
 * Toggle button for on/off states with consistent theming.
 */

/**
 * Toggle button visual style variants
 */
export type ToggleButtonVariant =
  | 'primary' // Main brand color when active
  | 'secondary' // Secondary color when active
  | 'tertiary' // Tertiary color when active
  | 'success' // Success/green color when active
  | 'warning' // Warning/amber color when active
  | 'error'; // Error/danger color when active

/**
 * Toggle button size variants
 * Feature: 011-mobile-responsive-ui - Touch-friendly sizing
 */
export type ToggleButtonSize =
  | 'sm' // Small: h-5 w-9
  | 'md' // Medium: h-6 w-11 (default)
  | 'lg'; // Large: h-7 w-14

/**
 * ToggleButton component props
 *
 * @example
 * <ToggleButton
 *   checked={isEnabled}
 *   onChange={setIsEnabled}
 *   label="Enable notifications"
 * />
 *
 * @example
 * <ToggleButton
 *   checked={isDarkMode}
 *   onChange={setIsDarkMode}
 *   label="Dark mode"
 *   variant="secondary"
 *   size="lg"
 * />
 */
export interface ToggleButtonProps {
  /**
   * Whether the toggle is in the "on" state
   */
  checked: boolean;

  /**
   * Change handler - receives new checked state
   */
  onChange: (checked: boolean) => void;

  /**
   * Label text for accessibility
   * REQUIRED for screen readers
   */
  label: string;

  /**
   * Optional visible label text (if different from aria-label)
   * If not provided, uses `label` prop
   */
  visibleLabel?: string;

  /**
   * Optional description text shown below label
   */
  description?: string;

  /**
   * Toggle button visual variant
   * @default 'primary'
   */
  variant?: ToggleButtonVariant;

  /**
   * Toggle button size
   * @default 'md'
   */
  size?: ToggleButtonSize;

  /**
   * Whether the toggle is disabled
   */
  disabled?: boolean;

  /**
   * Error message (shows red styling)
   */
  error?: string;

  /**
   * Help text shown below the toggle
   */
  helpText?: string;

  /**
   * HTML name attribute for forms
   */
  name?: string;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Test ID for testing
   */
  testId?: string;
}
