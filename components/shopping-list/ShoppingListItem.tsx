/**
 * ShoppingListItem Component
 * Feature: 002-shopping-lists
 * 
 * Displays a single shopping list item with checkbox to toggle purchased status.
 */

'use client';

import { ShoppingListItem } from '@/lib/api/shoppingList';
import { useState } from 'react';

interface ShoppingListItemProps {
  item: ShoppingListItem;
  onToggleStatus: (item: ShoppingListItem) => Promise<void>;
  onEdit: (item: ShoppingListItem) => void;
  onRemove: (item: ShoppingListItem) => void;
}

export default function ShoppingListItemComponent({
  item,
  onToggleStatus,
  onEdit,
  onRemove,
}: ShoppingListItemProps) {
  const [isToggling, setIsToggling] = useState(false);

  const handleToggle = async () => {
    setIsToggling(true);
    try {
      await onToggleStatus(item);
    } finally {
      setIsToggling(false);
    }
  };

  const isPurchased = item.status === 'purchased';

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border ${isPurchased ? 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800' : 'border-gray-300 dark:border-gray-600'} p-4 flex flex-col h-full`}>
      {/* Header with checkbox and status */}
      <div className="flex items-start gap-3 mb-3">
        <input
          type="checkbox"
          checked={isPurchased}
          onChange={handleToggle}
          disabled={isToggling}
          className="mt-1 h-5 w-5 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-600 disabled:opacity-50 flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <h3 className={`text-base font-semibold ${isPurchased ? 'text-gray-500 dark:text-gray-500 line-through' : 'text-gray-900 dark:text-gray-100'}`}>
            {item.name}
          </h3>
          {isPurchased && (
            <span className="inline-flex items-center rounded-full bg-green-100 dark:bg-green-900/30 px-2 py-0.5 text-xs font-medium text-green-800 dark:text-green-300 mt-1">
              Purchased
            </span>
          )}
        </div>
      </div>

      {/* Item Details */}
      <div className="flex-1 space-y-2 text-sm">
        {item.quantity && (
          <div className="text-gray-700 dark:text-gray-300">
            <span className="font-medium">Qty:</span> {item.quantity}
          </div>
        )}
        {item.notes && (
          <p className="text-gray-600 dark:text-gray-400 text-sm">{item.notes}</p>
        )}
      </div>

      {/* Actions */}
      {!isPurchased && (
        <div className="flex gap-2 mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => onEdit(item)}
            className="flex-1 rounded-md bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 text-sm font-semibold text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => onRemove(item)}
            className="flex-1 rounded-md bg-red-50 dark:bg-red-900/30 px-3 py-1.5 text-sm font-semibold text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
          >
            Remove
          </button>
        </div>
      )}
    </div>
  );
}

