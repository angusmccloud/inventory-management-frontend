/**
 * Inventory Page - Family Inventory Management System
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
import { InventoryItem } from '@/types/entities';
import InventoryList from '@/components/inventory/InventoryList';
import AddItemForm from '@/components/inventory/AddItemForm';
import EditItemForm from '@/components/inventory/EditItemForm';
import AdjustQuantity from '@/components/inventory/AdjustQuantity';

type ModalState =
  | { type: 'none' }
  | { type: 'add' }
  | { type: 'edit'; item: InventoryItem }
  | { type: 'adjust'; item: InventoryItem };

export default function InventoryPage() {
  const searchParams = useSearchParams();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [modalState, setModalState] = useState<ModalState>({ type: 'none' });
  const [familyId, setFamilyId] = useState<string>('');

  useEffect(() => {
    loadFamilyId();
  }, []);

  const loadFamilyId = async (): Promise<void> => {
    try {
      const userContext = getUserContext();
      
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

  const handleArchive = async (item: InventoryItem): Promise<void> => {
    if (!confirm(`Archive ${item.name}?`)) return;

    try {
      await archiveInventoryItem(familyId, item.itemId);
      setItems(items.filter((i) => i.itemId !== item.itemId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to archive item');
    }
  };

  const handleDelete = async (item: InventoryItem): Promise<void> => {
    if (!confirm(`Permanently delete ${item.name}?`)) return;

    try {
      await deleteInventoryItem(familyId, item.itemId);
      setItems(items.filter((i) => i.itemId !== item.itemId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete item');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Loading inventory...</p>
      </div>
    );
  }

  if (!familyId) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Please create a family first from the dashboard.</p>
        <a
          href="/dashboard"
          className="mt-4 inline-block rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
        >
          Go to Dashboard
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage your family's inventory items
          </p>
        </div>
        <button
          onClick={() => setModalState({ type: 'add' })}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
        >
          Add Item
        </button>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Inventory List */}
      <InventoryList
        items={items}
        onEdit={(item) => setModalState({ type: 'edit', item })}
        onAdjustQuantity={(item) => setModalState({ type: 'adjust', item })}
        onArchive={handleArchive}
        onDelete={handleDelete}
      />

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
                  {modalState.type === 'add' && 'Add New Item'}
                  {modalState.type === 'edit' && 'Edit Item'}
                  {modalState.type === 'adjust' && 'Adjust Quantity'}
                </h3>

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
    </div>
  );
}
