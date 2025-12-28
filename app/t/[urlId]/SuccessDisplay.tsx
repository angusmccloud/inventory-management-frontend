'use client';

import { useState } from 'react';

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
  const [currentQuantity, setCurrentQuantity] = useState(initialQuantity);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calculate the total change from previous to current
  const totalChange = currentQuantity - previousQuantity;
  const changeMessage = totalChange < 0 
    ? `Reduced by ${Math.abs(totalChange)}`
    : totalChange > 0
    ? `Increased by ${totalChange}`
    : 'No change';

  const handleAdjustment = async (delta: -1 | 1) => {
    if (isLoading) return;

    // Check minimum quantity constraint
    if (delta === -1 && currentQuantity === 0) {
      setError('Cannot reduce quantity below 0');
      setTimeout(() => setError(null), 3000);
      return;
    }

    const previousQty = currentQuantity;
    const optimisticQty = currentQuantity + delta;
    
    setCurrentQuantity(optimisticQty);
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${apiBaseUrl}/api/adjust/${urlId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ delta }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || 'Adjustment failed');
      }

      const data = await response.json();
      setCurrentQuantity(data.newQuantity);
      setIsLoading(false);
    } catch (error) {
      setCurrentQuantity(previousQty);
      setIsLoading(false);
      setError(error instanceof Error ? error.message : 'Adjustment failed');
      setTimeout(() => setError(null), 5000);
    }
  };

  const initialDelta = initialQuantity - previousQuantity;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
      {/* Success Icon */}
      <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
        <svg
          className="w-10 h-10 text-green-600 dark:text-green-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>

      {/* Item Name */}
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        {itemName}
      </h1>

      {/* Adjustment Details */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-6">
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
              Previous
            </p>
            <p className="text-3xl font-bold text-gray-400 dark:text-gray-500">
              {previousQuantity}
            </p>
          </div>
          <div className="text-2xl text-gray-400 dark:text-gray-500">
            →
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
              New Quantity
            </p>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
              {currentQuantity}
            </p>
          </div>
        </div>
        <p className="text-sm text-center text-gray-600 dark:text-gray-300">
          {changeMessage}
        </p>
        {isLoading && (
          <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">
            Updating...
          </p>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Additional Info */}
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        Make additional adjustments:
      </p>

      {/* Adjustment Buttons */}
      <div className="flex gap-4 justify-center mb-6">
        <button
          onClick={() => handleAdjustment(-1)}
          disabled={isLoading || currentQuantity === 0}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors min-w-[140px] min-h-[44px]"
          aria-label="Remove 1 from quantity"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M20 12H4" />
          </svg>
          Remove 1
        </button>

        <button
          onClick={() => handleAdjustment(1)}
          disabled={isLoading}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors min-w-[140px] min-h-[44px]"
          aria-label="Add 1 to quantity"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
          </svg>
          Add 1
        </button>
      </div>

      {/* Footer Message */}
      <p className="text-xs text-gray-400 dark:text-gray-500">
        Changes are saved automatically. You can close this page anytime.
      </p>
    </div>
  );
}
