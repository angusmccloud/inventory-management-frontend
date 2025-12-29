/**
 * ShoppingList Container Component
 * Feature: 002-shopping-lists
 * 
 * Main container for shopping list functionality.
 */

'use client';

import { useState, useEffect } from 'react';
import { 
  ShoppingListItem,
  StoreGroupSummary,
  listShoppingListItems,
  addToShoppingList,
  updateShoppingListItem,
  toggleShoppingListItemStatus,
  removeFromShoppingList,
} from '@/lib/api/shoppingList';
import ShoppingListItemComponent from './ShoppingListItem';
import AddItemForm from './AddItemForm';
import EditShoppingListItemForm from './EditShoppingListItemForm';
import { SuggestionForm } from '../suggestions/SuggestionForm';
import type { SuggestionFormData } from '../suggestions/SuggestionForm';
import { createSuggestion } from '@/lib/api/suggestions';
import StoreFilter from './StoreFilter';
import Dialog from '../common/Dialog';
import { Button, Text, EmptyState, Alert, PageHeader, LoadingSpinner } from '@/components/common';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import { getUserContext } from '@/lib/auth';

interface ShoppingListProps {
  familyId: string;
}

type ModalState = 
  | { type: 'none' }
  | { type: 'add' }
  | { type: 'edit'; item: ShoppingListItem }
  | { type: 'suggest' };

type DialogState = 
  | { type: 'none' }
  | { type: 'confirm'; item: ShoppingListItem; action: 'remove' }
  | { type: 'error'; message: string }
  | { type: 'success'; message: string };

