/**
 * ShoppingListItem Component
 * Feature: 002-shopping-lists
 *
 * Displays a single shopping list item with checkbox to toggle purchased status.
 */

'use client';

import { ShoppingListItem } from '@/lib/api/shoppingList';
import { useState } from 'react';
import { TrashIcon } from '@heroicons/react/24/outline';
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
    <div
      className={`rounded-lg border bg-surface shadow-sm ${isPurchased ? 'border-border bg-surface bg-surface-elevated' : 'border-border'} h-auto self-start p-4`}
    >
      <div className="flex items-center">
        {/* Content Section */}
        <div className="min-w-0 flex-1">
          {/* Header with checkbox and status */}
          <div className="flex items-center gap-3">
            <Checkbox
              label=""
              checked={isPurchased}
              onChange={handleToggle}
              disabled={isToggling}
              className="flex-shrink-0"
            />
            <div className="min-w-0 flex-1">
              <h3
                className={`text-base font-semibold ${isPurchased ? 'text-text-default line-through' : 'text-text-default'}`}
              >
                {item.name}
                {item.quantity && (
                  <span className="text-text-subtle">
                    {' '}
                    ({item.quantity}
                    {item.unit ? ` ${item.unit}` : ''})
                  </span>
                )}
              </h3>
              {isPurchased && (
                <Badge variant="success" size="sm" className="mt-1">
                  Purchased
                </Badge>
              )}
            </div>
          </div>

          {/* Item Details */}
          {(item.inventoryNotes || item.notes) && (
            <div className="mt-2 space-y-2 text-sm">
              {item.inventoryNotes && (
                <div className="text-text-subtle border-l-2 border-border pl-2 text-xs italic">
                  {item.inventoryNotes}
                </div>
              )}
              {item.notes && (
                <Text variant="bodySmall" color="secondary">
                  {item.notes}
                </Text>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        {!isPurchased && isAdmin && (
          <div className="ml-4 flex flex-shrink-0 space-x-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onEdit(item)}
              leftIcon={
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              }
              responsiveText={{ showAt: 'md' }}
              aria-label="Edit item"
              title="Edit item"
            >
              Edit
            </Button>
            <Button
              variant="warning"
              size="sm"
              onClick={() => onRemove(item)}
              leftIcon={<TrashIcon className="h-4 w-4" />}
              responsiveText={{ showAt: 'md' }}
              aria-label="Remove item"
              title="Remove item"
            >
              Remove
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
