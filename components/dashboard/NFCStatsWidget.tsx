/**
 * Usage Summary Widget
 * 
 * @description Displays usage statistics for family admin dashboard
 * Shows inventory counts, NFC URLs, storage locations, and access analytics
 * 
 * @see specs/014-inventory-dashboards/spec.md - Dashboard analytics
 */

'use client';

import { useEffect, useState } from 'react';
import { getUserContext } from '@/lib/auth';
import { listInventoryItems } from '@/lib/api/inventory';
import { nfcUrlsApi } from '@/lib/api/nfcUrls';
import { listStorageLocations } from '@/lib/api/reference-data';
import { listDashboards } from '@/lib/api/dashboards';
import { LoadingSpinner } from '@/components/common';
import { Button } from '@/components/common/Button/Button';
import { Text } from '@/components/common/Text/Text';

interface UsageStats {
  totalInventoryItems: number;
  lowStockItems: number;
  totalStorageLocations: number;
  listNFCs: number;
  itemNFCs: number;
  mostAccessedPages: Array<{ name: string; accessCount: number }>;
}

/**
 * Usage Summary Widget for Admin Dashboard
 */
export default function NFCStatsWidget() {
  const [stats, setStats] = useState<UsageStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const userContext = getUserContext();
      if (!userContext || !userContext.familyId) {
        setError('Family context not available');
        setIsLoading(false);
        return;
      }

      const familyId = userContext.familyId;

      // Fetch all data in parallel
      const [inventoryResponse, locationsData, dashboardsData] = await Promise.all([
        listInventoryItems(familyId),
        listStorageLocations(familyId).catch(() => []),
        listDashboards(false).catch(() => []),
      ]);

      const items = inventoryResponse.items || [];
      const locations = locationsData || [];
      const dashboards = dashboardsData || [];

      // Calculate inventory stats
      const totalInventoryItems = items.length;
      const lowStockItems = items.filter(
        (item) => item.lowStockThreshold > 0 && item.quantity <= item.lowStockThreshold
      ).length;

      // Calculate NFC stats
      let itemNFCCount = 0;
      const itemAccessCounts: Array<{ name: string; accessCount: number; type: 'item' }> = [];

      for (const item of items) {
        try {
          const urlsResponse = await nfcUrlsApi.listForItem(item.itemId);
          const urls = urlsResponse.urls || [];

          if (urls.length > 0) {
            itemNFCCount++;
            
            // Sum access counts for all URLs of this item
            const totalItemAccess = urls.reduce((sum, url) => sum + (url.accessCount || 0), 0);
            if (totalItemAccess > 0) {
              itemAccessCounts.push({
                name: item.name,
                accessCount: totalItemAccess,
                type: 'item',
              });
            }
          }
        } catch (err) {
          // Skip items without NFC URLs
          continue;
        }
      }

      // Calculate dashboard NFC count and access stats
      const listNFCCount = dashboards.filter((d) => d.isActive).length;
      const dashboardAccessCounts: Array<{ name: string; accessCount: number; type: 'dashboard' }> = 
        dashboards
          .filter((d) => d.accessCount && d.accessCount > 0)
          .map((d) => ({
            name: d.title,
            accessCount: d.accessCount || 0,
            type: 'dashboard' as const,
          }));

      // Combine and sort all access counts
      const allAccessCounts = [...itemAccessCounts, ...dashboardAccessCounts];
      allAccessCounts.sort((a, b) => b.accessCount - a.accessCount);
      const mostAccessedPages = allAccessCounts.slice(0, 3);

      setStats({
        totalInventoryItems,
        lowStockItems,
        totalStorageLocations: locations.length,
        listNFCs: listNFCCount,
        itemNFCs: itemNFCCount,
        mostAccessedPages,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load usage statistics');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-surface shadow sm:rounded-lg p-6">
        <h3 className="text-lg font-medium text-text-default mb-4">
          Usage Summary
        </h3>
        <div className="flex justify-center py-8">
          <LoadingSpinner size="md" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-surface shadow sm:rounded-lg p-6">
        <h3 className="text-lg font-medium text-text-default mb-4">
          Usage Summary
        </h3>
        <Text variant="bodySmall" color="error">{error}</Text>
      </div>
    );
  }

  return (
    <div className="bg-surface shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium text-text-default mb-4">
          Usage Summary
        </h3>
        
        {stats && (
          <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {/* Number of Items in Inventory */}
            <div className="bg-surface-elevated px-4 py-5 rounded-lg">
              <dt className="text-sm font-medium text-text-secondary truncate">
                Items in Inventory
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-text-default">
                {stats.totalInventoryItems}
              </dd>
            </div>

            {/* Number of Storage Locations */}
            <div className="bg-surface-elevated px-4 py-5 rounded-lg">
              <dt className="text-sm font-medium text-text-secondary truncate">
                Storage Locations
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-text-default">
                {stats.totalStorageLocations}
              </dd>
            </div>

            {/* Number of Items at Low Stock */}
            <div className="bg-surface-elevated px-4 py-5 rounded-lg">
              <dt className="text-sm font-medium text-text-secondary truncate">
                Low Stock Items
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-text-default">
                {stats.lowStockItems}
              </dd>
            </div>

            {/* Number of List NFCs */}
            <div className="bg-surface-elevated px-4 py-5 rounded-lg">
              <dt className="text-sm font-medium text-text-secondary truncate">
                List NFCs (Dashboards)
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-text-default">
                {stats.listNFCs}
              </dd>
            </div>

            {/* Number of Items with NFCs */}
            <div className="bg-surface-elevated px-4 py-5 rounded-lg">
              <dt className="text-sm font-medium text-text-secondary truncate">
                Items with NFCs
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-text-default">
                {stats.itemNFCs}
              </dd>
            </div>

            {/* Most Accessed Pages */}
            <div className="bg-surface-elevated px-4 py-5 rounded-lg">
              <dt className="text-sm font-medium text-text-secondary truncate">
                Most Accessed Pages
              </dt>
              <dd className="mt-2 space-y-1">
                {stats.mostAccessedPages.length > 0 ? (
                  stats.mostAccessedPages.map((page, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <Text variant="bodySmall" color="primary" className="truncate">
                        {index + 1}. {page.name}
                      </Text>
                      <Text variant="bodySmall" color="secondary" className="ml-2">
                        ({page.accessCount})
                      </Text>
                    </div>
                  ))
                ) : (
                  <Text variant="bodySmall" color="secondary">No access data</Text>
                )}
              </dd>
            </div>
          </dl>
        )}

        {/* Refresh Button */}
        <div className="mt-6">
          <Button
            variant="primary"
            size="sm"
            onClick={loadStats}
            disabled={isLoading}
            loading={isLoading}
            leftIcon={
              !isLoading ? (
                <svg
                  className="h-4 w-4"
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
              ) : undefined
            }
          >
            Refresh Stats
          </Button>
        </div>
      </div>
    </div>
  );
}
