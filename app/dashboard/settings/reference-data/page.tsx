/**
 * Reference Data Management Page
 * 
 * Feature: 005-reference-data
 * Requirement: FR-067 - System MUST provide a dedicated settings/management page for reference data
 * 
 * This page allows adults to manage storage locations and stores (vendors).
 * Suggesters can view but cannot modify reference data.
 */

'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getUserContext } from '@/lib/auth';
import StorageLocationList from '@/components/reference-data/StorageLocationList';
import StorageLocationForm from '@/components/reference-data/StorageLocationForm';
import StoreList from '@/components/reference-data/StoreList';
import StoreForm from '@/components/reference-data/StoreForm';
import ReferenceDataEmptyState from '@/components/reference-data/ReferenceDataEmptyState';
import type { UserContext, StorageLocation, Store } from '@/types/entities';
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

export default function ReferenceDataPage() {
  const router = useRouter();
  const [userContext, setUserContext] = useState<UserContext | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'locations' | 'stores'>('locations');
  
  // Data state
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

  // Load data when user context is available
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
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!userContext) {
    return null;
  }

  const isAdmin = userContext.role === 'admin';

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Reference Data</h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Manage storage locations and stores for your family inventory.
          {!isAdmin && ' (View only - contact an admin to make changes)'}
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 rounded-md bg-red-50 dark:bg-red-900/20 p-4">
          <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('locations')}
            className={`whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium ${
              activeTab === 'locations'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            }`}
            aria-current={activeTab === 'locations' ? 'page' : undefined}
          >
            Storage Locations
            <span className="ml-2 rounded-full bg-gray-100 dark:bg-gray-700 px-2.5 py-0.5 text-xs font-medium text-gray-900 dark:text-gray-100">
              {locations.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('stores')}
            className={`whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium ${
              activeTab === 'stores'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            }`}
            aria-current={activeTab === 'stores' ? 'page' : undefined}
          >
            Stores
            <span className="ml-2 rounded-full bg-gray-100 dark:bg-gray-700 px-2.5 py-0.5 text-xs font-medium text-gray-900 dark:text-gray-100">
              {stores.length}
            </span>
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {loadingData ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">Loading...</p>
          </div>
        ) : (
          <>
            {/* Storage Locations Tab */}
            {activeTab === 'locations' && (
              <div>
                {isAdmin && (
                  <div className="mb-4">
                    <button
                      onClick={() => setDialogState({ type: 'create-location' })}
                      className="inline-flex items-center rounded-md bg-blue-600 dark:bg-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
                    >
                      Add Storage Location
                    </button>
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
              </div>
            )}

            {/* Stores Tab */}
            {activeTab === 'stores' && (
              <div>
                {isAdmin && (
                  <div className="mb-4">
                    <button
                      onClick={() => setDialogState({ type: 'create-store' })}
                      className="inline-flex items-center rounded-md bg-blue-600 dark:bg-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
                    >
                      Add Store
                    </button>
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
              </div>
            )}
          </>
        )}
      </div>

      {/* Storage Location Form Dialog */}
      {(dialogState.type === 'create-location' || dialogState.type === 'edit-location') && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div className="fixed inset-0 bg-gray-500 dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-80 transition-opacity" onClick={() => setDialogState({ type: 'none' })} />
            <div className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
              <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
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
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div className="fixed inset-0 bg-gray-500 dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-80 transition-opacity" onClick={() => setDialogState({ type: 'none' })} />
            <div className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
              <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
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
    </div>
  );
}
