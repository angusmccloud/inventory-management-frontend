'use client';

import { useState, useEffect } from 'react';
import { Button, Input, Select, Card, Text } from '@/components/common';
import { InventoryItem, SuggestionType } from '@/types/entities';
import { listInventoryItems } from '@/lib/api/inventory';
import { useSnackbar } from '@/contexts/SnackbarContext';

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
  const { showSnackbar } = useSnackbar();

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
      showSnackbar({
        variant: 'info',
        text: 'Suggestion submitted successfully!',
      });
      onCancel?.();
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
          <Text variant="body" className="text-text-default">
            Suggest adding an existing item to the shopping list or propose a new item for
            inventory.
          </Text>
        </div>

        {/* Type Selection */}
        <div>
          <label htmlFor="type" className="mb-2 block text-sm font-medium">
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
            <label htmlFor="itemId" className="mb-2 block text-sm font-medium">
              Select Item <span className="text-error">*</span>
            </label>
            {isLoadingItems ? (
              <Text variant="body" className="text-text-secondary">
                Loading items...
              </Text>
            ) : inventoryItems.length === 0 ? (
              <Text variant="body" className="text-text-secondary">
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
              <label htmlFor="proposedItemName" className="mb-2 block text-sm font-medium">
                Item Name <span className="text-error">*</span>
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
                <label htmlFor="proposedQuantity" className="mb-2 block text-sm font-medium">
                  Quantity <span className="text-error">*</span>
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
                <label htmlFor="proposedThreshold" className="mb-2 block text-sm font-medium">
                  Low Stock Threshold <span className="text-error">*</span>
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
          <label htmlFor="notes" className="mb-2 block text-sm font-medium">
            Notes (Optional)
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={handleNotesChange}
            placeholder="Add any additional details..."
            className="w-full rounded-md border border-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary dark:border-border dark:bg-surface-elevated dark:text-white"
            rows={3}
            disabled={isSubmitting}
            maxLength={500}
          />
          <Text variant="caption" className="mt-1 text-text-secondary">
            {notes.length}/500 characters
          </Text>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-error/10/20 rounded-md border border-error p-3">
            <Text variant="body" className="text-error">
              {error}
            </Text>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3">
          {onCancel && (
            <Button variant="warning" onClick={onCancel} disabled={isSubmitting}>
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
