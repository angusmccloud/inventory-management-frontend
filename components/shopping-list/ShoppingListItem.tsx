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
    <li className={`px-4 py-4 sm:px-6 ${isPurchased ? 'bg-gray-50' : ''}`}>
      <div className="flex items-center gap-4">
        {/* Checkbox */}
        <input
          type="checkbox"
          checked={isPurchased}
          onChange={handleToggle}
          disabled={isToggling}
          className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-600 disabled:opacity-50"
        />

        {/* Item Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className={`text-lg font-medium truncate ${isPurchased ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
              {item.name}
            </h3>
            {isPurchased && (
              <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                Purchased
              </span>
            )}
          </div>
          
          <div className="mt-2 flex flex-col sm:flex-row sm:gap-4 text-sm text-gray-500">
            {item.quantity && (
              <div>
                <span className="font-semibold text-gray-900">Quantity:</span>{' '}
                {item.quantity}
              </div>
            )}
            {item.storeName && (
              <div>
                <span className="font-semibold text-gray-900">Store:</span>{' '}
                {item.storeName}
              </div>
            )}
            {!item.storeName && (
              <div>
                <span className="text-gray-400 italic">Unassigned</span>
              </div>
            )}
          </div>
          
          {item.notes && (
            <p className="mt-2 text-sm text-gray-600">{item.notes}</p>
          )}
        </div>

        {/* Actions */}
        {!isPurchased && (
          <div className="ml-4 flex flex-shrink-0 gap-2">
            <button
              onClick={() => onEdit(item)}
              className="rounded-md bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100"
            >
              Edit
            </button>
            <button
              onClick={() => onRemove(item)}
              className="rounded-md bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-100"
            >
              Remove
            </button>
          </div>
        )}
      </div>
    </li>
  );
}

