/**
 * EditItemForm Component
 * 
 * Form for editing an existing inventory item.
 */

'use client';

import { useState, useEffect, FormEvent } from 'react';
import { updateInventoryItem } from '@/lib/api/inventory';
import { listStorageLocations, listStores } from '@/lib/api/reference-data';
import { InventoryItem, UpdateInventoryItemRequest, StorageLocation, Store } from '@/types/entities';
import { Input, Select, Button, Text } from '@/components/common';
import { ArchiveBoxIcon } from '@heroicons/react/24/outline';
import { Modal } from '@/components/common';
import { archiveInventoryItem } from '@/lib/api/inventory';
import type { SelectOption } from '@/components/common';

interface EditItemFormProps {
  familyId: string;
  item: InventoryItem;
  onSuccess: (item: InventoryItem) => void;
  onCancel?: () => void;
  onArchive?: (item: InventoryItem) => Promise<InventoryItem | void> | void;
}

export default function EditItemForm({
  familyId,
  item,
  onSuccess,
  onCancel,
  onArchive,
}: EditItemFormProps) {
  const [formData, setFormData] = useState<UpdateInventoryItemRequest>({
    name: item.name,
    quantity: item.quantity,
    unit: item.unit || '',
    locationId: item.locationId || '',
    preferredStoreId: item.preferredStoreId || '',
    lowStockThreshold: item.lowStockThreshold,
    notes: item.notes || '',
    status: item.status,
  });
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [locations, setLocations] = useState<StorageLocation[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [loadingReferenceData, setLoadingReferenceData] = useState<boolean>(true);
  const [showArchiveConfirm, setShowArchiveConfirm] = useState<boolean>(false);
  const [archiving, setArchiving] = useState<boolean>(false);
  const [archiveError, setArchiveError] = useState<string>('');

  // Load storage locations and stores
  useEffect(() => {
    const loadReferenceData = async () => {
      try {
        const [locationsData, storesData] = await Promise.all([
          listStorageLocations(familyId),
          listStores(familyId),
        ]);
        setLocations(locationsData);
        setStores(storesData);
      } catch (err) {
        console.error('Failed to load reference data:', err);
        // Continue with empty lists - forms will still work
      } finally {
        setLoadingReferenceData(false);
      }
    };

    loadReferenceData();
  }, [familyId]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    if (!formData.name?.trim()) {
      setError('Item name is required');
      return;
    }
    
    setError('');
    setLoading(true);

    try {
      const updatedItem = await updateInventoryItem(familyId, item.itemId, {
        ...formData,
        name: formData.name?.trim(),
        unit: formData.unit?.trim() || undefined,
        locationId: formData.locationId || undefined,
        preferredStoreId: formData.preferredStoreId || undefined,
        notes: formData.notes?.trim() || undefined,
      });
      onSuccess(updatedItem);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update item');
    } finally {
      setLoading(false);
    }
  };

  // Convert locations and stores to SelectOption format
  const locationOptions: SelectOption[] = locations.map((loc) => ({
    label: loc.name,
    value: loc.locationId,
  }));

  const storeOptions: SelectOption[] = stores
    .map((store) => ({
      label: store.name,
      value: store.storeId,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Input
            id="item-name"
            label="Item Name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            disabled={loading}
          />
        </div>

        <div>
          <Input
            id="quantity"
            label="Quantity"
            type="number"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
            min={0}
            required
            disabled={loading}
          />
        </div>

        <div>
          <Input
            id="unit"
            label="Unit"
            type="text"
            value={formData.unit}
            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
            disabled={loading}
          />
        </div>

        <div>
          <Input
            id="threshold"
            label="Low Stock Threshold"
            type="number"
            value={formData.lowStockThreshold}
            onChange={(e) => setFormData({ ...formData, lowStockThreshold: Number(e.target.value) })}
            min={0}
            required
            disabled={loading}
          />
        </div>

        <div>
          <Select
            id="location"
            label="Storage Location"
            options={locationOptions}
            value={formData.locationId}
            onChange={(value) => setFormData({ ...formData, locationId: value })}
            placeholder="Select a location"
            disabled={loading || loadingReferenceData}
            helpText={
              !loadingReferenceData && locations.length === 0
                ? 'No locations available. Add them in Settings.'
                : undefined
            }
          />
        </div>

        <div>
          <Select
            id="store"
            label="Preferred Store"
            options={storeOptions}
            value={formData.preferredStoreId}
            onChange={(value) => setFormData({ ...formData, preferredStoreId: value })}
            placeholder="Select a store"
            disabled={loading || loadingReferenceData}
            helpText={
              !loadingReferenceData && stores.length === 0
                ? 'No stores available. Add them in Settings.'
                : undefined
            }
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="notes" className="block text-sm font-medium text-text-default">
            Notes
          </label>
          <textarea
            id="notes"
            rows={3}
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="mt-1 block w-full rounded-md border-0 px-3 py-2 text-text-default dark:bg-surface-elevated ring-1 ring-inset ring-border placeholder:text-text-secondary dark:placeholder:text-text-secondary focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm"
            disabled={loading}
          />
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-error/10 p-4">
          <Text variant="bodySmall" color="error">{error}</Text>
        </div>
      )}

      <div className="flex gap-3">
        <Button
          type="submit"
          variant="primary"
          disabled={loading}
          loading={loading}
          className="flex-1"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
        {onArchive && item.status === 'active' && (
          <Button
            type="button"
            variant="warning"
            onClick={() => setShowArchiveConfirm(true)}
            disabled={loading || archiving}
            leftIcon={<ArchiveBoxIcon className="h-4 w-4" />}
          >
            Archive
          </Button>
        )}
        {onCancel && (
          <Button
            type="button"
            variant="warning"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
        )}
      </div>

      {/* Archive confirmation modal */}
      {onArchive && (
        <Modal
          isOpen={showArchiveConfirm}
          onClose={() => setShowArchiveConfirm(false)}
          title={`Archive ${item.name}?`}
          size="sm"
        >
          <div className="space-y-4">
            <Text variant="body">Are you sure you want to archive this item? This action can be reversed in Settings.</Text>
            {archiveError && (
              <div className="rounded-md bg-error/10 p-2">
                <Text variant="bodySmall" color="error">{archiveError}</Text>
              </div>
            )}
            <div className="flex justify-end gap-3">
              <Button variant="tertiary" onClick={() => setShowArchiveConfirm(false)} disabled={archiving}>
                Cancel
              </Button>
              <Button
                variant="warning"
                  onClick={async () => {
                    setArchiveError('');
                    setArchiving(true);
                    try {
                      // Follow the exact flow used on the inventory page: call the archive endpoint
                      const res = await archiveInventoryItem(familyId, item.itemId);
                      if (res && res.itemId) {
                        onSuccess(res as InventoryItem);
                      }
                      setShowArchiveConfirm(false);
                    } catch (err) {
                      setArchiveError(err instanceof Error ? err.message : 'Failed to archive item');
                    } finally {
                      setArchiving(false);
                    }
                  }}
                disabled={archiving}
              >
                {archiving ? 'Archiving...' : 'Archive'}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </form>
  );
}
