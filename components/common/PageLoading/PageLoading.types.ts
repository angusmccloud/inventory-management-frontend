/**
 * PageLoading Component Type Definitions
 */

export interface PageLoadingProps {
  /**
   * Loading message to display below the spinner
   * @default "Loading..."
   */
  message?: string;

  /**
   * Whether to use full viewport height
   * @default true
   */
  fullHeight?: boolean;

  /**
   * Additional CSS classes
   */
  className?: string;
}
