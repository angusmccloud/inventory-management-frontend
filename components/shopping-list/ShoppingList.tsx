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
import StoreFilter from './StoreFilter';
import Dialog from '../common/Dialog';

interface ShoppingListProps {
  familyId: string;
}

type ModalState = 
  | { type: 'none' }
  | { type: 'add' }
  | { type: 'edit'; item: ShoppingListItem };

type DialogState = 
  | { type: 'none' }
  | { type: 'confirm'; item: ShoppingListItem; action: 'remove' }
  | { type: 'error'; message: string };

export default function ShoppingList({ familyId }: ShoppingListProps) {
  const [items, setItems] = useState<ShoppingListItem[]>([]);
  const [stores, setStores] = useState<StoreGroupSummary[]>([]);
  const [selectedStore, setSelectedStore] = useState<string | null | 'all'>('all');
  const [modalState, setModalState] = useState<ModalState>({ type: 'none' });
  const [dialogState, setDialogState] = useState<DialogState>({ type: 'none' });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    const storeKey = item.storeName || 'Unassigned';
    if (!groupedItems[storeKey]) {
      groupedItems[storeKey] = [];
    }
    groupedItems[storeKey].push(item);
  });

  if (isLoading) {
    return <div className="text-center py-12">Loading shopping list...</div>;
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <p className="text-sm text-red-800">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Shopping List</h2>
          <p className="mt-1 text-sm text-gray-500">
            {items.length} {items.length === 1 ? 'item' : 'items'} total
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex gap-3">
          <StoreFilter
            stores={stores}
            selectedStoreId={selectedStore}
            onStoreChange={setSelectedStore}
          />
          <button
            onClick={() => setModalState({ type: 'add' })}
            className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
          >
            Add Item
          </button>
        </div>
      </div>

      {/* Shopping List Items */}
      {items.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Your shopping list is empty.</p>
          <p className="text-sm text-gray-400 mt-2">Add items to get started.</p>
        </div>
      ) : selectedStore === 'all' && Object.keys(groupedItems).length > 1 ? (
        // Grouped by store view
        <div className="space-y-6">
          {Object.entries(groupedItems).map(([storeName, storeItems]) => (
            <div key={storeName}>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{storeName}</h3>
              <div className="overflow-hidden bg-white shadow sm:rounded-md">
                <ul role="list" className="divide-y divide-gray-200">
                  {storeItems.map((item) => (
                    <ShoppingListItemComponent
                      key={item.shoppingItemId}
                      item={item}
                      onToggleStatus={handleToggleStatus}
                      onEdit={() => setModalState({ type: 'edit', item })}
                      onRemove={handleRemoveItem}
                    />
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Single list view
        <div className="overflow-hidden bg-white shadow sm:rounded-md">
          <ul role="list" className="divide-y divide-gray-200">
            {items.map((item) => (
              <ShoppingListItemComponent
                key={item.shoppingItemId}
                item={item}
                onToggleStatus={handleToggleStatus}
                onEdit={() => setModalState({ type: 'edit', item })}
                onRemove={handleRemoveItem}
              />
            ))}
          </ul>
        </div>
      )}

      {/* Modals */}
      {modalState.type !== 'none' && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => setModalState({ type: 'none' })}
            />

            {/* Modal panel */}
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {modalState.type === 'add' && 'Add Item to Shopping List'}
                  {modalState.type === 'edit' && 'Edit Shopping List Item'}
                </h3>

                {modalState.type === 'add' && (
                  <AddItemForm
                    onSubmit={handleAddItem}
                    onCancel={() => setModalState({ type: 'none' })}
                  />
                )}

                {modalState.type === 'edit' && (
                  <EditShoppingListItemForm
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
    </div>
  );
}

