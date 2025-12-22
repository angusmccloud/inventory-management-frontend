/**
 * API client functions for Reference Data Management
 * Feature: 005-reference-data
 */

import { apiClient } from '../api-client';
import type {
  StorageLocation,
  Store,
  CreateStorageLocationRequest,
  UpdateStorageLocationRequest,
  CreateStoreRequest,
  UpdateStoreRequest,
} from '../../types/entities';

// ============================================================================
// Storage Locations API
// ============================================================================

export async function listStorageLocations(familyId: string): Promise<StorageLocation[]> {
  const response = await apiClient.get<{ locations: StorageLocation[] }>(`/families/${familyId}/locations`);
  return response.locations;
}

export async function createStorageLocation(
  familyId: string,
  data: CreateStorageLocationRequest
): Promise<StorageLocation> {
  return apiClient.post<StorageLocation>(`/families/${familyId}/locations`, data);
}

export async function getStorageLocation(
  familyId: string,
  locationId: string
): Promise<StorageLocation> {
  return apiClient.get<StorageLocation>(`/families/${familyId}/locations/${locationId}`);
}

export async function updateStorageLocation(
  familyId: string,
  locationId: string,
  data: UpdateStorageLocationRequest
): Promise<StorageLocation> {
  return apiClient.put<StorageLocation>(`/families/${familyId}/locations/${locationId}`, data);
}

export async function deleteStorageLocation(
  familyId: string,
  locationId: string
): Promise<void> {
  return apiClient.delete(`/families/${familyId}/locations/${locationId}`);
}

// ============================================================================
// Stores API
// ============================================================================

export async function listStores(familyId: string): Promise<Store[]> {
  const response = await apiClient.get<{ stores: Store[] }>(`/families/${familyId}/stores`);
  return response.stores;
}

export async function createStore(
  familyId: string,
  data: CreateStoreRequest
): Promise<Store> {
  return apiClient.post<Store>(`/families/${familyId}/stores`, data);
}

export async function getStore(
  familyId: string,
  storeId: string
): Promise<Store> {
  return apiClient.get<Store>(`/families/${familyId}/stores/${storeId}`);
}

export async function updateStore(
  familyId: string,
  storeId: string,
  data: UpdateStoreRequest
): Promise<Store> {
  return apiClient.put<Store>(`/families/${familyId}/stores/${storeId}`, data);
}

export async function deleteStore(
  familyId: string,
  storeId: string
): Promise<void> {
  return apiClient.delete(`/families/${familyId}/stores/${storeId}`);
}