export default function ShoppingList({ familyId }: ShoppingListProps) {
  const [items, setItems] = useState<ShoppingListItem[]>([]);
  const [stores, setStores] = useState<StoreGroupSummary[]>([]);
  const [selectedStore, setSelectedStore] = useState<string | null | 'all'>('all');
  const [modalState, setModalState] = useState<ModalState>({ type: 'none' });
  const [dialogState, setDialogState] = useState<DialogState>({ type: 'none' });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Check user role
  useEffect(() => {
    const userContext = getUserContext();
    setIsAdmin(userContext?.role === 'admin');
  }, []);

  // Load shopping list
  const loadShoppingList = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await listShoppingListItems(familyId, {
        storeId: selectedStore === 'all' ? undefined : selectedStore,
      });
      
      setItems(result.items);
      setStores(result.groupedByStore || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load shopping list');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadShoppingList();
  }, [familyId, selectedStore]);

  // Handle toggle status - optimistic update
  const handleToggleStatus = async (item: ShoppingListItem) => {
    try {
      const updatedItem = await toggleShoppingListItemStatus(familyId, item);
      
      // Update item in state without full reload
      setItems(prevItems => 
        prevItems.map(i => 
          i.shoppingItemId === updatedItem.shoppingItemId ? updatedItem : i
        )
      );
    } catch (err) {
      setDialogState({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to update item status'
      });
    }
  };

  // Handle add item - add to state without reload
  const handleAddItem = async (data: any) => {
    try {
      const newItem = await addToShoppingList(familyId, data);
      setModalState({ type: 'none' });
      
      // Add new item to state
      setItems(prevItems => [...prevItems, newItem]);
      
      // Update store summary if needed
      if (newItem.storeName) {
        const storeExists = stores.find(s => s.storeName === newItem.storeName);
        if (!storeExists) {
          setStores(prevStores => [
            ...prevStores,
            {
              storeId: newItem.storeId,
              storeName: newItem.storeName || 'Unassigned',
              itemCount: 1,
              pendingCount: newItem.status === 'pending' ? 1 : 0,
            }
          ]);
        } else {
          // Update existing store count
          setStores(prevStores =>
            prevStores.map(s =>
              s.storeName === newItem.storeName
                ? {
                    ...s,
                    itemCount: s.itemCount + 1,
                    pendingCount: newItem.status === 'pending' ? s.pendingCount + 1 : s.pendingCount,
                  }
                : s
            )
          );
        }
      }
    } catch (err) {
      throw err; // Let form handle the error
    }
  };

  // Handle edit item - update in state without reload
  const handleEditItem = async (data: any) => {
    if (modalState.type !== 'edit') return;
    
    try {
      const updatedItem = await updateShoppingListItem(
        familyId, 
        modalState.item.shoppingItemId, 
        data
      );
      setModalState({ type: 'none' });
      
      // Update item in state
      setItems(prevItems => 
        prevItems.map(i => 
          i.shoppingItemId === updatedItem.shoppingItemId ? updatedItem : i
        )
      );
    } catch (err) {
      throw err; // Let form handle the error
    }
  };

  // Handle remove item - show confirmation dialog
  const handleRemoveItem = (item: ShoppingListItem) => {
    setDialogState({ type: 'confirm', item, action: 'remove' });
  };

  // Handle create suggestion
  const handleCreateSuggestion = async (data: SuggestionFormData) => {
    try {
      await createSuggestion(familyId, data);
      setModalState({ type: 'none' });
      setDialogState({
        type: 'success',
        message: 'Suggestion submitted successfully! An admin will review it soon.'
      });
    } catch (err) {
      throw err; // Let form handle the error
    }
  };

  // Confirm remove item - remove from state without reload
  const confirmRemoveItem = async () => {
    if (dialogState.type !== 'confirm' || dialogState.action !== 'remove') return;
    
    const item = dialogState.item;
    setDialogState({ type: 'none' });

    try {
      await removeFromShoppingList(familyId, item.shoppingItemId);
      
      // Remove item from state
      setItems(prevItems => 
        prevItems.filter(i => i.shoppingItemId !== item.shoppingItemId)
      );
    } catch (err) {
      setDialogState({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to remove item'
      });
    }
  };

  // Group items by store for display
  const groupedItems: Record<string, ShoppingListItem[]> = {};
  items.forEach((item) => {
    // Keep purchased items in their original store, don't move to Unassigned
    const storeKey = item.storeName || 'Unassigned';
    if (!groupedItems[storeKey]) {
      groupedItems[storeKey] = [];
    }
    groupedItems[storeKey].push(item);
  });

  // Sort items within each store alphabetically by name
  Object.keys(groupedItems).forEach((storeKey) => {
    const items = groupedItems[storeKey];
    if (items) {
      items.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    }
  });

  // Get sorted store names: alphabetically, with 'Unassigned' at the end
  const sortedStoreNames = Object.keys(groupedItems).sort((a, b) => {
    if (a === 'Unassigned') return 1;
    if (b === 'Unassigned') return -1;
    return a.localeCompare(b);
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <LoadingSpinner size="lg" />
        <Text variant="body" className="mt-4 text-text-default">
          Loading shopping list...
        </Text>
      </div>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Shopping List"
        description={`${items.length} ${items.length === 1 ? 'item' : 'items'} total`}
        action={isAdmin ? (
          <Button
            variant="primary"
            size="md"
            onClick={() => setModalState({ type: 'add' })}
          >
            Add Item
          </Button>
        ) : (
          <Button
            variant="primary"
            size="md"
            onClick={() => setModalState({ type: 'suggest' })}
          >
            Suggest
          </Button>
        )}
        secondaryActions={[
          <StoreFilter
            key="store-filter"
            stores={stores}
            selectedStoreId={selectedStore}
            onStoreChange={setSelectedStore}
          />
        ]}
      />

      {/* Shopping List Items */}
      {items.length === 0 ? (
        <EmptyState
          icon={<ShoppingCartIcon />}
          title="Your shopping list is empty."
          description={isAdmin ? "Add items to get started." : "No items on the shopping list yet."}
          action={isAdmin ? {
            label: "Add Item",
            onClick: () => setModalState({ type: 'add' }),
            variant: "primary"
          } : undefined}
        />
      ) : selectedStore === 'all' && Object.keys(groupedItems).length > 1 ? (
        // Grouped by store view with responsive grid
        <div className="space-y-8">
          {sortedStoreNames.map((storeName) => {
            const storeItems = groupedItems[storeName];
            if (!storeItems) return null;
            
            return (
              <div key={storeName}>
                <Text variant="h3" className="text-text-default mb-4">
                  {storeName}
                </Text>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {storeItems.map((item) => (
                    <ShoppingListItemComponent
                      key={item.shoppingItemId}
                      item={item}
                      onToggleStatus={handleToggleStatus}
                      onEdit={() => setModalState({ type: 'edit', item })}
                      onRemove={handleRemoveItem}
                      isAdmin={isAdmin}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        // Single store view with responsive grid
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.sort((a, b) => (a.name || '').localeCompare(b.name || '')).map((item) => (
            <ShoppingListItemComponent
              key={item.shoppingItemId}
              item={item}
              onToggleStatus={handleToggleStatus}
              onEdit={() => setModalState({ type: 'edit', item })}
              onRemove={handleRemoveItem}
              isAdmin={isAdmin}
            />
          ))}
        </div>
      )}

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
                  {modalState.type === 'add' && 'Add Item to Shopping List'}
                  {modalState.type === 'edit' && 'Edit Shopping List Item'}
                  {modalState.type === 'suggest' && 'Create Suggestion'}
                </Text>

                {modalState.type === 'add' && (
                  <AddItemForm
                    familyId={familyId}
                    onSubmit={handleAddItem}
                    onCancel={() => setModalState({ type: 'none' })}
                  />
                )}
                {modalState.type === 'suggest' && (
                  <SuggestionForm
                    familyId={familyId}
                    onSubmit={handleCreateSuggestion}
                    onCancel={() => setModalState({ type: 'none' })}
                  />
                )}
                {modalState.type === 'edit' && (
                  <EditShoppingListItemForm
                    familyId={familyId}
                    item={modalState.item}
                    onSubmit={handleEditItem}
                    onCancel={() => setModalState({ type: 'none' })}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dialogs */}
      {dialogState.type === 'confirm' && dialogState.action === 'remove' && (
        <Dialog
          isOpen={true}
          type="confirm"
          title="Remove Item"
          message={`Remove "${dialogState.item.name}" from shopping list?`}
          confirmLabel="Remove"
          cancelLabel="Cancel"
          onConfirm={confirmRemoveItem}
          onCancel={() => setDialogState({ type: 'none' })}
        />
      )}

      {dialogState.type === 'error' && (
        <Dialog
          isOpen={true}
          type="error"
          title="Error"
          message={dialogState.message}
          confirmLabel="OK"
          cancelLabel=""
          onConfirm={() => setDialogState({ type: 'none' })}
          onCancel={() => setDialogState({ type: 'none' })}
        />
      )}

      {dialogState.type === 'success' && (
        <Dialog
          isOpen={true}
          type="alert"
          title="Success"
          message={dialogState.message}
          confirmLabel="OK"
          cancelLabel=""
          onConfirm={() => setDialogState({ type: 'none' })}
          onCancel={() => setDialogState({ type: 'none' })}
        />
      )}
    </div>
  );
}

