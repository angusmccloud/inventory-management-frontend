/**
 * Adjustment Client Component
 * 
 * @description Client-side component for interactive +/- inventory adjustments
 * Provides real-time quantity updates without page reload
 * 
 * Features:
 * - Optimistic UI updates for immediate feedback
 * - Error recovery with automatic rollback
 * - Touch-friendly buttons (44x44px minimum)
 * - Loading states to prevent double-submission
 * - Minimum quantity enforcement (cannot go below 0)
 * 
 * @see specs/006-api-integration/spec.md - User Story 2
 * @see specs/006-api-integration/contracts/nfc-adjustment-api.yaml
 */

'use client';

import { useState } from 'react';

interface AdjustmentClientProps {
  urlId: string;
  initialQuantity: number;
  initialItemName: string;
  apiBaseUrl: string;
}

interface AdjustmentState {
  quantity: number;
  isLoading: boolean;
  error: string | null;
  lastAction: 'increment' | 'decrement' | null;
}

/**
 * Client component for additional adjustments after initial NFC tap
 * 
 * WCAG 2.1 AA compliant with 44x44px touch targets
 */
export default function AdjustmentClient({
  urlId,
  initialQuantity,
  apiBaseUrl,
}: Omit<AdjustmentClientProps, 'initialItemName'>) {
  const [state, setState] = useState<AdjustmentState>({
    quantity: initialQuantity,
    isLoading: false,
    error: null,
    lastAction: null,
  });

  /**
   * Perform adjustment with optimistic UI update
   */
  const handleAdjustment = async (delta: -1 | 1) => {
    // Prevent adjustment if already loading
    if (state.isLoading) {
      return;
    }

    // Check minimum quantity constraint client-side
    if (delta === -1 && state.quantity === 0) {
      setState((prev) => ({
        ...prev,
        error: 'Cannot reduce quantity below 0',
        lastAction: 'decrement',
      }));
      
      // Clear error after 3 seconds
      setTimeout(() => {
        setState((prev) => ({
          ...prev,
          error: prev.error === 'Cannot reduce quantity below 0' ? null : prev.error,
        }));
      }, 3000);
      
      return;
    }

    // Store previous quantity for rollback
    const previousQuantity = state.quantity;
    const optimisticQuantity = state.quantity + delta;

    // Optimistic update
    setState((prev) => ({
      ...prev,
      quantity: optimisticQuantity,
      isLoading: true,
      error: null,
      lastAction: delta === 1 ? 'increment' : 'decrement',
    }));

    try {
      // Call adjustment API
      const response = await fetch(`${apiBaseUrl}/api/adjust/${urlId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ delta }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || 'Adjustment failed');
      }

      const data = await response.json();

      // Update with server response (may differ from optimistic update)
      setState((prev) => ({
        ...prev,
        quantity: data.newQuantity,
        isLoading: false,
        error: null,
      }));
    } catch (error) {
      // Rollback optimistic update on error
      setState((prev) => ({
        ...prev,
        quantity: previousQuantity,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Adjustment failed',
      }));

      // Clear error after 5 seconds
      setTimeout(() => {
        setState((prev) => ({ ...prev, error: null }));
      }, 5000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Current Quantity Display */}
      <div className="bg-surface-elevated rounded-lg p-6">
        <p className="text-sm text-text-default uppercase tracking-wide mb-2">
          Current Quantity
        </p>
        <p className="text-4xl font-bold text-text-secondary dark:text-white">
          {state.quantity}
        </p>
        {state.isLoading && (
          <p className="text-sm text-primary mt-2">
            Updating...
          </p>
        )}
      </div>

      {/* Error Message */}
      {state.error && (
        <div
          className="bg-error/10/20 border border-error rounded-lg p-4"
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
            <div>
              <h3 className="text-sm font-medium text-error">
                Adjustment Error
              </h3>
              <p className="text-sm text-error mt-1">
                {state.error}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Adjustment Buttons */}
      <div className="space-y-4">
        <p className="text-sm text-text-default text-center">
          Make additional adjustments:
        </p>

        <div className="grid grid-cols-2 gap-4">
          {/* Decrement Button (-1) */}
          <button
            onClick={() => handleAdjustment(-1)}
            disabled={state.isLoading || state.quantity === 0}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center gap-2 px-6 py-3 bg-error/10 hover:bg-error/10 disabled:bg-surface-elevated dark:disabled:bg-surface-elevated text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-4 focus:ring-red-300 dark:focus:ring-red-800 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Decrease quantity by 1"
            aria-disabled={state.isLoading || state.quantity === 0}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 12H4"
              />
            </svg>
            <span className="text-lg">Remove 1</span>
          </button>

          {/* Increment Button (+1) */}
          <button
            onClick={() => handleAdjustment(1)}
            disabled={state.isLoading}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center gap-2 px-6 py-3 bg-secondary/10 hover:bg-secondary/10 disabled:bg-surface-elevated dark:disabled:bg-surface-elevated text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-4 focus:ring-green-300 dark:focus:ring-green-800 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Increase quantity by 1"
            aria-disabled={state.isLoading}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span className="text-lg">Add 1</span>
          </button>
        </div>

        {/* Button Hint */}
        {state.quantity === 0 && (
          <p className="text-xs text-text-default text-center">
            Quantity is at minimum (0). Use the + button to add items.
          </p>
        )}
      </div>

      {/* Additional Info */}
      <div className="pt-4 border-t border-border">
        <p className="text-xs text-text-default text-center">
          Changes are saved automatically. You can close this page anytime.
        </p>
      </div>
    </div>
  );
}
