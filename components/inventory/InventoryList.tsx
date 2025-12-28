/**
 * InventoryList Component
 * 
 * Displays a list of inventory items with filtering and actions.
 */

'use client';

import { useRouter } from 'next/navigation';
import { InventoryItem } from '@/types/entities';
import { Button, Text, EmptyState } from '@/components/common';
import { ShoppingCartIcon, PencilIcon, ArchiveBoxIcon, TrashIcon, QrCodeIcon, LightBulbIcon } from '@heroicons/react/24/outline';

interface InventoryListProps {
  items: InventoryItem[];
  onEdit: (item: InventoryItem) => void;
  onAdjustQuantity: (item: InventoryItem) => void;
  onArchive: (item: InventoryItem) => void;
  onDelete: (item: InventoryItem) => void;
  onAddToShoppingList: (item: InventoryItem) => void;
  onViewDetails?: (item: InventoryItem) => void;
  isAdmin?: boolean;
}

export default function InventoryList({
  items,
  onEdit,
  onAdjustQuantity,
  onArchive,
  onDelete,
  onAddToShoppingList,
  onViewDetails,
  isAdmin = false,
}: InventoryListProps) {
  const router = useRouter();

  const handleSuggest = (item: InventoryItem) => {
    // Navigate to suggestion form with pre-filled itemId for add_to_shopping type
    router.push(`/dashboard/suggestions/suggest?itemId=${item.itemId}&itemName=${encodeURIComponent(item.name)}`);
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
      <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
        {items.map((item) => {
          const isLowStock = item.quantity <= item.lowStockThreshold;
          
          return (
            <li key={item.itemId} className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Text variant="h3" className="text-text-default truncate">
                      {item.name}
                    </Text>
                    {isLowStock && (
                      <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                        Low Stock
                      </span>
                    )}
                    {item.status === 'archived' && (
                      <span className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-700 px-2.5 py-0.5 text-xs font-medium text-text-default">
                        Archived
                      </span>
                    )}
                  </div>
                  <div className="mt-2 flex flex-col sm:flex-row sm:gap-4 text-sm text-text-secondary">
                    <div>
                      <span className="font-semibold text-text-default">Quantity:</span>{' '}
                      {item.quantity} {item.unit || 'units'}
                    </div>
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
                </div>
                
                <div className="ml-4 flex flex-shrink-0 gap-2">
                  {/* Suggester-only: Suggest button */}
                  {!isAdmin && (
                    <Button
                      onClick={() => handleSuggest(item)}
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
                      <Button
                        onClick={() => onAdjustQuantity(item)}
                        variant="secondary"
                        size="sm"
                      >
                        Adjust
                      </Button>
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
        })}
      </ul>
    </div>
  );
}
