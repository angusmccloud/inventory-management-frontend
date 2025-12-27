/**
 * NFC URL Usage Statistics Widget
 * 
 * @description Displays NFC URL statistics for family admin dashboard
 * Shows total URLs, active URLs, and most accessed items
 * 
 * @see specs/006-api-integration/spec.md - Feature enhancement
 */

'use client';

import { useEffect, useState } from 'react';
import { getUserContext } from '@/lib/auth';
import { listInventoryItems } from '@/lib/api/inventory';
import { nfcUrlsApi } from '@/lib/api/nfcUrls';
import { LoadingSpinner } from '@/components/common';

interface NFCStats {
  totalUrls: number;
  activeUrls: number;
  itemsWithUrls: number;
  mostAccessedItem: string | null;
}

/**
 * NFC Statistics Widget for Admin Dashboard
 */
export default function NFCStatsWidget() {
  const [stats, setStats] = useState<NFCStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const userContext = getUserContext();
      if (!userContext) {
        setError('User context not found');
        setIsLoading(false);
        return;
      }

      // Fetch all inventory items
      const inventoryResponse = await listInventoryItems(userContext.familyId);
      const items = inventoryResponse.items || [];

      // Fetch NFC URLs for each item and aggregate stats
      let totalUrls = 0;
      let activeUrls = 0;
      let itemsWithUrls = 0;
      let maxAccess = 0;
      let mostAccessedItemName: string | null = null;

      for (const item of items) {
        try {
          const urlsResponse = await nfcUrlsApi.listForItem(item.itemId);
          const urls = urlsResponse.urls || [];

          if (urls.length > 0) {
            itemsWithUrls++;
            totalUrls += urls.length;
            activeUrls += urls.filter((url) => url.isActive).length;

            // Find most accessed URL for this item
            for (const url of urls) {
              if (url.accessCount > maxAccess) {
                maxAccess = url.accessCount;
                mostAccessedItemName = item.name;
              }
            }
          }
        } catch (err) {
          // Skip items without NFC URLs
          continue;
        }
      }

      setStats({
        totalUrls,
        activeUrls,
        itemsWithUrls,
        mostAccessedItem: mostAccessedItemName,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load NFC statistics');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
          NFC URL Statistics
        </h3>
        <div className="flex justify-center py-8">
          <LoadingSpinner size="md" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
          NFC URL Statistics
        </h3>
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
          NFC URL Statistics
        </h3>
        
        {stats && (
          <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {/* Total URLs */}
            <div className="bg-gray-50 dark:bg-gray-700 px-4 py-5 rounded-lg">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                Total NFC URLs
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900 dark:text-gray-100">
                {stats.totalUrls}
              </dd>
            </div>

            {/* Active URLs */}
            <div className="bg-gray-50 dark:bg-gray-700 px-4 py-5 rounded-lg">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                Active URLs
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900 dark:text-gray-100">
                {stats.activeUrls}
              </dd>
            </div>

            {/* Items with URLs */}
            <div className="bg-gray-50 dark:bg-gray-700 px-4 py-5 rounded-lg">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                Items with URLs
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900 dark:text-gray-100">
                {stats.itemsWithUrls}
              </dd>
            </div>

            {/* Most Accessed Item */}
            <div className="bg-gray-50 dark:bg-gray-700 px-4 py-5 rounded-lg">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                Most Accessed Item
              </dt>
              <dd className="mt-1 text-lg font-semibold text-gray-900 dark:text-gray-100">
                {stats.mostAccessedItem || 'N/A'}
              </dd>
            </div>
          </dl>
        )}

        {/* Refresh Button */}
        <div className="mt-6">
          <button
            onClick={loadStats}
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg
              className="mr-2 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Refresh Stats
          </button>
        </div>
      </div>
    </div>
  );
}
