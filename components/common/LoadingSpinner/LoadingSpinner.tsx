/**
 * LoadingSpinner Component
 * Feature: 008-common-components
 * 
 * Animated loading indicator with multiple size variants.
 */

import * as React from 'react';
import { cn } from '@/lib/cn';
import type { LoadingSpinnerProps, SpinnerSize } from './LoadingSpinner.types';

/**
 * Size-specific dimensions mapping
 */
const sizeStyles: Record<SpinnerSize, string> = {
  sm: 'w-4 h-4 border-2',
  md: 'w-6 h-6 border-2',
  lg: 'w-8 h-8 border-[3px]',
  xl: 'w-12 h-12 border-[3px]',
};

/**
 * LoadingSpinner component
 * 
 * Animated circular loading indicator with customizable sizes.
 * Uses CSS animations for smooth rotation.
 * 
 * @example
 * ```tsx
 * // Basic usage
 * <LoadingSpinner />
 * 
 * // Different sizes
 * <LoadingSpinner size="sm" />
 * <LoadingSpinner size="xl" />
 * 
 * // Centered with label
 * <LoadingSpinner size="lg" center label="Loading your items..." />
 * 
 * // Conditional rendering
 * {isLoading && <LoadingSpinner size="md" />}
 * ```
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  label = 'Loading...',
  center = false,
  className,
}) => {
  const spinner = (
    <div
      role="status"
      aria-label={label}
      className={cn(
        'inline-block',
        center && 'mx-auto',
        className
      )}
    >
      <div
        className={cn(
          'rounded-full border-solid animate-spin',
          'border-border-focus border-t-transparent',
          sizeStyles[size]
        )}
      />
      <span className="sr-only">{label}</span>
    </div>
  );

  if (center) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px] gap-3">
        {spinner}
        {label && <p className="text-sm text-text-secondary">{label}</p>}
      </div>
    );
  }

  return spinner;
};

LoadingSpinner.displayName = 'LoadingSpinner';
