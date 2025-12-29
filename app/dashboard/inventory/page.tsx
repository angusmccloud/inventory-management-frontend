/**
 * Inventory Page - Inventory HQ
 * 
 * Main page for managing family inventory items.
 */

'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getUserContext } from '@/lib/auth';
import { listUserFamilies } from '@/lib/api/families';
import {
  listInventoryItems,
  archiveInventoryItem,
  deleteInventoryItem,
} from '@/lib/api/inventory';
import { addToShoppingList } from '@/lib/api/shoppingList';
import { isApiClientError } from '@/lib/api-client';
import { InventoryItem } from '@/types/entities';
import InventoryList from '@/components/inventory/InventoryList';
import AddItemForm from '@/components/inventory/AddItemForm';
import EditItemForm from '@/components/inventory/EditItemForm';
import AdjustQuantity from '@/components/inventory/AdjustQuantity';
import Dialog from '@/components/common/Dialog';
import { Text, Button, Alert, PageHeader } from '@/components/common';

type ModalState =
  | { type: 'none' }
  | { type: 'add' }
  | { type: 'edit'; item: InventoryItem }
  | { type: 'adjust'; item: InventoryItem };

type DialogState =
  | { type: 'none' }
  | { type: 'confirm'; item: InventoryItem; action: 'archive' | 'delete' };

export default function InventoryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [modalState, setModalState] = useState<ModalState>({ type: 'none' });
  const [dialogState, setDialogState] = useState<DialogState>({ type: 'none' });
  const [familyId, setFamilyId] = useState<string>('');
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

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
      const response = await listInventoryItems(familyId, { archived: false });
      setItems(response.items || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load inventory');
      setItems([]); // Reset to empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleItemAdded = (item: InventoryItem): void => {
    setItems([...items, item]);
    setModalState({ type: 'none' });
  };

  const handleItemUpdated = (updatedItem: InventoryItem): void => {
    setItems(items.map((item) => 
      item.itemId === updatedItem.itemId ? updatedItem : item
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
      // Show success message
      setError('');
      // Could show a success toast here instead
    } catch (err) {
      // If it's a duplicate (409 conflict), treat it as success
      if (isApiClientError(err) && err.statusCode === 409) {
        setError(''); // Clear any existing errors - item is already in list
        return;
      }
      setError(err instanceof Error ? err.message : 'Failed to add item to shopping list');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-text-default">Loading inventory...</p>
      </div>
    );
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
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Inventory"
        description="Manage your family's inventory items"
        action={isAdmin ? (
          <Button
            variant="primary"
            onClick={() => setModalState({ type: 'add' })}
          >
            Add Item
          </Button>
        ) : undefined}
      />

      {error && (
        <Alert severity="error" dismissible onDismiss={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Inventory List */}
      <InventoryList
        items={items}
        onEdit={(item) => setModalState({ type: 'edit', item })}
        onAdjustQuantity={(item) => setModalState({ type: 'adjust', item })}
        onArchive={handleArchive}
        onDelete={handleDelete}
        onAddToShoppingList={handleAddToShoppingList}
        onViewDetails={(item) => router.push(`/dashboard/inventory/${item.itemId}`)}
        isAdmin={isAdmin}
      />

      {/* Modals */}
      {modalState.type !== 'none' && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div
              className="fixed inset-0 bg-surface-elevated bg-opacity-75 dark:bg-opacity-80 transition-opacity"
              onClick={() => setModalState({ type: 'none' })}
            />

            {/* Modal panel */}
            <div className="inline-block align-bottom bg-surface rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <Text variant="h3" className="text-text-default mb-4">
                  {modalState.type === 'add' && 'Add New Item'}
                  {modalState.type === 'edit' && 'Edit Item'}
                  {modalState.type === 'adjust' && 'Adjust Quantity'}
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

                {modalState.type === 'adjust' && (
                  <AdjustQuantity
                    familyId={familyId}
                    item={modalState.item}
                    onSuccess={handleItemUpdated}
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
          type="confirm"
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
    </div>
  );
}
