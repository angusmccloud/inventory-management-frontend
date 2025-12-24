/**
 * InventoryList Component
 * 
 * Displays a list of inventory items with filtering and actions.
 */

'use client';

import { InventoryItem } from '@/types/entities';

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
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">No inventory items found.</p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Add your first item to get started.</p>
      </div>
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
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 truncate">
                      {item.name}
                    </h3>
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
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{item.notes}</p>
                  )}
                </div>
                
                <div className="ml-4 flex flex-shrink-0 gap-2">
                  <button
                    onClick={() => onAddToShoppingList(item)}
                    className="rounded-md bg-purple-50 px-3 py-2 text-sm font-semibold text-purple-700 hover:bg-purple-100"
                    title="Add to Shopping List"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => onAdjustQuantity(item)}
                    className="rounded-md bg-green-50 px-3 py-2 text-sm font-semibold text-green-700 hover:bg-green-100"
                  >
                    Adjust
                  </button>
                  <button
                    onClick={() => onEdit(item)}
                    className="rounded-md bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100"
                  >
                    Edit
                  </button>
                  {item.status === 'active' ? (
                    <button
                      onClick={() => onArchive(item)}
                      className="rounded-md bg-gray-50 dark:bg-gray-700 px-3 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                    >
                      Archive
                    </button>
                  ) : (
                    <button
                      onClick={() => onDelete(item)}
                      className="rounded-md bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-100"
                    >
                      Delete
                    </button>
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
