/**
 * PageLoading Component
 * 
 * Consistent full-page loading state with spinner and message.
 * Ensures proper background color (bg-background) across all pages.
 */

import * as React from 'react';
import { LoadingSpinner } from '../LoadingSpinner/LoadingSpinner';
import { Text } from '../Text/Text';
import { cn } from '@/lib/cn';

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

/**
 * PageLoading component for consistent loading states
 * 
 * Features:
 * - Consistent bg-background color
 * - Centered spinner with optional message
 * - Configurable height (full viewport or flexible)
 * 
 * @example
 * ```tsx
 * // Default usage
 * if (loading) return <PageLoading />;
 * 
 * // With custom message
 * if (loading) return <PageLoading message="Loading inventory..." />;
 * 
 * // Flexible height
 * if (loading) return <PageLoading message="Loading..." fullHeight={false} />;
 * ```
 */
export const PageLoading: React.FC<PageLoadingProps> = ({
  message = 'Loading...',
  fullHeight = true,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center bg-background',
        fullHeight ? 'min-h-screen' : 'py-12',
        className
      )}
    >
      <LoadingSpinner size="lg" />
      {message && (
        <Text variant="body" className="mt-4 text-text-secondary">
          {message}
        </Text>
      )}
    </div>
  );
};

PageLoading.displayName = 'PageLoading';
