/**
 * Inventory API Client - Family Inventory Management System Frontend
 * 
 * API client methods for inventory management operations.
 */

import { apiClient } from '../api-client';
import {
  InventoryItem,
  CreateInventoryItemRequest,
  UpdateInventoryItemRequest,
  AdjustQuantityRequest,
  ListInventoryResponse,
} from '@/types/entities';

/**
 * List inventory items for a family
 */
export const listInventoryItems = async (
  familyId: string,
  filters?: {
    locationId?: string;
    storeId?: string;
    archived?: boolean;
    lowStock?: boolean;
  }
): Promise<ListInventoryResponse> => {
  const params = new URLSearchParams();
  
  if (filters?.locationId) {
    params.append('locationId', filters.locationId);
  }
  if (filters?.storeId) {
    params.append('storeId', filters.storeId);
  }
  if (filters?.archived !== undefined) {
    params.append('archived', String(filters.archived));
  }
  if (filters?.lowStock !== undefined) {
    params.append('lowStock', String(filters.lowStock));
  }
  
  const queryString = params.toString();
  const url = `/families/${familyId}/inventory${queryString ? `?${queryString}` : ''}`;
  
  return apiClient.get<ListInventoryResponse>(url, true);
};

/**
 * Get single inventory item
 */
export const getInventoryItem = async (
  familyId: string,
  itemId: string
): Promise<InventoryItem> => {
  return apiClient.get<InventoryItem>(`/families/${familyId}/inventory/${itemId}`, true);
};

/**
 * Create new inventory item
 */
export const createInventoryItem = async (
  familyId: string,
  data: CreateInventoryItemRequest
): Promise<InventoryItem> => {
  return apiClient.post<InventoryItem>(`/families/${familyId}/inventory`, data, true);
};

/**
 * Update inventory item
 */
export const updateInventoryItem = async (
  familyId: string,
  itemId: string,
  data: UpdateInventoryItemRequest
): Promise<InventoryItem> => {
  return apiClient.put<InventoryItem>(`/families/${familyId}/inventory/${itemId}`, data, true);
};

/**
 * Adjust inventory item quantity
 */
export const adjustInventoryQuantity = async (
  familyId: string,
  itemId: string,
  data: AdjustQuantityRequest
): Promise<InventoryItem> => {
  return apiClient.patch<InventoryItem>(
    `/families/${familyId}/inventory/${itemId}/quantity`,
    data,
    true
  );
};

/**
 * Archive inventory item
 */
export const archiveInventoryItem = async (
  familyId: string,
  itemId: string
): Promise<InventoryItem> => {
  return apiClient.post<InventoryItem>(
    `/families/${familyId}/inventory/${itemId}/archive`,
    undefined,
    true
  );
};

/**
 * Delete inventory item
 */
export const deleteInventoryItem = async (
  familyId: string,
  itemId: string
): Promise<void> => {
  return apiClient.delete<void>(`/families/${familyId}/inventory/${itemId}`, true);
};
