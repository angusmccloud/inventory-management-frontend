'use client';

import { useState, useEffect } from 'react';
import { Button, Input, Select, Card, Text } from '@/components/common';
import { InventoryItem, SuggestionType } from '@/types/entities';
import { listInventoryItems } from '@/lib/api/inventory';

interface SuggestionFormProps {
  familyId: string;
  onSubmit: (data: SuggestionFormData) => Promise<void>;
  onCancel?: () => void;
  isSubmitting?: boolean;
  prefilledItemId?: string;
  prefilledItemName?: string;
}

export type SuggestionFormData =
  | {
      type: 'add_to_shopping';
      itemId: string;
      notes?: string;
    }
  | {
      type: 'create_item';
      proposedItemName: string;
      proposedQuantity: number;
      proposedThreshold: number;
      notes?: string;
    };

export function SuggestionForm({
  familyId,
  onSubmit,
  onCancel,
  isSubmitting = false,
  prefilledItemId,
  prefilledItemName: _prefilledItemName,
}: SuggestionFormProps) {
  const [type, setType] = useState<SuggestionType>('add_to_shopping');
  const [itemId, setItemId] = useState(prefilledItemId || '');
  const [proposedItemName, setProposedItemName] = useState('');
  const [proposedQuantity, setProposedQuantity] = useState(1);
  const [proposedThreshold, setProposedThreshold] = useState(1);
  const [notes, setNotes] = useState('');
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [isLoadingItems, setIsLoadingItems] = useState(false);
  const [error, setError] = useState('');

  // Set prefilled item ID when provided
  useEffect(() => {
    if (prefilledItemId) {
      setItemId(prefilledItemId);
      setType('add_to_shopping');
    }
  }, [prefilledItemId]);

  // Load inventory items for add_to_shopping type
  useEffect(() => {
    if (type === 'add_to_shopping') {
      loadInventoryItems();
    }
  }, [type, familyId]);

  const loadInventoryItems = async () => {
    try {
      setIsLoadingItems(true);
      setError('');
      const response = await listInventoryItems(familyId);
      setInventoryItems(response.items);
    } catch (err) {
      setError('Failed to load inventory items');
      console.error('Error loading inventory items:', err);
    } finally {
      setIsLoadingItems(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (type === 'add_to_shopping') {
        if (!itemId) {
          setError('Please select an item');
          return;
        }
        await onSubmit({
          type: 'add_to_shopping',
          itemId,
          notes: notes || undefined,
        });
      } else {
        if (!proposedItemName.trim()) {
          setError('Please enter an item name');
          return;
        }
        if (proposedQuantity < 0) {
          setError('Quantity must be non-negative');
          return;
        }
        if (proposedThreshold < 0) {
          setError('Threshold must be non-negative');
          return;
        }
        await onSubmit({
          type: 'create_item',
          proposedItemName: proposedItemName.trim(),
          proposedQuantity,
          proposedThreshold,
          notes: notes || undefined,
        });
      }
    } catch (err) {
      setError((err as Error).message || 'Failed to create suggestion');
    }
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= 500) {
      setNotes(value);
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Text variant="h3" className="mb-4">
            Create Suggestion
          </Text>
          <Text variant="body" className="text-gray-600 dark:text-gray-400">
            Suggest adding an existing item to the shopping list or propose a new item for inventory.
          </Text>
        </div>

        {/* Type Selection */}
        <div>
          <label htmlFor="type" className="block text-sm font-medium mb-2">
            Suggestion Type
          </label>
          <Select
            id="type"
            value={type}
            onChange={(value) => setType(value as SuggestionType)}
            disabled={isSubmitting}
          >
            <option value="add_to_shopping">Add to Shopping List</option>
            <option value="create_item">Create New Item</option>
          </Select>
        </div>

        {/* Add to Shopping - Item Selection */}
        {type === 'add_to_shopping' && (
          <div>
            <label htmlFor="itemId" className="block text-sm font-medium mb-2">
              Select Item <span className="text-red-500">*</span>
            </label>
            {isLoadingItems ? (
              <Text variant="body" className="text-gray-500">
                Loading items...
              </Text>
            ) : inventoryItems.length === 0 ? (
              <Text variant="body" className="text-gray-500">
                No items available
              </Text>
            ) : (
              <Select
                id="itemId"
                value={itemId}
                onChange={(value) => setItemId(value)}
                disabled={isSubmitting}
                required
              >
                <option value="">Choose an item...</option>
                {inventoryItems.map((item) => (
                  <option key={item.itemId} value={item.itemId}>
                    {item.name} (Current: {item.quantity} {item.unit || 'units'})
                  </option>
                ))}
              </Select>
            )}
          </div>
        )}

        {/* Create Item Fields */}
        {type === 'create_item' && (
          <>
            <div>
              <label htmlFor="proposedItemName" className="block text-sm font-medium mb-2">
                Item Name <span className="text-red-500">*</span>
              </label>
              <Input
                id="proposedItemName"
                type="text"
                value={proposedItemName}
                onChange={(e) => setProposedItemName(e.target.value)}
                placeholder="e.g., Milk"
                maxLength={100}
                disabled={isSubmitting}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="proposedQuantity" className="block text-sm font-medium mb-2">
                  Quantity <span className="text-red-500">*</span>
                </label>
                <Input
                  id="proposedQuantity"
                  type="number"
                  value={proposedQuantity}
                  onChange={(e) => setProposedQuantity(parseInt(e.target.value) || 0)}
                  min="0"
                  disabled={isSubmitting}
                  required
                />
              </div>

              <div>
                <label htmlFor="proposedThreshold" className="block text-sm font-medium mb-2">
                  Low Stock Threshold <span className="text-red-500">*</span>
                </label>
                <Input
                  id="proposedThreshold"
                  type="number"
                  value={proposedThreshold}
                  onChange={(e) => setProposedThreshold(parseInt(e.target.value) || 0)}
                  min="0"
                  disabled={isSubmitting}
                  required
                />
              </div>
            </div>
          </>
        )}

        {/* Optional Notes */}
        <div>
          <label htmlFor="notes" className="block text-sm font-medium mb-2">
            Notes (Optional)
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={handleNotesChange}
            placeholder="Add any additional details..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            rows={3}
            disabled={isSubmitting}
            maxLength={500}
          />
          <Text variant="caption" className="text-gray-500 mt-1">
            {notes.length}/500 characters
          </Text>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
            <Text variant="body" className="text-red-600 dark:text-red-400">
              {error}
            </Text>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          {onCancel && (
            <Button variant="secondary" onClick={onCancel} disabled={isSubmitting}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Create Suggestion'}
          </Button>
        </div>
      </form>
    </Card>
  );
}
