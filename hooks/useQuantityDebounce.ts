/**
 * useQuantityDebounce Hook
 * 
 * @description Custom React hook for debounced quantity adjustments with optimistic UI updates
 * Batches rapid quantity changes into a single API call after a configurable delay
 * 
 * Features:
 * - 500ms default debounce delay (configurable)
 * - Optimistic UI updates for immediate feedback
 * - Automatic rollback on API errors
 * - Manual flush capability for navigation/unmount
 * - Error handling with retry support
 * 
 * @see specs/010-streamline-quantity-controls/contracts/debounce-hook-api.md
 * 
 * @example
 * ```tsx
 * const { localQuantity, adjust, flush, hasPendingChanges } = useQuantityDebounce({
 *   itemId: 'item-123',
 *   initialQuantity: 10,
 *   onFlush: async (itemId, delta) => {
 *     const result = await api.adjustQuantity(itemId, delta);
 *     return result.quantity;
 *   },
 * });
 * 
 * // In component
 * <button onClick={() => adjust(1)}>+</button>
 * <span>{localQuantity}</span>
 * 
 * // Flush on unmount
 * useEffect(() => () => flush(), [flush]);
 * ```
 */

'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

export interface UseQuantityDebounceParams {
  /**
   * Unique identifier for the item being adjusted
   */
  itemId: string;

  /**
   * Initial quantity value from server
   */
  initialQuantity: number;

  /**
   * Callback to flush accumulated changes to server
   * @param itemId - ID of item being updated
   * @param delta - Net change in quantity (can be positive or negative)
   * @returns Promise resolving to new server quantity
   */
  onFlush: (itemId: string, delta: number) => Promise<number>;

  /**
   * Debounce delay in milliseconds
   * @default 500
   */
  delay?: number;
}

export interface UseQuantityDebounceReturn {
  /**
   * Current local quantity (includes optimistic updates)
   */
  localQuantity: number;

  /**
   * Accumulated delta not yet flushed to server
   */
  pendingDelta: number;

  /**
   * Whether there are changes pending flush
   */
  hasPendingChanges: boolean;

  /**
   * Whether an API call is currently in flight
   */
  isFlushing: boolean;

  /**
   * Error from last flush attempt, if any
   */
  error: Error | null;

  /**
   * Adjust quantity by delta (positive or negative)
   * Updates local state immediately and schedules debounced flush
   */
  adjust: (delta: number) => void;

  /**
   * Immediately flush pending changes to server
   * Cancels any pending debounced flush
   * Safe to call multiple times (no-op if nothing pending)
   */
  flush: () => Promise<void>;

  /**
   * Retry last failed flush
   * Only available when error is not null
   */
  retry: () => Promise<void>;

  /**
   * Clear error state
   */
  clearError: () => void;
}

/**
 * Custom hook for debounced quantity adjustments
 */
export function useQuantityDebounce({
  itemId,
  initialQuantity,
  onFlush,
  delay = 500,
}: UseQuantityDebounceParams): UseQuantityDebounceReturn {
  const [localQuantity, setLocalQuantity] = useState<number>(initialQuantity);
  const [serverQuantity, setServerQuantity] = useState<number>(initialQuantity);
  const [pendingDelta, setPendingDelta] = useState<number>(0);
  const [isFlushing, setIsFlushing] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const timerRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const previousItemIdRef = useRef<string>(itemId);
  const serverQuantityRef = useRef<number>(initialQuantity);
  const pendingDeltaRef = useRef<number>(0);
  const isFlushingRef = useRef<boolean>(false);

  // Keep refs in sync with state
  useEffect(() => {
    serverQuantityRef.current = serverQuantity;
  }, [serverQuantity]);

  useEffect(() => {
    pendingDeltaRef.current = pendingDelta;
  }, [pendingDelta]);

  useEffect(() => {
    isFlushingRef.current = isFlushing;
  }, [isFlushing]);

  // Flush pending changes when itemId changes
  useEffect(() => {
    if (previousItemIdRef.current !== itemId && pendingDelta !== 0) {
      flush();
    }
    previousItemIdRef.current = itemId;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemId]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const flush = useCallback(async (): Promise<void> => {
    const currentPendingDelta = pendingDeltaRef.current;
    const currentIsFlushing = isFlushingRef.current;
    
    if (currentPendingDelta === 0 || currentIsFlushing) return;

    // Capture the delta we're about to flush
    const deltaToFlush = currentPendingDelta;
    const serverQtyBeforeFlush = serverQuantityRef.current;
    
    console.log('[useQuantityDebounce] Flushing:', {
      deltaToFlush,
      serverQtyBeforeFlush,
      itemId,
    });
    
    // Reset pending delta immediately so new adjustments are tracked separately
    setPendingDelta(0);
    pendingDeltaRef.current = 0;
    setIsFlushing(true);
    isFlushingRef.current = true;
    setError(null);

    try {
      const newQuantity = await onFlush(itemId, deltaToFlush);
      
      console.log('[useQuantityDebounce] Flush response:', {
        newQuantity,
        deltaToFlush,
      });
      
      // Update server quantity to the API response
      setServerQuantity(newQuantity);
      serverQuantityRef.current = newQuantity;
      
      // Update local quantity: if user made more changes during flush,
      // add those to the new server quantity
      setLocalQuantity((current) => {
        // Get any new changes that happened during the flush
        const additionalChanges = current - (serverQtyBeforeFlush + deltaToFlush);
        console.log('[useQuantityDebounce] Updating local quantity:', {
          current,
          serverQtyBeforeFlush,
          deltaToFlush,
          additionalChanges,
          newLocalQuantity: newQuantity + additionalChanges,
        });
        return newQuantity + additionalChanges;
      });
    } catch (err) {
      // Rollback: restore the delta we tried to flush
      setPendingDelta(deltaToFlush);
      pendingDeltaRef.current = deltaToFlush;
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setIsFlushing(false);
      isFlushingRef.current = false;
    }
  }, [itemId, onFlush]);

  const adjust = useCallback(
    (delta: number): void => {
      // Optimistic update
      setLocalQuantity((prev) => prev + delta);
      setPendingDelta((prev) => prev + delta);
      setError(null);

      // Clear existing timer
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      // Set new timer
      timerRef.current = setTimeout(() => {
        flush();
      }, delay);
    },
    [delay, flush]
  );

  const retry = useCallback(async (): Promise<void> => {
    if (error && pendingDeltaRef.current !== 0) {
      await flush();
    }
  }, [error, flush]);

  const clearError = useCallback((): void => {
    setError(null);
  }, []);

  return {
    localQuantity,
    pendingDelta,
    hasPendingChanges: pendingDelta !== 0,
    isFlushing,
    error,
    adjust,
    flush,
    retry,
    clearError,
  };
}
