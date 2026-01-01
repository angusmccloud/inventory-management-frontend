/**
 * Settings Page - User Preferences and Reference Data
 * 
 * Consolidated settings page with tabs for:
 * - App Theme: Theme preferences
 * - Manage Stores: Store/vendor management
 * - Manage Storage Locations: Storage location management
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getUserContext } from '@/lib/auth';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { TabNavigation, Card, PageLoading, Text, LoadingSpinner, Button, PageHeader, PageContainer } from '@/components/common';
import type { Tab } from '@/components/common/TabNavigation/TabNavigation.types';
import type { UserContext, StorageLocation, Store } from '@/types/entities';
import StorageLocationList from '@/components/reference-data/StorageLocationList';
import StorageLocationForm from '@/components/reference-data/StorageLocationForm';
import StoreList from '@/components/reference-data/StoreList';
import StoreForm from '@/components/reference-data/StoreForm';
import ReferenceDataEmptyState from '@/components/reference-data/ReferenceDataEmptyState';
import {
  listStorageLocations,
  createStorageLocation,
  updateStorageLocation,
  deleteStorageLocation,
  listStores,
  createStore,
  updateStore,
  deleteStore,
} from '@/lib/api/reference-data';

type DialogState = 
  | { type: 'none' }
  | { type: 'create-location' }
  | { type: 'edit-location'; location: StorageLocation }
  | { type: 'create-store' }
  | { type: 'edit-store'; store: Store };

export default function SettingsPage() {
  const router = useRouter();
  const [userContext, setUserContext] = useState<UserContext | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('theme');
  
  // Reference data state
  const [locations, setLocations] = useState<StorageLocation[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [loadingData, setLoadingData] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Dialog state
  const [dialogState, setDialogState] = useState<DialogState>({ type: 'none' });

  useEffect(() => {
    const context = getUserContext();
    if (!context) {
      router.push('/login');
      return;
    }
    setUserContext(context);
    setLoading(false);
  }, [router]);

  // Load reference data when user context is available
  const loadData = useCallback(async () => {
    if (!userContext?.familyId) return;
    
    setLoadingData(true);
    setError(null);
    try {
      const [locationsData, storesData] = await Promise.all([
        listStorageLocations(userContext.familyId),
        listStores(userContext.familyId),
      ]);
      setLocations(locationsData);
      setStores(storesData);
    } catch (err) {
      setError('Failed to load reference data. Please try again.');
      console.error('Failed to load reference data:', err);
    } finally {
      setLoadingData(false);
    }
  }, [userContext?.familyId]);

  useEffect(() => {
    if (userContext?.familyId) {
      loadData();
    }
  }, [userContext?.familyId, loadData]);

  // Storage Location handlers
  const handleCreateLocation = async (data: { name: string; description?: string }) => {
    if (!userContext?.familyId) return;
    
    const newLocation = await createStorageLocation(userContext.familyId, data);
    setLocations((prev) => [...prev, newLocation]);
    setDialogState({ type: 'none' });
  };

  const handleUpdateLocation = async (data: { name: string; description?: string }) => {
    if (!userContext?.familyId || dialogState.type !== 'edit-location') return;
    
    const updated = await updateStorageLocation(
      userContext.familyId,
      dialogState.location.locationId,
      { ...data, version: dialogState.location.version }
    );
    setLocations((prev) =>
      prev.map((loc) => (loc.locationId === updated.locationId ? updated : loc))
    );
    setDialogState({ type: 'none' });
  };

  const handleDeleteLocation = async (locationId: string) => {
    if (!userContext?.familyId) return;
    
    await deleteStorageLocation(userContext.familyId, locationId);
    setLocations((prev) => prev.filter((loc) => loc.locationId !== locationId));
  };

  // Store handlers
  const handleCreateStore = async (data: { name: string; address?: string }) => {
    if (!userContext?.familyId) return;
    
    const newStore = await createStore(userContext.familyId, data);
    setStores((prev) => [...prev, newStore]);
    setDialogState({ type: 'none' });
  };

  const handleUpdateStore = async (data: { name: string; address?: string }) => {
    if (!userContext?.familyId || dialogState.type !== 'edit-store') return;
    
    const updated = await updateStore(
      userContext.familyId,
      dialogState.store.storeId,
      { ...data, version: dialogState.store.version }
    );
    setStores((prev) =>
      prev.map((store) => (store.storeId === updated.storeId ? updated : store))
    );
    setDialogState({ type: 'none' });
  };

  const handleDeleteStore = async (storeId: string) => {
    if (!userContext?.familyId) return;
    
    await deleteStore(userContext.familyId, storeId);
    setStores((prev) => prev.filter((store) => store.storeId !== storeId));
  };

  if (loading) {
    return <PageLoading message="Loading settings..." />;
  }

  if (!userContext) {
    return null;
  }

  const isAdmin = userContext.role === 'admin';

  const tabs: Tab[] = [
    { id: 'theme', label: 'App Theme' },
    { id: 'stores', label: 'Manage Stores', badge: stores.length },
    { id: 'locations', label: 'Manage Storage Locations', badge: locations.length },
  ];

  return (
    <PageContainer>
        {/* Header */}
        <PageHeader
          title="Settings"
          description={`Manage your personal preferences and family reference data${!isAdmin ? ' (Reference data is view-only for suggesters)' : ''}`}
        />

      {/* Error Message */}
      {error && (
        <div className="mb-6 rounded-md bg-error/10 p-4">
          <p className="text-sm text-error">{error}</p>
        </div>
      )}

      {/* Tab Navigation */}
      <Card className="mb-6">
        <TabNavigation
          tabs={tabs}
          activeTab={activeTab}
          onChange={setActiveTab}
          responsiveMode="auto"
        />
      </Card>

      {/* Tab Content */}
      <div className="mt-6">
        {/* Theme Tab */}
        {activeTab === 'theme' && (
          <div className="rounded-lg border border-border bg-surface p-6">
            <h2 className="text-lg font-semibold text-text-default mb-4">Appearance</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-default mb-2">
                  Theme
                </label>
                <p className="text-sm text-text-secondary mb-3">
                  Choose how the interface looks. Auto mode follows your system preference.
                </p>
                <ThemeToggle />
              </div>
            </div>
          </div>
        )}

        {/* Stores Tab */}
        {activeTab === 'stores' && (
          <div>
            {loadingData ? (
              <div className="flex flex-col items-center justify-center py-12">
                <LoadingSpinner size="lg" />
                <Text variant="body" className="mt-4 text-text-secondary">
                  Loading stores...
                </Text>
              </div>
            ) : (
              <>
                {isAdmin && (
                  <div className="mb-4">
                    <Button
                      variant="primary"
                      onClick={() => setDialogState({ type: 'create-store' })}
                    >
                      Add Store
                    </Button>
                  </div>
                )}
                {stores.length === 0 ? (
                  <ReferenceDataEmptyState 
                    type="stores" 
                    onAdd={() => setDialogState({ type: 'create-store' })}
                  />
                ) : (
                  <StoreList
                    stores={stores}
                    onEdit={(store) => setDialogState({ type: 'edit-store', store })}
                    onDelete={handleDeleteStore}
                  />
                )}
              </>
            )}
          </div>
        )}

        {/* Storage Locations Tab */}
        {activeTab === 'locations' && (
          <div>
            {loadingData ? (
              <div className="flex flex-col items-center justify-center py-12">
                <LoadingSpinner size="lg" />
                <Text variant="body" className="mt-4 text-text-secondary">
                  Loading storage locations...
                </Text>
              </div>
            ) : (
              <>
                {isAdmin && (
                  <div className="mb-4">
                    <Button
                      variant="primary"
                      onClick={() => setDialogState({ type: 'create-location' })}
                    >
                      Add Storage Location
                    </Button>
                  </div>
                )}
                {locations.length === 0 ? (
                  <ReferenceDataEmptyState 
                    type="locations" 
                    onAdd={() => setDialogState({ type: 'create-location' })}
                  />
                ) : (
                  <StorageLocationList
                    locations={locations}
                    onEdit={(location) => setDialogState({ type: 'edit-location', location })}
                    onDelete={handleDeleteLocation}
                  />
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Storage Location Form Dialog */}
      {(dialogState.type === 'create-location' || dialogState.type === 'edit-location') && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
            <div className="fixed inset-0 bg-surface-elevated bg-opacity-75 dark:bg-opacity-80 transition-opacity" onClick={() => setDialogState({ type: 'none' })} />
            <div className="relative w-[90%] max-w-full transform overflow-hidden rounded-lg bg-surface px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
              <h3 className="mb-4 text-lg font-semibold text-text-default">
                {dialogState.type === 'create-location' ? 'Add Storage Location' : 'Edit Storage Location'}
              </h3>
              <StorageLocationForm
                familyId={userContext.familyId}
                onSubmit={dialogState.type === 'create-location' ? handleCreateLocation : handleUpdateLocation}
                onCancel={() => setDialogState({ type: 'none' })}
                initialData={dialogState.type === 'edit-location' ? dialogState.location : undefined}
              />
            </div>
          </div>
        </div>
      )}

      {/* Store Form Dialog */}
      {(dialogState.type === 'create-store' || dialogState.type === 'edit-store') && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
            <div className="fixed inset-0 bg-surface-elevated bg-opacity-75 dark:bg-opacity-80 transition-opacity" onClick={() => setDialogState({ type: 'none' })} />
            <div className="relative w-[90%] max-w-full transform overflow-hidden rounded-lg bg-surface px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
              <h3 className="mb-4 text-lg font-semibold text-text-default">
                {dialogState.type === 'create-store' ? 'Add Store' : 'Edit Store'}
              </h3>
              <StoreForm
                familyId={userContext.familyId}
                onSubmit={dialogState.type === 'create-store' ? handleCreateStore : handleUpdateStore}
                onCancel={() => setDialogState({ type: 'none' })}
                initialData={dialogState.type === 'edit-store' ? dialogState.store : undefined}
              />
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
}
