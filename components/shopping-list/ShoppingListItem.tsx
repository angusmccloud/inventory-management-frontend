/**
 * ShoppingListItem Component
 * Feature: 002-shopping-lists
 * 
 * Displays a single shopping list item with checkbox to toggle purchased status.
 */

'use client';

import { ShoppingListItem } from '@/lib/api/shoppingList';
import { useState } from 'react';
import { Badge, Button } from '@/components/common';

interface ShoppingListItemProps {
  item: ShoppingListItem;
  onToggleStatus: (item: ShoppingListItem) => Promise<void>;
  onEdit: (item: ShoppingListItem) => void;
  onRemove: (item: ShoppingListItem) => void;
  isAdmin?: boolean;
}

export default function ShoppingListItemComponent({
  item,
  onToggleStatus,
  onEdit,
  onRemove,
  isAdmin = true,
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
    <div className={`bg-surface rounded-lg shadow-sm border ${isPurchased ? 'border-border bg-gray-50 bg-surface' : 'border-border'} p-4 flex flex-col h-full`}>
      {/* Header with checkbox and status */}
      <div className="flex items-start gap-3 mb-3">
        <input
          type="checkbox"
          checked={isPurchased}
          onChange={handleToggle}
          disabled={isToggling}
          className="mt-1 h-5 w-5 rounded border-border text-blue-600 focus:ring-primary disabled:opacity-50 flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <h3 className={`text-base font-semibold ${isPurchased ? 'text-gray-500 dark:text-gray-500 line-through' : 'text-text-default'}`}>
            {item.name}
          </h3>
          {isPurchased && (
            <Badge variant="success" size="sm" className="mt-1">
              Purchased
            </Badge>
          )}
        </div>
      </div>

      {/* Item Details */}
      <div className="flex-1 space-y-2 text-sm">
        {item.quantity && (
          <div className="text-text-default">
            <span className="font-medium">Qty:</span> {item.quantity}
          </div>
        )}
        {item.notes && (
          <p className="text-text-secondary text-sm">{item.notes}</p>
        )}
      </div>

      {/* Actions */}
      {!isPurchased && isAdmin && (
        <div className="flex gap-2 mt-4 pt-3 border-t border-border">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onEdit(item)}
            className="flex-1"
          >
            Edit
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => onRemove(item)}
            className="flex-1"
          >
            Remove
          </Button>
        </div>
      )}
    </div>
  );
}

