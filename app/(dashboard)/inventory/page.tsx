/**
 * Inventory Page - Inventory HQ
 * 
 * Main page for managing family inventory items.
 */

'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { getUserContext } from '@/lib/auth';
import { listUserFamilies } from '@/lib/api/families';
import {
  listInventoryItems,
  archiveInventoryItem,
  deleteInventoryItem,
} from '@/lib/api/inventory';
import { addToShoppingList } from '@/lib/api/shoppingList';
import { listStorageLocations, listStores } from '@/lib/api/reference-data';
import { isApiClientError } from '@/lib/api-client';
import { InventoryItem, StorageLocation, Store } from '@/types/entities';
import InventoryList from '@/components/inventory/InventoryList';
import AddItemForm from '@/components/inventory/AddItemForm';
import EditItemForm from '@/components/inventory/EditItemForm';
import Dialog from '@/components/common/Dialog';
import DashboardManager from '@/components/dashboard/DashboardManager';
import DashboardForm from '@/components/dashboard/DashboardForm';
import { Text, Button, Alert, PageHeader, PageLoading, PageContainer, TabNavigation } from '@/components/common';
import type { Tab } from '@/components/common/TabNavigation/TabNavigation.types';
import { useSnackbar } from '@/contexts/SnackbarContext';

type ModalState =
  | { type: 'none' }
  | { type: 'add' }
  | { type: 'edit'; item: InventoryItem }
  | { type: 'addDashboard' }
  | { type: 'editDashboard'; dashboardId: string };

type DialogState =
  | { type: 'none' }
  | { type: 'confirm'; item: InventoryItem; action: 'archive' | 'delete' };

