/**
 * ShoppingListItem Component
 * Feature: 002-shopping-lists
 * 
 * Displays a single shopping list item with checkbox to toggle purchased status.
 */

'use client';

import { ShoppingListItem } from '@/lib/api/shoppingList';
import { useState } from 'react';
import { Badge, Button, Checkbox } from '@/components/common';
import { Text } from '@/components/common/Text/Text';

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
    <div className={`bg-surface rounded-lg shadow-sm border ${isPurchased ? 'border-border bg-surface-elevated bg-surface' : 'border-border'} p-4 flex flex-col h-full`}>
      {/* Header with checkbox and status */}
      <div className="flex items-center gap-3 mb-2">
        <Checkbox
          label=""
          checked={isPurchased}
          onChange={handleToggle}
          disabled={isToggling}
          className="flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <h3 className={`text-base font-semibold ${isPurchased ? 'text-text-default line-through' : 'text-text-default'}`}>
            {item.name}{item.quantity ? ` (${item.quantity})` : ''}
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
        {item.inventoryNotes && (
          <div className="text-text-subtle text-xs italic border-l-2 border-border pl-2">
            {item.inventoryNotes}
          </div>
        )}
        {item.notes && (
          <Text variant="bodySmall" color="secondary">{item.notes}</Text>
        )}
      </div>

      {/* Actions */}
      {!isPurchased && isAdmin && (
        <div className="flex gap-2 mt-3">
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

