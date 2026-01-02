/**
 * InventoryList Component
 * 
 * Displays a list of inventory items with inline quantity controls and actions.
 * Features debounced quantity adjustments with optimistic updates.
 */

'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { InventoryItem } from '@/types/entities';
import { Button, Text, EmptyState } from '@/components/common';
import QuantityControls from '@/components/common/QuantityControls';
import { useQuantityDebounce } from '@/hooks/useQuantityDebounce';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { adjustInventoryQuantity } from '@/lib/api/inventory';
import { ShoppingCartIcon, PencilIcon, ArchiveBoxIcon, TrashIcon, QrCodeIcon, LightBulbIcon } from '@heroicons/react/24/outline';

interface InventoryListProps {
  items: InventoryItem[];
  familyId: string;
  onEdit: (item: InventoryItem) => void;
  onArchive: (item: InventoryItem) => void;
  onDelete: (item: InventoryItem) => void;
  onAddToShoppingList: (item: InventoryItem) => void;
  onViewDetails?: (item: InventoryItem) => void;
  onItemUpdated?: (updatedItem: InventoryItem) => void;
  isAdmin?: boolean;
}

/**
 * Individual inventory item row with inline quantity controls
 */
function InventoryListItem({
  item,
  familyId,
  isAdmin,
  isOnline,
  onEdit,
  onArchive,
  onDelete,
  onAddToShoppingList,
  onViewDetails,
  onItemUpdated,
  onSuggest,
}: {
  item: InventoryItem;
  familyId: string;
  isAdmin: boolean;
  isOnline: boolean;
  onEdit: (item: InventoryItem) => void;
  onArchive: (item: InventoryItem) => void;
  onDelete: (item: InventoryItem) => void;
  onAddToShoppingList: (item: InventoryItem) => void;
  onViewDetails?: (item: InventoryItem) => void;
  onItemUpdated?: (updatedItem: InventoryItem) => void;
  onSuggest: (item: InventoryItem) => void;
}) {
  const isLowStock = item.quantity <= item.lowStockThreshold;

  // Flush callback for quantity adjustments
  const handleFlush = useCallback(
    async (itemId: string, accumulatedDelta: number) => {
      const updatedItem = await adjustInventoryQuantity(familyId, itemId, {
        adjustment: accumulatedDelta,
      });
      
      // Notify parent of update
      if (onItemUpdated) {
        onItemUpdated(updatedItem);
      }
      
      return updatedItem.quantity;
    },
    [familyId, onItemUpdated]
  );

  // Initialize debounce hook for this item
  const {
    localQuantity,
    hasPendingChanges,
    isFlushing,
    error,
    adjust,
    clearError,
  } = useQuantityDebounce({
    itemId: item.itemId,
    initialQuantity: item.quantity,
    onFlush: handleFlush,
    delay: 500,
  });

  return (
    <li className="px-4 py-4 sm:px-6 hover:bg-surface-elevated transition-colors">
      {/* T012: Mobile-first stacking layout (flex-col) with horizontal on desktop (md:flex-row) */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
        <div className="flex-1 min-w-0 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <Text variant="h3" className="text-text-default truncate">
              {item.name}
            </Text>
            {isLowStock && (
              <span className="inline-flex items-center rounded-full bg-error/10 px-2.5 py-0.5 text-xs font-medium text-error">
                Low Stock
              </span>
            )}
            {item.status === 'archived' && (
              <span className="inline-flex items-center rounded-full bg-surface-elevated px-2.5 py-0.5 text-xs font-medium text-text-default">
                Archived
              </span>
            )}
          </div>
          <div className="mt-2 flex flex-col sm:flex-row sm:gap-4 text-sm text-text-secondary">
            {/* Inline Quantity Controls (Admin Only) */}
            {isAdmin && (
              <div className="flex items-center gap-2">
                <span className="font-semibold text-text-default">Quantity:</span>
                <QuantityControls
                  quantity={localQuantity}
                  onIncrement={() => adjust(1)}
                  onDecrement={() => adjust(-1)}
                  disabled={!isOnline}
                  isLoading={isFlushing}
                  hasPendingChanges={hasPendingChanges}
                  size="sm"
                  unit={item.unit || 'units'}
                  minQuantity={0}
                  incrementLabel={`Increase ${item.name} quantity`}
                  decrementLabel={`Decrease ${item.name} quantity`}
                />
              </div>
            )}
            {/* Non-admin: Just show quantity */}
            {!isAdmin && (
              <div>
                <span className="font-semibold text-text-default">Quantity:</span>{' '}
                {item.quantity} {item.unit || 'units'}
              </div>
            )}
            {item.locationName && (
              <div>
                <span className="font-semibold text-text-default">Location:</span>{' '}
                {item.locationName}
              </div>
            )}
            {item.preferredStoreName && (
              <div>
                <span className="font-semibold text-text-default">Store:</span>{' '}
                {item.preferredStoreName}
              </div>
            )}
          </div>
          {item.notes && (
            <Text variant="body" className="mt-2 text-text-secondary">
              {item.notes}
            </Text>
          )}
          {/* Error Display */}
          {error && (
            <div className="mt-2 flex items-center gap-2 text-sm">
              <span className="text-error">Failed to save: {error.message}</span>
              <Button
                variant="secondary"
                size="sm"
                onClick={clearError}
              >
                Dismiss
              </Button>
            </div>
          )}
        </div>
        
        {/* T013: Action buttons with flex-wrap and full width on mobile (w-full md:w-auto) */}
        {/* T014: Buttons inherit responsive touch targets from Button component (min-h-[44px]) */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto md:flex-shrink-0">
          {/* Suggester-only: Suggest button */}
          {!isAdmin && (
            <Button
              onClick={() => onSuggest(item)}
              variant="primary"
              size="sm"
              leftIcon={<LightBulbIcon className="h-4 w-4" />}
              title="Suggest adding to shopping list"
            >
              Suggest
            </Button>
          )}

          {/* Common action: Add to shopping list (admins can add directly) */}
          {isAdmin && (
            <Button
              onClick={() => onAddToShoppingList(item)}
              variant="secondary"
              size="sm"
              leftIcon={<ShoppingCartIcon className="h-4 w-4" />}
              title="Add to Shopping List"
            >
              Add
            </Button>
          )}

          {/* Admin-only actions */}
          {isAdmin && (
            <>
              {onViewDetails && (
                <Button
                  onClick={() => onViewDetails(item)}
                  variant="secondary"
                  size="sm"
                  leftIcon={<QrCodeIcon className="h-4 w-4" />}
                  title="Manage NFC URLs"
                >
                  NFC URLs
                </Button>
              )}
              <Button
                onClick={() => onEdit(item)}
                variant="secondary"
                size="sm"
                leftIcon={<PencilIcon className="h-4 w-4" />}
              >
                Edit
              </Button>
              {item.status === 'active' ? (
                <Button
                  onClick={() => onArchive(item)}
                  variant="secondary"
                  size="sm"
                  leftIcon={<ArchiveBoxIcon className="h-4 w-4" />}
                >
                  Archive
                </Button>
              ) : (
                <Button
                  onClick={() => onDelete(item)}
                  variant="danger"
                  size="sm"
                  leftIcon={<TrashIcon className="h-4 w-4" />}
                >
                  Delete
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </li>
  );
}

export default function InventoryList({
  items,
  familyId,
  onEdit,
  onArchive,
  onDelete,
  onAddToShoppingList,
  onViewDetails,
  onItemUpdated,
  isAdmin = false,
}: InventoryListProps) {
  const router = useRouter();
  const isOnline = useOnlineStatus();

  const handleSuggest = (item: InventoryItem) => {
    // Navigate to suggestion form with pre-filled itemId for add_to_shopping type
    router.push(`/suggestions/suggest?itemId=${item.itemId}&itemName=${encodeURIComponent(item.name)}`);
  };

  if (!items || items.length === 0) {
    return (
      <EmptyState
        icon={<ArchiveBoxIcon />}
        title="No inventory items found."
        description="Add your first item to get started."
      />
    );
  }

  return (
    <div className="overflow-hidden bg-surface shadow sm:rounded-md">
      <ul role="list" className="divide-y divide-border">
        {items.map((item) => (
          <InventoryListItem
            key={item.itemId}
            item={item}
            familyId={familyId}
            isAdmin={isAdmin}
            isOnline={isOnline}
            onEdit={onEdit}
            onArchive={onArchive}
            onDelete={onDelete}
            onAddToShoppingList={onAddToShoppingList}
            onViewDetails={onViewDetails}
            onItemUpdated={onItemUpdated}
            onSuggest={handleSuggest}
          />
        ))}
      </ul>
    </div>
  );
}
