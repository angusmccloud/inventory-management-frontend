/**
 * QuantityControls Component
 * 
 * @description Reusable +/- button controls for quantity adjustments
 * Features inline controls with visual feedback states and accessibility support
 * 
 * Features:
 * - Size variants: sm (32px), md (44px), lg (56px)
 * - Visual states: pending, loading, disabled
 * - Accessibility: WCAG 2.1 AA compliant (44x44px touch targets in md/lg)
 * - Keyboard navigation: Tab + Enter/Space
 * - Screen reader support with aria-labels
 * 
 * @see specs/010-streamline-quantity-controls/contracts/quantity-controls-component.md
 * 
 * @example
 * ```tsx
 * <QuantityControls
 *   quantity={localQuantity}
 *   onIncrement={() => adjust(1)}
 *   onDecrement={() => adjust(-1)}
 *   size="md"
 *   unit="units"
 *   hasPendingChanges={hasPendingChanges}
 *   isLoading={isFlushing}
 * />
 * ```
 */

'use client';

import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/cn';
import { LoadingSpinner } from './LoadingSpinner/LoadingSpinner';

export interface QuantityControlsProps {
  /**
   * Current quantity to display
   */
  quantity: number;

  /**
   * Callback when + button clicked
   */
  onIncrement: () => void;

  /**
   * Callback when - button clicked
   */
  onDecrement: () => void;

  /**
   * Whether controls are disabled (e.g., offline, loading)
   * @default false
   */
  disabled?: boolean;

  /**
   * Whether to show a loading indicator
   * @default false
   */
  isLoading?: boolean;

  /**
   * Whether to show a pending changes indicator
   * @default false
   */
  hasPendingChanges?: boolean;

  /**
   * Size variant for buttons
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * Optional unit label (e.g., 'units', 'kg', 'bottles')
   */
  unit?: string;

  /**
   * Minimum quantity allowed (disables - button at this value)
   * @default 0
   */
  minQuantity?: number;

  /**
   * Maximum quantity allowed (disables + button at this value)
   */
  maxQuantity?: number;

  /**
   * Accessibility label for + button
   * @default 'Increase quantity'
   */
  incrementLabel?: string;

  /**
   * Accessibility label for - button
   * @default 'Decrease quantity'
   */
  decrementLabel?: string;

  /**
   * Custom className for container
   */
  className?: string;
}

export default function QuantityControls({
  quantity,
  onIncrement,
  onDecrement,
  disabled = false,
  isLoading = false,
  hasPendingChanges = false,
  size = 'md',
  unit,
  minQuantity = 0,
  maxQuantity,
  incrementLabel = 'Increase quantity',
  decrementLabel = 'Decrease quantity',
  className,
}: QuantityControlsProps) {
  const isAtMin = quantity <= minQuantity;
  const isAtMax = maxQuantity !== undefined && quantity >= maxQuantity;

  const buttonSize = {
    sm: 'h-8 w-8 text-sm',
    md: 'h-11 w-11 text-base',
    lg: 'h-14 w-14 text-lg',
  }[size];

  const quantityTextSize = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  }[size];

  return (
    <div
      role="group"
      aria-label="Quantity controls"
      className={cn('inline-flex items-center gap-2', className)}
    >
      {/* Decrement Button */}
      <button
        onClick={onDecrement}
        disabled={disabled || isAtMin}
        aria-label={`${decrementLabel}. Current: ${quantity}${unit ? ' ' + unit : ''}`}
        aria-disabled={disabled || isAtMin}
        className={cn(
          'inline-flex items-center justify-center rounded-md font-medium',
          'transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          buttonSize,
          !disabled && !isAtMin
            ? 'bg-error hover:bg-error/90 text-white'
            : 'bg-surface-elevated text-text-secondary'
        )}
      >
        <MinusIcon className="h-5 w-5" />
      </button>

      {/* Quantity Display */}
      <span
        role="status"
        aria-live="polite"
        className={cn(
          'min-w-[4rem] text-center font-semibold text-text-default flex items-center justify-center gap-1',
          quantityTextSize
        )}
      >
        {quantity} {unit}
        {hasPendingChanges && (
          <>
            <span aria-label="Changes pending" className="text-warning ml-0.5">
              *
            </span>
            <span className="sr-only">Changes pending save</span>
          </>
        )}
        {isLoading && <LoadingSpinner size="sm" label="Saving..." />}
      </span>

      {/* Increment Button */}
      <button
        onClick={onIncrement}
        disabled={disabled || isAtMax}
        aria-label={`${incrementLabel}. Current: ${quantity}${unit ? ' ' + unit : ''}`}
        aria-disabled={disabled || isAtMax}
        className={cn(
          'inline-flex items-center justify-center rounded-md font-medium',
          'transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          buttonSize,
          !disabled && !isAtMax
            ? 'bg-secondary hover:bg-secondary/90 text-white'
            : 'bg-surface-elevated text-text-secondary'
        )}
      >
        <PlusIcon className="h-5 w-5" />
      </button>
    </div>
  );
}
