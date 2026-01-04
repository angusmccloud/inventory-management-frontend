/**
 * InventoryList Component
 *
 * Displays a list of inventory items with inline quantity controls and actions.
 * Features debounced quantity adjustments with optimistic updates.
 */

'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { InventoryItem } from '@/types/entities';
import { Button, Text, EmptyState, Modal } from '@/components/common';
import { Badge } from '@/components/common/Badge/Badge';
import QuantityControls from '@/components/common/QuantityControls';
import { useQuantityDebounce } from '@/hooks/useQuantityDebounce';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { adjustInventoryQuantity } from '@/lib/api/inventory';
import NFCUrlManager from '@/components/inventory/NFCUrlManager';
import { listShoppingListItems, ShoppingListItem } from '@/lib/api/shoppingList';
import {
  ShoppingCartIcon,
  PencilIcon,
  ArchiveBoxIcon,
  TrashIcon,
  QrCodeIcon,
  LightBulbIcon,
} from '@/components/common/icons';

interface InventoryListProps {
  items: InventoryItem[];
  familyId: string;
  onEdit: (item: InventoryItem) => void;
  onArchive: (item: InventoryItem) => void;
  onDelete: (item: InventoryItem) => void;
  onAddToShoppingList: (item: InventoryItem) => void;
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
  onItemUpdated,
  onSuggest,
  onShowNFCModal,
  isInShoppingList,
}: {
  item: InventoryItem;
  familyId: string;
  isAdmin: boolean;
  isOnline: boolean;
  onEdit: (item: InventoryItem) => void;
  onArchive: (item: InventoryItem) => void;
  onDelete: (item: InventoryItem) => void;
  onAddToShoppingList: (item: InventoryItem) => void;
  onItemUpdated?: (updatedItem: InventoryItem) => void;
  onSuggest: (item: InventoryItem) => void;
  onShowNFCModal: (item: InventoryItem) => void;
  isInShoppingList?: boolean;
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
  const { localQuantity, hasPendingChanges, isFlushing, error, adjust, clearError } =
    useQuantityDebounce({
      itemId: item.itemId,
      initialQuantity: item.quantity,
      onFlush: handleFlush,
      delay: 500,
    });

  return (
    <li className="px-4 py-4 transition-colors hover:bg-surface-elevated sm:px-6">
      {/* T012: Mobile-first stacking layout (flex-col) with horizontal on desktop (md:flex-row) */}
      <div className="flex flex-col items-start gap-4 md:flex-row md:items-center">
        <div className="w-full min-w-0 flex-1 md:w-auto">
          <div className="flex items-center gap-2">
            <Text variant="h3" className="truncate text-text-default">
              {item.name}
            </Text>
            {isLowStock && (
              <Badge variant="warning" size="sm">
                Low Stock
              </Badge>
            )}
            {item.status === 'archived' && (
              <Badge variant="warning" size="sm">
                Archived
              </Badge>
            )}
          </div>
          <div className="mt-2 flex flex-col text-sm text-text-secondary sm:flex-row sm:items-center sm:gap-4">
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
                <span className="font-semibold text-text-default">Quantity:</span> {item.quantity}{' '}
                {item.unit || 'units'}
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
              <Button variant="secondary" size="sm" onClick={clearError}>
                Dismiss
              </Button>
            </div>
          )}
        </div>

        {/* T013: Action buttons with flex-wrap and full width on mobile (w-full md:w-auto) */}
        {/* T014: Buttons inherit responsive touch targets from Button component (min-h-[44px]) */}
        <div className="flex w-full flex-wrap gap-2 md:w-auto md:flex-shrink-0">
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

          {/* Admin-only actions */}
          {isAdmin && (
            <>
              <Button
                onClick={() => onAddToShoppingList(item)}
                variant="primary"
                size="sm"
                leftIcon={<ShoppingCartIcon className="h-4 w-4" />}
                title={isInShoppingList ? 'Already in shopping list' : 'Add to Shopping List'}
                disabled={!!isInShoppingList}
              >
                {isInShoppingList ? 'In List' : 'Add'}
              </Button>
              <Button
                onClick={() => onShowNFCModal(item)}
                variant="secondary"
                size="sm"
                leftIcon={<QrCodeIcon className="h-4 w-4" />}
                title="Manage item link"
              >
                Item Link
              </Button>
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
                  variant="warning"
                  size="sm"
                  leftIcon={<ArchiveBoxIcon className="h-4 w-4" />}
                >
                  Archive
                </Button>
              ) : (
                <Button
                  onClick={() => onDelete(item)}
                  variant="warning"
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
  onItemUpdated,
  isAdmin = false,
}: InventoryListProps) {
  const router = useRouter();
  const isOnline = useOnlineStatus();
  const [nfcModalItem, setNfcModalItem] = useState<InventoryItem | null>(null);
  const [shoppingListItems, setShoppingListItems] = useState<ShoppingListItem[]>([]);

  // Fetch active (pending) shopping list items for this family so we can
  // disable Add buttons for inventory items already present.
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const resp = await listShoppingListItems(familyId, { status: 'pending' });
        if (mounted) setShoppingListItems(resp.items || []);
      } catch (err) {
        // non-blocking: log and continue

        console.warn('Failed to load shopping list items', err);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [familyId]);

  const handleSuggest = (item: InventoryItem) => {
    // Navigate to suggestion form with pre-filled itemId for add_to_shopping type
    router.push(
      `/suggestions/suggest?itemId=${item.itemId}&itemName=${encodeURIComponent(item.name)}`
    );
  };

  const handleShowNFCModal = (item: InventoryItem) => {
    setNfcModalItem(item);
  };

  const handleCloseNFCModal = () => {
    setNfcModalItem(null);
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

  // Group items by storage location for display
  const groupedItems: Record<string, InventoryItem[]> = {};
  items.forEach((item) => {
    const locationKey = item.locationName || 'Unassigned';
    if (!groupedItems[locationKey]) {
      groupedItems[locationKey] = [];
    }
    groupedItems[locationKey].push(item);
  });

  // Sort items within each location alphabetically by name
  Object.keys(groupedItems).forEach((locationKey) => {
    const locationItems = groupedItems[locationKey];
    if (locationItems) {
      locationItems.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    }
  });

  // Get sorted location names: alphabetically, with 'Unassigned' at the end
  const sortedLocationNames = Object.keys(groupedItems).sort((a, b) => {
    if (a === 'Unassigned') return 1;
    if (b === 'Unassigned') return -1;
    return a.localeCompare(b);
  });

  return (
    <div className="mt-6 space-y-8">
      {sortedLocationNames.map((locationName) => {
        const locationItems = groupedItems[locationName];
        if (!locationItems) return null;

        return (
          <div key={locationName}>
            <Text variant="h3" className="mb-4 text-text-default">
              {locationName}
            </Text>
            <div className="overflow-hidden bg-surface shadow sm:rounded-md">
              <ul role="list" className="divide-y divide-border">
                {locationItems.map((item) => {
                  const presentItemIds = new Set(
                    shoppingListItems.flatMap((s) => (s.itemId ? [s.itemId] : []))
                  );

                  return (
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
                      onItemUpdated={onItemUpdated}
                      onSuggest={handleSuggest}
                      onShowNFCModal={handleShowNFCModal}
                      isInShoppingList={!!item.itemId && presentItemIds.has(item.itemId)}
                    />
                  );
                })}
              </ul>
            </div>
          </div>
        );
      })}

      {/* NFC URL Management Modal */}
      {nfcModalItem && (
        <Modal
          isOpen={true}
          onClose={handleCloseNFCModal}
          title={`Item Link - ${nfcModalItem.name}`}
          size="lg"
        >
          <NFCUrlManager itemId={nfcModalItem.itemId} />
        </Modal>
      )}
    </div>
  );
}
