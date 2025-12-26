/**
 * InventoryList Component
 * 
 * Displays a list of inventory items with filtering and actions.
 */

'use client';

import { InventoryItem } from '@/types/entities';
import { Button, Text, EmptyState } from '@/components/common';
import { ShoppingCartIcon, PencilIcon, ArchiveBoxIcon, TrashIcon } from '@heroicons/react/24/outline';

interface InventoryListProps {
  items: InventoryItem[];
  onEdit: (item: InventoryItem) => void;
  onAdjustQuantity: (item: InventoryItem) => void;
  onArchive: (item: InventoryItem) => void;
  onDelete: (item: InventoryItem) => void;
  onAddToShoppingList: (item: InventoryItem) => void;
}

export default function InventoryList({
  items,
  onEdit,
  onAdjustQuantity,
  onArchive,
  onDelete,
  onAddToShoppingList,
}: InventoryListProps) {
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
    <div className="overflow-hidden bg-white dark:bg-gray-800 shadow sm:rounded-md">
      <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
        {items.map((item) => {
          const isLowStock = item.quantity <= item.lowStockThreshold;
          
          return (
            <li key={item.itemId} className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Text variant="h3" className="text-gray-900 dark:text-gray-100 truncate">
                      {item.name}
                    </Text>
                    {isLowStock && (
                      <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                        Low Stock
                      </span>
                    )}
                    {item.status === 'archived' && (
                      <span className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-700 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:text-gray-200">
                        Archived
                      </span>
                    )}
                  </div>
                  <div className="mt-2 flex flex-col sm:flex-row sm:gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <div>
                      <span className="font-semibold text-gray-900 dark:text-gray-100">Quantity:</span>{' '}
                      {item.quantity} {item.unit || 'units'}
                    </div>
                    {item.locationName && (
                      <div>
                        <span className="font-semibold text-gray-900 dark:text-gray-100">Location:</span>{' '}
                        {item.locationName}
                      </div>
                    )}
                    {item.preferredStoreName && (
                      <div>
                        <span className="font-semibold text-gray-900 dark:text-gray-100">Store:</span>{' '}
                        {item.preferredStoreName}
                      </div>
                    )}
                  </div>
                  {item.notes && (
                    <Text variant="body" className="mt-2 text-gray-600 dark:text-gray-400">
                      {item.notes}
                    </Text>
                  )}
                </div>
                
                <div className="ml-4 flex flex-shrink-0 gap-2">
                  <Button
                    onClick={() => onAddToShoppingList(item)}
                    variant="secondary"
                    size="sm"
                    leftIcon={<ShoppingCartIcon className="h-4 w-4" />}
                    className="bg-purple-50 text-purple-700 hover:bg-purple-100 focus:ring-purple-500"
                    title="Add to Shopping List"
                  >
                    Add
                  </Button>
                  <Button
                    onClick={() => onAdjustQuantity(item)}
                    variant="secondary"
                    size="sm"
                    className="bg-green-50 text-green-700 hover:bg-green-100 focus:ring-green-500"
                  >
                    Adjust
                  </Button>
                  <Button
                    onClick={() => onEdit(item)}
                    variant="secondary"
                    size="sm"
                    leftIcon={<PencilIcon className="h-4 w-4" />}
                    className="bg-blue-50 text-blue-700 hover:bg-blue-100 focus:ring-blue-500"
                  >
                    Edit
                  </Button>
                  {item.status === 'active' ? (
                    <Button
                      onClick={() => onArchive(item)}
                      variant="secondary"
                      size="sm"
                      leftIcon={<ArchiveBoxIcon className="h-4 w-4" />}
                      className="bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
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
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
