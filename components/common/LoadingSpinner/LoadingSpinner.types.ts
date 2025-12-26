/**
 * LoadingSpinner Component Types
 * Feature: 008-common-components
 * 
 * Type definitions for loading indicator components.
 */

/**
 * Spinner size variants
 */
export type SpinnerSize = 
  | 'sm'         // 16px (inline with text)
  | 'md'         // 24px (default)
  | 'lg'         // 32px (large buttons, cards)
  | 'xl';        // 48px (page-level loading)

/**
 * LoadingSpinner component props
 * Animated loading indicator.
 * 
 * @example
 * ```tsx
 * // Basic spinner
 * <LoadingSpinner size="md" />
 * 
 * // Page-level loading with label
 * <LoadingSpinner size="xl" center label="Loading inventory..." />
 * 
 * // Conditional loading
 * {isLoading && <LoadingSpinner size="sm" />}
 * ```
 */
export interface LoadingSpinnerProps {
  /**
   * Spinner size
   * @default 'md'
   */
  size?: SpinnerSize;
  
  /**
   * Accessible label for screen readers
   * @default 'Loading...'
   */
  label?: string;
  
  /**
   * Center spinner in container (applies flex centering to wrapper)
   * @default false
   */
  center?: boolean;
  
  /**
   * Additional CSS classes
   */
  className?: string;
}
