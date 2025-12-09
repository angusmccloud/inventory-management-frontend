/**
 * Family API Client - Family Inventory Management System Frontend
 * 
 * API client methods for family management operations.
 */

import { apiClient } from '../api-client';
import { Family, CreateFamilyRequest, UpdateFamilyRequest } from '@/types/entities';

/**
 * Create a new family
 */
export const createFamily = async (data: CreateFamilyRequest): Promise<Family> => {
  return apiClient.post<Family>('/families', data, true);
};

/**
 * Get family by ID
 */
export const getFamily = async (familyId: string): Promise<Family> => {
  return apiClient.get<Family>(`/families/${familyId}`, true);
};

/**
 * Update family
 */
export const updateFamily = async (
  familyId: string,
  data: UpdateFamilyRequest
): Promise<Family> => {
  return apiClient.put<Family>(`/families/${familyId}`, data, true);
};
