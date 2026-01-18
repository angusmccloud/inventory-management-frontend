/**
 * ShoppingListItem Component
 * Feature: 002-shopping-lists
 *
 * Displays a single shopping list item with checkbox to toggle purchased status.
 */

'use client';

import { ShoppingListItem } from '@/lib/api/shoppingList';
import { useState } from 'react';
import { TrashIcon, CheckCircleIcon } from '@heroicons/react/24/solid';
import { CheckCircleIcon as CheckCircleOutlineIcon } from '@heroicons/react/24/outline';
import { Badge, Button } from '@/components/common';
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
      className={`rounded-lg border bg-surface shadow-sm ${isPurchased ? 'border-border bg-surface bg-surface-elevated' : 'border-border'} h-auto cursor-pointer self-start p-4 transition-colors hover:bg-surface-elevated`}
      onClick={handleToggle}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleToggle();
        }
      }}
      aria-label={isPurchased ? 'Mark as not purchased' : 'Mark as purchased'}
      aria-disabled={isToggling}
    >
      <div className="flex items-center">
        {/* Status Icon */}
        <div className="mr-3 flex-shrink-0">
          {isPurchased ? (
            <CheckCircleIcon className="h-6 w-6 text-success" />
          ) : (
            <CheckCircleOutlineIcon className="h-6 w-6 text-text-subtle" />
          )}
        </div>

        {/* Content Section */}
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

          {/* Item Details */}
          {(item.inventoryNotes || item.notes) && (
            <div className="mt-2 space-y-1 text-sm">
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

        {/* Actions - Edit/Remove for unpurchased, Badge for purchased */}
        {isPurchased ? (
          <div className="ml-4 flex-shrink-0">
            <Badge variant="success" size="sm">
              Purchased
            </Badge>
          </div>
        ) : (
          isAdmin && (
            <div className="ml-4 flex flex-shrink-0 space-x-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(item);
                }}
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
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(item);
                }}
                leftIcon={<TrashIcon className="h-4 w-4" />}
                responsiveText={{ showAt: 'md' }}
                aria-label="Remove item"
                title="Remove item"
              >
                Remove
              </Button>
            </div>
          )
        )}
      </div>
    </div>
  );
}
