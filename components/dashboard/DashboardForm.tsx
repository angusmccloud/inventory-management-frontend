'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/common/Button/Button';
import { Input } from '@/components/common/Input/Input';
import { Alert } from '@/components/common/Alert/Alert';
import { Radio } from '@/components/common/Radio/Radio';
import { Checkbox } from '@/components/common/Checkbox/Checkbox';
import { Text } from '@/components/common/Text/Text';
import { 
  createDashboard, 
  getDashboard,
  updateDashboard 
} from '@/lib/api/dashboards';
import { 
  CreateDashboardInput, 
  DashboardType 
} from '@/types/dashboard';
import { listInventoryItems } from '@/lib/api/inventory';
import { listStorageLocations } from '@/lib/api/reference-data';
import { InventoryItem, StorageLocation } from '@/types/entities';

interface DashboardFormProps {
  familyId: string;
  dashboardId?: string; // If provided, edit mode
  onSuccess: (dashboardId: string, shareableUrl?: string) => void;
  onCancel: () => void;
}

export default function DashboardForm({ familyId, dashboardId, onSuccess, onCancel }: DashboardFormProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState<{
    name: string;
    type: DashboardType;
    locationIds: string[];
    itemIds: string[];
  }>({
    name: '',
    type: 'location',
    locationIds: [],
    itemIds: [],
  });

  // Data for selections
  const [locations, setLocations] = useState<StorageLocation[]>([]);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [itemSearchQuery, setItemSearchQuery] = useState<string>('');

  // Load dashboard data if editing
  useEffect(() => {
    if (dashboardId) {
      loadDashboardData();
    }
    loadLocationsAndItems();
  }, [dashboardId]);

  const loadDashboardData = async (): Promise<void> => {
    if (!dashboardId) return;
    
    try {
      setLoading(true);
      const dashboardData = await getDashboard(dashboardId);
      
      // Extract configuration based on dashboard type
      const locationIds = dashboardData.dashboard.type === 'location'
        ? Array.from(new Set(dashboardData.items.filter(item => item.locationId).map(item => item.locationId!)))
        : [];
      const itemIds = dashboardData.dashboard.type === 'items'
        ? dashboardData.items.map(item => item.itemId)
        : [];
      
      setFormData({
        name: dashboardData.dashboard.title,
        type: dashboardData.dashboard.type,
        locationIds,
        itemIds,
      });
    } catch (err) {
      console.error('Failed to load dashboard:', err);
      setError(err instanceof Error ? err.message : 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const loadLocationsAndItems = async (): Promise<void> => {
    try {
      const [locationsData, inventoryData] = await Promise.all([
        listStorageLocations(familyId),
        listInventoryItems(familyId),
      ]);
      setLocations(locationsData);
      setInventoryItems(inventoryData.items.filter((item: InventoryItem) => item.quantity > 0));
    } catch (err) {
      console.error('Failed to load locations and items:', err);
    }
  };

  const handleSubmit = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      // Validate form
      if (!formData.name.trim()) {
        setError('List name is required');
        return;
      }

      if (formData.name.length > 100) {
        setError('List name must be 100 characters or less');
        return;
      }

      if (formData.type === 'location' && formData.locationIds.length === 0) {
        setError('Please select at least one location');
        return;
      }

      if (formData.type === 'items' && formData.itemIds.length === 0) {
        setError('Please select at least one item');
        return;
      }

      if (dashboardId) {
        // Update existing dashboard
        await updateDashboard({
          dashboardId,
          title: formData.name.trim(),
          locationIds: formData.type === 'location' ? formData.locationIds : undefined,
          itemIds: formData.type === 'items' ? formData.itemIds : undefined,
        });
        
        onSuccess(dashboardId);
      } else {
        // Create new dashboard
        const input: CreateDashboardInput = {
          title: formData.name.trim(),
          type: formData.type,
          locationIds: formData.type === 'location' ? formData.locationIds : undefined,
          itemIds: formData.type === 'items' ? formData.itemIds : undefined,
        };

        const result = await createDashboard(input);
        const shareableUrl = `${window.location.origin}/d/${result.dashboard.dashboardId}`;
        
        onSuccess(result.dashboard.dashboardId, shareableUrl);
      }
    } catch (err) {
      console.error(`Failed to ${dashboardId ? 'update' : 'create'} dashboard:`, err);
      setError(err instanceof Error ? err.message : `Failed to ${dashboardId ? 'update' : 'create'} dashboard`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && <Alert severity="error">{error}</Alert>}

      <Input
        label="List Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        placeholder="e.g., Kitchen Inventory"
        helpText="Give your list a descriptive name (1-100 characters)"
        required
      />

      {/* List Type Selection */}
      <Radio
        name="dashboardType"
        label="List Type"
        value={formData.type}
        onChange={(value) => setFormData({ ...formData, type: value as DashboardType, locationIds: [], itemIds: [] })}
        options={[
          {
            value: 'location',
            label: 'Location-based',
            description: 'Show all items in selected locations',
          },
          {
            value: 'items',
            label: 'Item-based',
            description: 'Select specific items',
          },
        ]}
      />

      {/* Location Selection */}
      {formData.type === 'location' && (
        <div className="pt-4 border-t border-border">
          <label className="block text-sm font-medium text-text-primary mb-2">
            Select Locations
          </label>
          <div className="space-y-2 max-h-60 overflow-y-auto border border-border rounded-md p-3 bg-surface">
            {locations.length === 0 ? (
              <Text variant="bodySmall" color="tertiary">No locations available</Text>
            ) : (
              locations.map((location) => (
                <Checkbox
                  key={location.locationId}
                  label={location.name}
                  checked={formData.locationIds.includes(location.locationId)}
                  onChange={(checked) => {
                    if (checked) {
                      setFormData({
                        ...formData,
                        locationIds: [...formData.locationIds, location.locationId],
                      });
                    } else {
                      setFormData({
                        ...formData,
                        locationIds: formData.locationIds.filter((id) => id !== location.locationId),
                      });
                    }
                  }}
                />
              ))
            )}
          </div>
          <Text variant="caption" color="tertiary" className="mt-1">
            {formData.locationIds.length} location{formData.locationIds.length !== 1 ? 's' : ''} selected
          </Text>
        </div>
      )}

      {/* Item Selection */}
      {formData.type === 'items' && (
        <div className="pt-4 border-t border-border">
          <label className="block text-sm font-medium text-text-primary mb-2">
            Select Items
          </label>
          
          <Input
            placeholder="Search items..."
            value={itemSearchQuery}
            onChange={(e) => setItemSearchQuery(e.target.value)}
            className="mb-3"
          />

          <div className="space-y-2 max-h-96 overflow-y-auto border border-border rounded-md p-3 bg-surface">
            {inventoryItems.length === 0 ? (
              <Text variant="bodySmall" color="tertiary">No items available</Text>
            ) : (
              inventoryItems
                .filter((item) =>
                  itemSearchQuery.length === 0 ||
                  item.name.toLowerCase().includes(itemSearchQuery.toLowerCase()) ||
                  item.locationName?.toLowerCase().includes(itemSearchQuery.toLowerCase())
                )
                .map((item) => (
                  <Checkbox
                    key={item.itemId}
                    label={item.name}
                    description={item.locationName ? `📍 ${item.locationName}` : undefined}
                    checked={formData.itemIds.includes(item.itemId)}
                    onChange={(checked) => {
                      if (checked) {
                        setFormData({
                          ...formData,
                          itemIds: [...formData.itemIds, item.itemId],
                        });
                      } else {
                        setFormData({
                          ...formData,
                          itemIds: formData.itemIds.filter((id) => id !== item.itemId),
                        });
                      }
                    }}
                  />
                ))
            )}
          </div>
          <Text variant="caption" color="tertiary" className="mt-1">
            {formData.itemIds.length} item{formData.itemIds.length !== 1 ? 's' : ''} selected
          </Text>
        </div>
      )}

      <div className="flex gap-2 pt-4">
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={
            loading ||
            !formData.name.trim() ||
            (formData.type === 'location' && formData.locationIds.length === 0) ||
            (formData.type === 'items' && formData.itemIds.length === 0)
          }
        >
          {loading ? (dashboardId ? 'Updating...' : 'Creating...') : (dashboardId ? 'Update List' : 'Create List')}
        </Button>
        <Button variant="secondary" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