export default function InventoryPage() {
  const searchParams = useSearchParams();
  const { showSnackbar } = useSnackbar();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [modalState, setModalState] = useState<ModalState>({ type: 'none' });
  const [dialogState, setDialogState] = useState<DialogState>({ type: 'none' });
  const [familyId, setFamilyId] = useState<string>('');
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('inventory');
  const [locationMap, setLocationMap] = useState<Map<string, StorageLocation>>(new Map());
  const [storeMap, setStoreMap] = useState<Map<string, Store>>(new Map());

  const tabs: Tab[] = [
    { id: 'inventory', label: 'Inventory' },
    { id: 'tracking-lists', label: 'Tracking Lists' },
  ];

  // Helper function to enrich an item with location and store names
  const enrichItem = (item: InventoryItem): InventoryItem => ({
    ...item,
    locationName: item.locationId ? locationMap.get(item.locationId)?.name : undefined,
    preferredStoreName: item.preferredStoreId ? storeMap.get(item.preferredStoreId)?.name : undefined,
  });

  useEffect(() => {
    loadFamilyId();
  }, []);

  const loadFamilyId = async (): Promise<void> => {
    try {
      const userContext = getUserContext();
      
      // Check user role
      if (userContext?.role === 'admin') {
        setIsAdmin(true);
      }
      
      if (userContext?.familyId) {
        // Use cached familyId from localStorage
        setFamilyId(userContext.familyId);
      } else {
        // Fetch from backend
        const families = await listUserFamilies();
        
        if (families && families.length > 0 && families[0]) {
          const userFamilyId = families[0].familyId;
          setFamilyId(userFamilyId);
          
          // Cache it in localStorage
          if (userContext && typeof window !== 'undefined') {
            userContext.familyId = userFamilyId;
            localStorage.setItem('user_context', JSON.stringify(userContext));
          }
        } else {
          // No families, stop loading
          setLoading(false);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load family');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (familyId) {
      loadInventory();
    }
  }, [familyId]);

  useEffect(() => {
    // Check if we should open add modal from query params
    const action = searchParams.get('action');
    if (action === 'add') {
      setModalState({ type: 'add' });
    }
  }, [searchParams]);

  const loadInventory = async (): Promise<void> => {
    if (!familyId) return;
    
    setLoading(true);
    setError('');

    try {
      // Fetch inventory items and reference data in parallel
      const [response, locations, stores] = await Promise.all([
        listInventoryItems(familyId, { archived: false }),
        listStorageLocations(familyId),
        listStores(familyId),
      ]);

      // Create lookup maps for efficient enrichment
      const newLocationMap = new Map<string, StorageLocation>();
      locations.forEach((loc: StorageLocation) => {
        newLocationMap.set(loc.locationId, loc);
      });

      const newStoreMap = new Map<string, Store>();
      stores.forEach((store: Store) => {
        newStoreMap.set(store.storeId, store);
      });

      // Store the maps in state for later use
      setLocationMap(newLocationMap);
      setStoreMap(newStoreMap);

      // Enrich items with location and store names
      const enrichedItems = (response.items || []).map((item: InventoryItem) => ({
        ...item,
        locationName: item.locationId ? newLocationMap.get(item.locationId)?.name : undefined,
        preferredStoreName: item.preferredStoreId ? newStoreMap.get(item.preferredStoreId)?.name : undefined,
      }));

      setItems(enrichedItems);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load inventory');
      setItems([]); // Reset to empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleItemAdded = (item: InventoryItem): void => {
    setItems([...items, enrichItem(item)]);
    setModalState({ type: 'none' });
  };

  const handleItemUpdated = (updatedItem: InventoryItem): void => {
    setItems(items.map((item) => 
      item.itemId === updatedItem.itemId ? enrichItem(updatedItem) : item
    ));
    setModalState({ type: 'none' });
  };

  const handleArchive = (item: InventoryItem): void => {
    setDialogState({ type: 'confirm', item, action: 'archive' });
  };

  const handleDelete = (item: InventoryItem): void => {
    setDialogState({ type: 'confirm', item, action: 'delete' });
  };

  const confirmAction = async (): Promise<void> => {
    if (dialogState.type !== 'confirm') return;

    const { item, action } = dialogState;
    setDialogState({ type: 'none' });

    try {
      if (action === 'archive') {
        await archiveInventoryItem(familyId, item.itemId);
      } else {
        await deleteInventoryItem(familyId, item.itemId);
      }
      setItems(items.filter((i) => i.itemId !== item.itemId));
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to ${action} item`);
    }
  };

  const handleAddToShoppingList = async (item: InventoryItem): Promise<void> => {
    try {
      await addToShoppingList(familyId, {
        itemId: item.itemId,
        name: item.name,
        storeId: item.preferredStoreId || null,
        quantity: 1,
        notes: null,
      });
      
      // Show success snackbar
      showSnackbar({
        variant: 'success',
        text: `${item.name} added to shopping list`,
      });
      setError('');
    } catch (err) {
      // If it's a duplicate (409 conflict), show warning
      if (isApiClientError(err) && err.statusCode === 409) {
        showSnackbar({
          variant: 'warning',
          text: `${item.name} is already in shopping list`,
        });
        setError('');
        return;
      }
      
      // Show error snackbar for other errors
      showSnackbar({
        variant: 'error',
        text: err instanceof Error ? err.message : 'Failed to add item to shopping list',
      });
      setError(err instanceof Error ? err.message : 'Failed to add item to shopping list');
    }
  };

  if (loading) {
    return <PageLoading message="Loading inventory..." fullHeight={false} />;
  }

  if (!familyId) {
    return (
      <div className="text-center py-12">
        <Text variant="body" className="text-text-default">
          Please create a family first from the dashboard.
        </Text>
        <Button
          variant="primary"
          onClick={() => window.location.href = '/dashboard'}
          className="mt-4"
        >
          Go to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <PageContainer>
        {/* Header */}
        <PageHeader
          title="Inventory"
          description="Manage your family's inventory items and tracking lists"
          action={isAdmin ? (
            activeTab === 'inventory' ? (
              <Button
                variant="primary"
                onClick={() => {
                  console.log('Add Item button clicked');
                  setModalState({ type: 'add' });
                }}
              >
                Add Item
              </Button>
            ) : activeTab === 'tracking-lists' ? (
              <Button
                variant="primary"
                onClick={() => setModalState({ type: 'addDashboard' })}
              >
                Create New List
              </Button>
            ) : undefined
          ) : undefined}
      />

      {error && (
        <Alert severity="error" dismissible onDismiss={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Tab Navigation */}
      <TabNavigation
        tabs={tabs}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {/* Inventory Tab */}
      {activeTab === 'inventory' && (
        <InventoryList
          items={items}
          familyId={familyId}
          onEdit={(item) => setModalState({ type: 'edit', item })}
          onArchive={handleArchive}
          onDelete={handleDelete}
          onAddToShoppingList={handleAddToShoppingList}
          onItemUpdated={handleItemUpdated}
          isAdmin={isAdmin}
        />
      )}

      {/* Tracking Lists Tab */}
      {activeTab === 'tracking-lists' && (
        <DashboardManager 
          familyId={familyId}
          onEdit={(dashboardId) => setModalState({ type: 'editDashboard', dashboardId })}
        />
      )}

      {/* Modals */}
      {modalState.type !== 'none' && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center px-4 text-center sm:p-0">
            {/* Background overlay */}
            <div
              className="fixed inset-0 bg-surface-elevated bg-opacity-75 dark:bg-opacity-80 transition-opacity"
              onClick={() => {
                console.log('Modal overlay clicked');
                setModalState({ type: 'none' });
              }}
            />

            {/* Modal panel */}
            <div className="relative w-[90%] max-w-full inline-block align-bottom bg-surface rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <Text variant="h3" className="text-text-default mb-4">
                  {modalState.type === 'add' && 'Add New Item'}
                  {modalState.type === 'edit' && 'Edit Item'}
                  {modalState.type === 'addDashboard' && 'Create New List'}
                  {modalState.type === 'editDashboard' && 'Edit List'}
                </Text>

                {modalState.type === 'add' && (
                  <AddItemForm
                    familyId={familyId}
                    onSuccess={handleItemAdded}
                    onCancel={() => setModalState({ type: 'none' })}
                  />
                )}

                {modalState.type === 'edit' && (
                  <EditItemForm
                    familyId={familyId}
                    item={modalState.item}
                    onSuccess={handleItemUpdated}
                    onCancel={() => setModalState({ type: 'none' })}
                  />
                )}

                {modalState.type === 'addDashboard' && (
                  <DashboardForm
                    familyId={familyId}
                    onSuccess={(_dashboardId, _shareableUrl) => {
                      setModalState({ type: 'none' });
                      showSnackbar({ variant: 'success', text: 'List created successfully!' });
                      // Reload page to refresh dashboard list
                      window.location.reload();
                    }}
                    onCancel={() => setModalState({ type: 'none' })}
                  />
                )}

                {modalState.type === 'editDashboard' && (
                  <DashboardForm
                    familyId={familyId}
                    dashboardId={modalState.dashboardId}
                    onSuccess={() => {
                      setModalState({ type: 'none' });
                      showSnackbar({ variant: 'success', text: 'List updated successfully!' });
                      // Reload page to refresh dashboard list
                      window.location.reload();
                    }}
                    onCancel={() => setModalState({ type: 'none' })}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dialogs */}
      {dialogState.type === 'confirm' && (
        <Dialog
          isOpen={true}
          type="error"
          title={dialogState.action === 'archive' ? 'Archive Item' : 'Delete Item'}
          message={
            dialogState.action === 'archive'
              ? `Archive ${dialogState.item.name}? You can restore it later.`
              : `Permanently delete ${dialogState.item.name}? This cannot be undone.`
          }
          confirmLabel={dialogState.action === 'archive' ? 'Archive' : 'Delete'}
          cancelLabel="Cancel"
          onConfirm={confirmAction}
          onCancel={() => setDialogState({ type: 'none' })}
        />
      )}
    </PageContainer>
  );
}
