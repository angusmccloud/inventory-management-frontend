'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/common/Card/Card';
import { Button } from '@/components/common/Button/Button';
import { Input } from '@/components/common/Input/Input';
import { Alert } from '@/components/common/Alert/Alert';
import { Radio } from '@/components/common/Radio/Radio';
import { Checkbox } from '@/components/common/Checkbox/Checkbox';
import { Text } from '@/components/common/Text/Text';
import { 
  listDashboards, 
  createDashboard, 
  deleteDashboard, 
  rotateDashboard 
} from '@/lib/api/dashboards';
import { 
  DashboardListItem, 
  CreateDashboardInput, 
  DashboardType 
} from '@/types/dashboard';
import { listInventoryItems } from '@/lib/api/inventory';
import { listStorageLocations } from '@/lib/api/reference-data';
import { InventoryItem, StorageLocation } from '@/types/entities';

interface DashboardManagerProps {
  familyId: string;
}

export default function DashboardManager({ familyId }: DashboardManagerProps) {
  const [view, setView] = useState<'list' | 'create' | 'edit'>('list');
  // @ts-ignore - dashboards is used in renderListView  
  const [dashboards, setDashboards] = useState<DashboardListItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form state for dashboard creation/editing
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    type: DashboardType;
    locationIds: string[];
    itemIds: string[];
  }>({
    name: '',
    description: '',
    type: 'location',
    locationIds: [],
    itemIds: [],
  });

  const [newDashboardUrl, setNewDashboardUrl] = useState<string | null>(null);
  
  // Data for selections
  const [locations, setLocations] = useState<StorageLocation[]>([]);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [itemSearchQuery, setItemSearchQuery] = useState<string>('');

  // Load dashboards on component mount
  useEffect(() => {
    if (view === 'list') {
      loadDashboards();
    }
  }, [view]);

  // Load locations and inventory for selections
  useEffect(() => {
    if (view === 'create') {
      loadLocationsAndItems();
    }
  }, [view]);

  const loadLocationsAndItems = async (): Promise<void> => {
    try {
      const [locationsData, inventoryData] = await Promise.all([
        listStorageLocations(familyId),
        listInventoryItems(familyId),
      ]);
      setLocations(locationsData);
      setInventoryItems(inventoryData.items.filter((item: InventoryItem) => item.quantity > 0)); // Only show items with stock
    } catch (err) {
      console.error('Failed to load locations and items:', err);
    }
  };

  const loadDashboards = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const data = await listDashboards(false); // exclude inactive
      
      // Sort dashboards by name ascending (T081)
      const sortedData = data.sort((a, b) => a.title.localeCompare(b.title));
      
      setDashboards(sortedData);
    } catch (err) {
      console.error('Failed to load dashboards:', err);
      setError(err instanceof Error ? err.message : 'Failed to load dashboards');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDashboard = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      setSuccessMessage(null);

      // Validate form
      if (!formData.name.trim()) {
        setError('Dashboard name is required');
        return;
      }

      if (formData.name.length > 100) {
        setError('Dashboard name must be 100 characters or less');
        return;
      }

      if (formData.type === 'location' && formData.locationIds.length === 0) {
        setError('Please select at least one location');
        return;
      }

      if (formData.type === 'location' && formData.locationIds.length > 10) {
        setError('You can select up to 10 locations');
        return;
      }

      if (formData.type === 'items' && formData.itemIds.length === 0) {
        setError('Please select at least one item');
        return;
      }

      if (formData.type === 'items' && formData.itemIds.length > 100) {
        setError('You can select up to 100 items');
        return;
      }

      const input: CreateDashboardInput = {
        title: formData.name.trim(),
        type: formData.type,
        locationIds: formData.type === 'location' ? formData.locationIds : undefined,
        itemIds: formData.type === 'items' ? formData.itemIds : undefined,
      };

      const result = await createDashboard(input);

      // Generate shareable URL
      const shareableUrl = `${window.location.origin}/d/${result.dashboardId}`;
      setNewDashboardUrl(shareableUrl);
      setSuccessMessage('Dashboard created successfully!');

      // Reset form
      setFormData({
        name: '',
        description: '',
        type: 'location',
        locationIds: [],
        itemIds: [],
      });
    } catch (err) {
      console.error('Failed to create dashboard:', err);
      setError(err instanceof Error ? err.message : 'Failed to create dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyUrl = async (url: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(url);
      setSuccessMessage('URL copied to clipboard!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Failed to copy URL:', err);
      setError('Failed to copy URL to clipboard');
    }
  };

  // @ts-ignore - handleDeleteDashboard is used in renderListView
  const handleDeleteDashboard = async (dashboardId: string): Promise<void> => {
    if (!confirm('Are you sure you want to delete this dashboard?')) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await deleteDashboard(dashboardId);
      setSuccessMessage('Dashboard deleted successfully');
      await loadDashboards();
    } catch (err) {
      console.error('Failed to delete dashboard:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete dashboard');
    } finally {
      setLoading(false);
    }
  };

  // @ts-ignore - handleRotateUrl is used in renderListView  
  const handleRotateUrl = async (dashboardId: string): Promise<void> => {
    if (!confirm('This will deactivate the current URL and generate a new one. Continue?')) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await rotateDashboard(dashboardId);
      const newUrl = `${window.location.origin}/d/${result.newDashboardId}`;
      setSuccessMessage(`URL rotated successfully! New URL: ${newUrl}`);
      await loadDashboards();
    } catch (err) {
      console.error('Failed to rotate URL:', err);
      setError(err instanceof Error ? err.message : 'Failed to rotate URL');
    } finally {
      setLoading(false);
    }
  };

  // Render create form view
  const renderCreateForm = (): React.ReactElement => (
    <>
      <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-text-primary">Create New Dashboard</h2>
        <Button variant="secondary" onClick={() => setView('list')}>
          Cancel
        </Button>
      </div>

      {error && <Alert severity="error">{error}</Alert>}
      {successMessage && <Alert severity="success">{successMessage}</Alert>}

      {newDashboardUrl && (
        <Card elevation="medium" padding="lg">
          <h3 className="text-lg font-semibold text-text-primary mb-2">
            Dashboard Created Successfully!
          </h3>
          <Text variant="body" color="secondary" className="mb-4">
            Share this URL to give others access to the dashboard:
          </Text>
          <div className="flex gap-2">
            <Input
              value={newDashboardUrl}
              onChange={() => {}}
              readOnly
              className="flex-1"
            />
            <Button variant="primary" onClick={() => handleCopyUrl(newDashboardUrl)}>
              Copy URL
            </Button>
          </div>
          <div className="mt-4">
            <Button variant="secondary" onClick={() => {
              setNewDashboardUrl(null);
              setView('list');
            }}>
              Create Another Dashboard
            </Button>
          </div>
        </Card>
      )}

      {!newDashboardUrl && (
        <Card elevation="low" padding="lg">
          <div className="space-y-4">
            <Input
              label="Dashboard Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Kitchen Inventory"
              helpText="Give your dashboard a descriptive name (1-100 characters)"
              required
            />

            {/* Dashboard Type Selection */}
            <Radio
              name="dashboardType"
              label="Dashboard Type"
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
                  Select Locations (1-10)
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
                            if (formData.locationIds.length < 10) {
                              setFormData({
                                ...formData,
                                locationIds: [...formData.locationIds, location.locationId],
                              });
                            }
                          } else {
                            setFormData({
                              ...formData,
                              locationIds: formData.locationIds.filter((id) => id !== location.locationId),
                            });
                          }
                        }}
                        disabled={!formData.locationIds.includes(location.locationId) && formData.locationIds.length >= 10}
                      />
                    ))
                  )}
                </div>
                <Text variant="caption" color="tertiary" className="mt-1">
                  {formData.locationIds.length} of 10 locations selected
                </Text>
              </div>
            )}

            {/* Item Selection */}
            {formData.type === 'items' && (
              <div className="pt-4 border-t border-border">
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Select Items (1-100)
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
                          description={`${item.locationName ? `📍 ${item.locationName}` : ''}${item.quantity ? ` • ${item.quantity} ${item.unit || 'units'}` : ''}`}
                          checked={formData.itemIds.includes(item.itemId)}
                          onChange={(checked) => {
                            if (checked) {
                              if (formData.itemIds.length < 100) {
                                setFormData({
                                  ...formData,
                                  itemIds: [...formData.itemIds, item.itemId],
                                });
                              }
                            } else {
                              setFormData({
                                ...formData,
                                itemIds: formData.itemIds.filter((id) => id !== item.itemId),
                              });
                            }
                          }}
                          disabled={!formData.itemIds.includes(item.itemId) && formData.itemIds.length >= 100}
                        />
                      ))
                  )}
                </div>
                <Text variant="caption" color="tertiary" className="mt-1">
                  {formData.itemIds.length} of 100 items selected
                </Text>
              </div>
            )}

            <div className="flex gap-2">
              <Button
                variant="primary"
                onClick={handleCreateDashboard}
                disabled={
                  loading ||
                  !formData.name.trim() ||
                  (formData.type === 'location' && formData.locationIds.length === 0) ||
                  (formData.type === 'items' && formData.itemIds.length === 0)
                }
              >
                {loading ? 'Creating...' : 'Create Dashboard'}
              </Button>
              <Button variant="secondary" onClick={() => setView('list')}>
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
    </>
  );

  // Render dashboard list view
  const renderListView = (): React.ReactElement => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-text-primary">My Dashboards</h2>
        <Button variant="primary" onClick={() => setView('create')}>
          Create New Dashboard
        </Button>
      </div>

      {error && <Alert severity="error">{error}</Alert>}
      {successMessage && <Alert severity="success">{successMessage}</Alert>}

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <Text variant="body" color="secondary" className="mt-2">Loading dashboards...</Text>
        </div>
      ) : dashboards.length === 0 ? (
        <Card elevation="low" padding="lg">
          <div className="text-center py-8">
            <Text variant="body" color="secondary" className="mb-4">
              You haven't created any dashboards yet.
            </Text>
            <Button variant="primary" onClick={() => setView('create')}>
              Create Your First Dashboard
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dashboards.map((dashboard) => (
            <Card key={dashboard.dashboardId} elevation="low" padding="md" interactive>
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                {dashboard.title}
              </h3>
              <div className="text-xs text-text-tertiary mb-3">
                <Text variant="caption" color="tertiary">Type: {dashboard.type === 'location' ? 'Location-based' : 'Item-based'}</Text>
                <Text variant="caption" color="tertiary">Created: {new Date(dashboard.createdAt).toLocaleDateString()}</Text>
                <Text variant="caption" color="tertiary">Accessed: {dashboard.accessCount} times</Text>
              </div>
              <div className="flex flex-col gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleCopyUrl(`${window.location.origin}/d/${dashboard.dashboardId}`)}
                >
                  Copy URL
                </Button>
                <div className="flex gap-2">
                  <Button
                    variant="warning"
                    size="sm"
                    onClick={() => handleRotateUrl(dashboard.dashboardId)}
                  >
                    Rotate URL
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteDashboard(dashboard.dashboardId)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto">
      {view === 'list' && renderListView()}
      {view === 'create' && renderCreateForm()}
    </div>
  );
}
