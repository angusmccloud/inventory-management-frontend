/**
 * Inventory Item Detail Page
 * 
 * @description Detailed view of a single inventory item with NFC URL management
 * Features:
 * - Item details (name, quantity, category, location)
 * - Quantity adjustment
 * - NFC URL management (admin only)
 * - Edit and delete actions
 * 
 * @see specs/006-api-integration/spec.md - User Story 3
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUserContext } from '@/lib/auth';
import { getInventoryItem, deleteInventoryItem } from '@/lib/api/inventory';
import { InventoryItem } from '@/types/entities';
import NFCUrlManager from '@/components/inventory/NFCUrlManager';
import { PageHeader, Button, Alert } from '@/components/common';

interface ItemDetailPageProps {
  params: Promise<{
    itemId: string;
  }>;
}

export default function ItemDetailPage({ params }: ItemDetailPageProps) {
  const router = useRouter();
  const [itemId, setItemId] = useState<string>('');
  const [item, setItem] = useState<InventoryItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Resolve params
  useEffect(() => {
    params.then((p) => setItemId(p.itemId));
  }, [params]);

  // Check user role
  useEffect(() => {
    const userContext = getUserContext();
    if (userContext?.role === 'admin') {
      setIsAdmin(true);
    }
  }, []);

  // Load item details
  useEffect(() => {
    if (!itemId) return;
    loadItem();
  }, [itemId]);

  const loadItem = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const userContext = getUserContext();
      if (!userContext) {
        throw new Error('User context not found');
      }
      const fetchedItem = await getInventoryItem(userContext.familyId, itemId);
      setItem(fetchedItem);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load item');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    router.push('/dashboard/inventory');
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-4 text-gray-600 dark:text-gray-300">Loading item...</span>
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="container mx-auto px-4 py-8">
        <PageHeader
          title="Item Not Found"
          description="The item you're looking for doesn't exist or you don't have access"
        />
        <div className="mt-6">
          <Alert severity="error">
            {error || 'Item not found'}
          </Alert>
          <Button onClick={handleBack} className="mt-4">
            Back to Inventory
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={handleBack}
          className="flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 mb-4"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Inventory
        </button>
        <PageHeader
          title={item.name}
          description={`Quantity: ${item.quantity} ${item.unit || ''}${item.locationName ? ` • ${item.locationName}` : ''}`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Item Details Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Item Details
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Current Quantity</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{item.quantity}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Unit</p>
                <p className="text-lg text-gray-900 dark:text-white">{item.unit || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Location</p>
                <p className="text-lg text-gray-900 dark:text-white">{item.locationName || 'Not set'}</p>
              </div>
              {item.preferredStoreName && (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Preferred Store</p>
                  <p className="text-lg text-gray-900 dark:text-white">{item.preferredStoreName}</p>
                </div>
              )}
              {item.lowStockThreshold > 0 && (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Low Stock Alert</p>
                  <p className="text-lg text-gray-900 dark:text-white">
                    Below {item.lowStockThreshold} {item.unit}
                  </p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    item.quantity <= item.lowStockThreshold
                      ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                      : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                  }`}
                >
                  {item.quantity <= item.lowStockThreshold ? 'Low Stock' : 'In Stock'}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => router.push(`/dashboard/inventory?edit=${item.itemId}`)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Edit Item
              </button>
              {isAdmin && (
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
                      const userContext = getUserContext();
                      if (!userContext) {
                        setError('User context not found');
                        return;
                      }
                      deleteInventoryItem(userContext.familyId, item.itemId).then(() => {
                        router.push('/dashboard/inventory');
                      }).catch((err) => {
                        setError(err instanceof Error ? err.message : 'Failed to delete item');
                      });
                    }
                  }}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Delete Item
                </button>
              )}
            </div>
          </div>

          {/* NFC URL Management (Admin Only) */}
          {isAdmin && (
            <NFCUrlManager itemId={item.itemId} itemName={item.name} />
          )}

          {/* Suggester Notice */}
          {!isAdmin && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300">Admin Access Required</h4>
                  <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
                    NFC URL management is only available to family administrators. Contact your admin to generate NFC URLs for this item.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <button
                onClick={() => {
                  // TODO: Implement quick adjust
                  alert('Quick adjust functionality coming soon');
                }}
                className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                + Add Items
              </button>
              <button
                onClick={() => {
                  // TODO: Implement quick adjust
                  alert('Quick adjust functionality coming soon');
                }}
                className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                - Remove Items
              </button>
              <button
                onClick={() => {
                  router.push(`/dashboard/shopping-list?add=${item.itemId}`);
                }}
                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Add to Shopping List
              </button>
            </div>
          </div>

          {/* Item Metadata */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Information
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Item ID:</span>
                <span className="text-gray-900 dark:text-white font-mono text-xs">{item.itemId.split('#').pop()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Created:</span>
                <span className="text-gray-900 dark:text-white">
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Updated:</span>
                <span className="text-gray-900 dark:text-white">
                  {new Date(item.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
