/**
 * Adjustment Client Component
 * 
 * @description Client-side component for interactive +/- inventory adjustments
 * Provides real-time quantity updates with debounced API calls
 * 
 * Features:
 * - Debounced API calls (500ms delay, batches rapid clicks)
 * - Optimistic UI updates for immediate feedback
 * - Error recovery with automatic rollback
 * - Touch-friendly buttons (44x44px minimum)
 * - Auto-flush on navigation/page unload
 * - Offline detection with disabled state
 * 
 * @see specs/006-api-integration/spec.md - User Story 2
 * @see specs/010-streamline-quantity-controls/spec.md - User Story 1
 * @see specs/010-streamline-quantity-controls/contracts/nfc-adjustment-api.yaml
 */

'use client';

import { useEffect, useCallback } from 'react';
import { useQuantityDebounce } from '@/hooks/useQuantityDebounce';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import QuantityControls from '@/components/common/QuantityControls';
import { Button } from '@/components/common/Button/Button';

interface AdjustmentClientProps {
  urlId: string;
  initialQuantity: number;
  initialItemName: string;
  apiBaseUrl: string;
}

/**
 * Client component for additional adjustments after initial NFC tap
 * 
 * WCAG 2.1 AA compliant with 44x44px touch targets
 * Uses debounced API calls to reduce server load (500ms delay)
 */
export default function AdjustmentClient({
  urlId,
  initialQuantity,
  apiBaseUrl,
}: Omit<AdjustmentClientProps, 'initialItemName'>) {
  const isOnline = useOnlineStatus();

  /**
   * Flush callback for debounced adjustments
   * Makes API call with accumulated delta
   */
  const handleFlush = useCallback(
    async (itemId: string, accumulatedDelta: number) => {
      const response = await fetch(`${apiBaseUrl}/api/adjust/${itemId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ delta: accumulatedDelta }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || 'Adjustment failed');
      }

      const data = await response.json();
      return data.newQuantity;
    },
    [apiBaseUrl]
  );

  // Initialize debounce hook
  const {
    localQuantity,
    hasPendingChanges,
    isFlushing,
    error,
    adjust,
    flush,
    retry,
    clearError,
  } = useQuantityDebounce({
    itemId: urlId,
    initialQuantity,
    onFlush: handleFlush,
    delay: 500, // 500ms debounce delay
  });

  /**
   * Flush pending changes on navigation/unmount
   */
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasPendingChanges) {
        flush();
        // Show browser warning for pending changes
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // Flush on unmount
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (hasPendingChanges) {
        flush();
      }
    };
  }, [hasPendingChanges, flush]);

  /**
   * Flush on route change (Next.js navigation)
   * Note: Next.js 13+ App Router doesn't expose router events directly
   * Relying on beforeunload and unmount for now
   */
  useEffect(() => {
    return () => {
      // Cleanup on unmount
    };
  }, []);

  const handleIncrement = () => {
    adjust(1);
  };

  const handleDecrement = () => {
    if (localQuantity > 0) {
      adjust(-1);
    }
  };

  return (
    <div className="space-y-6">
      {/* Current Quantity Display */}
      <div className="bg-surface-elevated rounded-lg p-6">
        <p className="text-sm text-text-default uppercase tracking-wide mb-2">
          Current Quantity
        </p>
        <div className="flex items-center gap-3">
          <p className="text-4xl font-bold text-text-secondary dark:text-white">
            {localQuantity}
          </p>
          {hasPendingChanges && (
            <span className="text-warning text-2xl" title="Changes pending">
              *
            </span>
          )}
        </div>
        {isFlushing && (
          <p className="text-sm text-primary mt-2">
            Saving...
          </p>
        )}
        {!isOnline && (
          <p className="text-sm text-warning mt-2">
            You are offline. Changes will be disabled.
          </p>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div
          className="bg-error/10 border border-error rounded-lg p-4"
          role="alert"
          aria-live="assertive"
        >
          <div className="flex items-start">
            <svg
              className="w-5 h-5 text-error mr-3 flex-shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-error">
                Adjustment Error
              </h3>
              <p className="text-sm text-error mt-1">
                {error.message}
              </p>
              <div className="flex gap-2 mt-2">
                <Button
                  variant="danger"
                  size="sm"
                  onClick={retry}
                >
                  Retry
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={clearError}
                >
                  Dismiss
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Adjustment Buttons */}
      <div className="space-y-4">
        <p className="text-sm text-text-default text-center">
          Make additional adjustments:
        </p>

        <div className="flex justify-center">
          <QuantityControls
            quantity={localQuantity}
            onIncrement={handleIncrement}
            onDecrement={handleDecrement}
            disabled={!isOnline}
            isLoading={isFlushing}
            hasPendingChanges={hasPendingChanges}
            size="lg"
            minQuantity={0}
            unit=""
            incrementLabel="Increase quantity by 1"
            decrementLabel="Decrease quantity by 1"
          />
        </div>

        {/* Button Hint */}
        {!isOnline && (
          <p className="text-xs text-warning text-center">
            You are offline. Adjustments are disabled until connection is restored.
          </p>
        )}
        {localQuantity === 0 && isOnline && (
          <p className="text-xs text-text-default text-center">
            Quantity is at minimum (0). Use the + button to add items.
          </p>
        )}
      </div>

      {/* Additional Info */}
      <div className="pt-4 border-t border-border">
        <p className="text-xs text-text-default text-center">
          Changes are saved automatically after a brief delay. You can close this page anytime.
        </p>
      </div>
    </div>
  );
}
