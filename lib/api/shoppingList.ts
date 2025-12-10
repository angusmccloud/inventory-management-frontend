/**
 * Shopping List API Client - Family Inventory Management System Frontend
 * Feature: 002-shopping-lists
 * 
 * API client methods for shopping list management operations.
 */

import { apiClient } from '../api-client';

/**
 * Shopping List Item (Frontend Type)
 */
export interface ShoppingListItem {
  shoppingItemId: string;
  familyId: string;
  itemId: string | null;
  name: string;
  storeId: string | null;
  storeName?: string | null; // Denormalized for display
  status: 'pending' | 'purchased';
  quantity: number | null;
  notes: string | null;
  version: number;
  addedBy: string;
  addedByName?: string | null; // Denormalized for display
  createdAt: string;
  updatedAt: string;
}

/**
 * Store Group Summary
 */
export interface StoreGroupSummary {
  storeId: string | null;
  storeName: string;
  itemCount: number;
  pendingCount: number;
}

/**
 * List Shopping List Items Response
 */
export interface ListShoppingListResponse {
  items: ShoppingListItem[];
  groupedByStore?: StoreGroupSummary[];
}

/**
 * Add to Shopping List Request
 */
export interface AddToShoppingListRequest {
  itemId?: string | null;
  name?: string;
  storeId?: string | null;
  quantity?: number | null;
  notes?: string | null;
  force?: boolean;
}

/**
 * Update Shopping List Item Request
 */
export interface UpdateShoppingListItemRequest {
  name?: string;
  storeId?: string | null;
  quantity?: number | null;
  notes?: string | null;
  version: number;
}

/**
 * Update Status Request
 */
export interface UpdateStatusRequest {
  status: 'pending' | 'purchased';
  version: number;
}

/**
 * List shopping list items for a family
 */
export const listShoppingListItems = async (
  familyId: string,
  filters?: {
    storeId?: string | null;
    status?: 'pending' | 'purchased' | 'all';
  }
): Promise<ListShoppingListResponse> => {
  const params = new URLSearchParams();
  
  if (filters?.storeId !== undefined) {
    params.append('storeId', filters.storeId === null ? 'unassigned' : filters.storeId);
  }
  if (filters?.status && filters.status !== 'all') {
    params.append('status', filters.status);
  }
  
  const queryString = params.toString();
  const url = `/families/${familyId}/shopping-list${queryString ? `?${queryString}` : ''}`;
  
  return apiClient.get<ListShoppingListResponse>(url, true);
};

/**
 * Get single shopping list item
 */
export const getShoppingListItem = async (
  familyId: string,
  shoppingItemId: string
): Promise<ShoppingListItem> => {
  return apiClient.get<ShoppingListItem>(
    `/families/${familyId}/shopping-list/${shoppingItemId}`,
    true
  );
};

/**
 * Add item to shopping list
 */
export const addToShoppingList = async (
  familyId: string,
  data: AddToShoppingListRequest
): Promise<ShoppingListItem> => {
  return apiClient.post<ShoppingListItem>(
    `/families/${familyId}/shopping-list`,
    data,
    true
  );
};

/**
 * Update shopping list item details
 */
export const updateShoppingListItem = async (
  familyId: string,
  shoppingItemId: string,
  data: UpdateShoppingListItemRequest
): Promise<ShoppingListItem> => {
  return apiClient.put<ShoppingListItem>(
    `/families/${familyId}/shopping-list/${shoppingItemId}`,
    data,
    true
  );
};

/**
 * Update shopping list item status (toggle purchased)
 */
export const updateShoppingListItemStatus = async (
  familyId: string,
  shoppingItemId: string,
  data: UpdateStatusRequest
): Promise<ShoppingListItem> => {
  return apiClient.patch<ShoppingListItem>(
    `/families/${familyId}/shopping-list/${shoppingItemId}/status`,
    data,
    true
  );
};

/**
 * Remove item from shopping list
 */
export const removeFromShoppingList = async (
  familyId: string,
  shoppingItemId: string
): Promise<void> => {
  return apiClient.delete<void>(
    `/families/${familyId}/shopping-list/${shoppingItemId}`,
    true
  );
};

/**
 * Toggle item status between pending and purchased
 * Convenience wrapper around updateShoppingListItemStatus
 */
export const toggleShoppingListItemStatus = async (
  familyId: string,
  item: ShoppingListItem
): Promise<ShoppingListItem> => {
  const newStatus = item.status === 'pending' ? 'purchased' : 'pending';
  return updateShoppingListItemStatus(familyId, item.shoppingItemId, {
    status: newStatus,
    version: item.version,
  });
};

