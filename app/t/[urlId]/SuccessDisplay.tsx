'use client';

import { useEffect } from 'react';
import { useQuantityDebounce } from '@/hooks/useQuantityDebounce';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { QuantityControls } from '@/components/common';
import { Button } from '@/components/common/Button/Button';
import { Text } from '@/components/common/Text/Text';

interface SuccessDisplayProps {
  itemName: string;
  initialQuantity: number;
  previousQuantity: number;
  urlId: string;
  apiBaseUrl: string;
}

export default function SuccessDisplay({
  itemName,
  initialQuantity,
  previousQuantity,
  urlId,
  apiBaseUrl,
}: SuccessDisplayProps) {
  const isOnline = useOnlineStatus();

  const handleFlush = async (itemId: string, accumulatedDelta: number): Promise<number> => {
    const response = await fetch(`${apiBaseUrl}/api/adjust/${itemId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ delta: accumulatedDelta }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || 'Adjustment failed');
    }

    const data = await response.json();
    return data.newQuantity;
  };

  const {
    localQuantity,
    pendingDelta,
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
    delay: 500,
  });

  // Auto-flush on page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (pendingDelta !== 0) {
        flush();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [flush, pendingDelta]);

  // Calculate the change from initial state (what the NFC tap resulted in)
  const changeFromInitial = localQuantity - initialQuantity;
  const changeMessage = changeFromInitial < 0 
    ? `Reduced by ${Math.abs(changeFromInitial)}`
    : changeFromInitial > 0
    ? `Increased by ${changeFromInitial}`
    : 'No change';

  return (
    <div className="bg-surface rounded-lg shadow-lg p-8 text-center">
      {/* Item Name */}
      <h1 className="text-2xl font-bold text-text-secondary dark:text-white mb-6">
        {itemName}
      </h1>

      {/* Adjustment Details */}
      <div className="bg-surface-elevated rounded-lg p-6 mb-6">
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="text-center">
            <Text variant="bodySmall" color="primary" className="uppercase tracking-wide mb-1">
              Previous
            </Text>
            <Text variant="h1" weight="bold">
              {previousQuantity}
            </Text>
          </div>
          <div className="text-2xl text-text-default">
            →
          </div>
          <div className="text-center">
            <Text variant="bodySmall" color="primary" className="uppercase tracking-wide mb-1">
              Current
            </Text>
            <Text variant="h1" weight="bold" className="text-secondary-contrast">
              {localQuantity}
            </Text>
          </div>
        </div>
        <Text variant="bodySmall" color="primary" className="text-center">
          {changeMessage}
        </Text>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-error/10/20 rounded-lg">
          <Text variant="bodySmall" color="error">{error.message}</Text>
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
      )}

      {/* Additional Info */}
      <Text variant="bodySmall" color="primary" className="mb-6">
        Make additional adjustments:
        {pendingDelta !== 0 && (
          <span className="ml-2 text-xs text-primary">
            (Pending: {pendingDelta > 0 ? `+${pendingDelta}` : pendingDelta})
          </span>
        )}
      </Text>

      {/* Adjustment Controls with Debouncing */}
      <div className="flex justify-center mb-6">
        <QuantityControls
          quantity={localQuantity}
          onIncrement={() => adjust(1)}
          onDecrement={() => adjust(-1)}
          isLoading={isFlushing}
          hasPendingChanges={pendingDelta !== 0}
          disabled={!isOnline}
          size="lg"
          minQuantity={0}
        />
      </div>

      {/* Offline Warning */}
      {!isOnline && (
        <div className="mb-6 p-4 bg-warning/10 rounded-lg">
          <Text variant="bodySmall" color="warning">
            You are currently offline. Changes will be saved when connection is restored.
          </Text>
        </div>
      )}

      {/* Footer Message */}
      <Text variant="caption" color="primary">
        Changes are saved automatically. You can close this page anytime.
      </Text>
    </div>
  );
}
