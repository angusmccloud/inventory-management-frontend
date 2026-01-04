/**
 * @deprecated This page has been retired. NFC URL management now happens
 * in a modal on the main inventory page (InventoryList component).
 * This file is kept for reference only and should be removed in a future cleanup.
 * 
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
import { PageHeader, Button, Alert, PageLoading, PageContainer, Text } from '@/components/common';
import Dialog from '@/components/common/Dialog';

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
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

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
    router.push('/inventory');
  };

  const handleDeleteConfirm = async () => {
    try {
      const userContext = getUserContext();
      if (!userContext) {
        setError('User context not found');
        return;
      }
      await deleteInventoryItem(userContext.familyId, item!.itemId);
      router.push('/inventory');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete item');
    } finally {
      setShowDeleteDialog(false);
    }
  };

  if (isLoading) {
    return <PageLoading message="Loading item..." fullHeight={false} />;
  }

  if (error || !item) {
    return (
      <PageContainer>
        <PageHeader
          title="Item Not Found"
          description="The item you're looking for doesn't exist or you don't have access"
        />
        <div className="mt-6">
          <Alert severity="error">
            {error || 'Item not found'}
          </Alert>
          <Button variant='primary' onClick={handleBack} className="mt-4">
            Back to Inventory
          </Button>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="secondary"
          size="sm"
          onClick={handleBack}
          leftIcon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          }
          className="mb-4"
        >
          Back to Inventory
        </Button>
        <PageHeader
          title={item.name}
          description={`Quantity: ${item.quantity} ${item.unit || ''}${item.locationName ? ` • ${item.locationName}` : ''}`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Item Details Card */}
          <div className="bg-surface rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-text-secondary dark:text-white mb-4">
              Item Details
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Text variant="bodySmall">Current Quantity</Text>
                <Text variant="h2" weight="bold">{item.quantity}</Text>
              </div>
              <div>
                <Text variant="bodySmall">Unit</Text>
                <Text variant="h4">{item.unit || 'N/A'}</Text>
              </div>
              <div>
                <Text variant="bodySmall">Location</Text>
                <Text variant="h4">{item.locationName || 'Not set'}</Text>
              </div>
              {item.preferredStoreName && (
                <div>
                  <Text variant="bodySmall">Preferred Store</Text>
                  <Text variant="h4">{item.preferredStoreName}</Text>
                </div>
              )}
              {item.lowStockThreshold > 0 && (
                <div>
                  <Text variant="bodySmall">Low Stock Alert</Text>
                  <Text variant="h4">
                    Below {item.lowStockThreshold} {item.unit}
                  </Text>
                </div>
              )}
              <div>
                <Text variant="bodySmall">Status</Text>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    item.quantity <= item.lowStockThreshold
                      ? 'bg-error/10 text-error dark:bg-error/10/30 dark:text-error'
                      : 'bg-secondary/10 text-secondary-contrast dark:bg-secondary/10/30 dark:text-secondary-contrast'
                  }`}
                >
                  {item.quantity <= item.lowStockThreshold ? 'Low Stock' : 'In Stock'}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex gap-3">
              <Button
                variant="primary"
                size="md"
                onClick={() => router.push(`/inventory?edit=${item.itemId}`)}
              >
                Edit Item
              </Button>
              {isAdmin && (
                <Button
                  variant="warning"
                  size="md"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  Delete Item
                </Button>
              )}
            </div>
          </div>

          {/* NFC URL Management (Admin Only) */}
          {isAdmin && (
            <NFCUrlManager itemId={item.itemId} itemName={item.name} />
          )}

          {/* Suggester Notice */}
          {!isAdmin && (
            <div className="bg-primary dark:bg-primary/20 border border-primary rounded-lg p-4">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-primary mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h4 className="text-sm font-medium text-primary">Admin Access Required</h4>
                  <Text variant="bodySmall" color="primary" className="mt-1">
                    NFC URL management is only available to family administrators. Contact your admin to generate NFC URLs for this item.
                  </Text>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Quick Actions */}
          <div className="bg-surface rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-text-secondary dark:text-white mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <Button
                variant="secondary"
                size="md"
                fullWidth
                onClick={() => {
                  // TODO: Implement quick adjust
                  alert('Quick adjust functionality coming soon');
                }}
              >
                + Add Items
              </Button>
              <Button
                variant="warning"
                size="md"
                fullWidth
                onClick={() => {
                  // TODO: Implement quick adjust
                  alert('Quick adjust functionality coming soon');
                }}
              >
                - Remove Items
              </Button>
              <Button
                variant="primary"
                size="md"
                fullWidth
                onClick={() => {
                  router.push(`/shopping-list?add=${item.itemId}`);
                }}
              >
                Add to Shopping List
              </Button>
            </div>
          </div>

          {/* Item Metadata */}
          <div className="bg-surface rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-text-secondary dark:text-white mb-4">
              Information
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-text-default">Item ID:</span>
                <span className="text-text-secondary dark:text-white font-mono text-xs">{item.itemId.split('#').pop()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-default">Created:</span>
                <span className="text-text-secondary dark:text-white">
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-default">Updated:</span>
                <span className="text-text-secondary dark:text-white">
                  {new Date(item.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <Dialog
          isOpen={true}
          type="warning"
          title="Delete Item"
          message={`Permanently delete ${item.name}? This cannot be undone.`}
          confirmLabel="Delete"
          cancelLabel="Cancel"
          onConfirm={handleDeleteConfirm}
          onCancel={() => setShowDeleteDialog(false)}
        />
      )}
    </PageContainer>
  );
}
