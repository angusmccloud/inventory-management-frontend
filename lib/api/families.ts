/**
 * Family API Client - Inventory HQ Frontend
 *
 * API client methods for family management operations.
 */

import { apiClient } from '../api-client';
import {
  Family,
  CreateFamilyRequest,
  UpdateFamilyRequest,
  MemberRole,
  MemberStatus,
} from '@/types/entities';

/**
 * User family membership info
 */
export interface UserFamilyMembership {
  familyId: string;
  role: MemberRole;
  status: MemberStatus;
}

/**
 * List all families the current user is a member of
 */
export const listUserFamilies = async (): Promise<UserFamilyMembership[]> => {
  const response = await apiClient.get<{ families: UserFamilyMembership[] }>(
    '/user/families',
    true
  );
  return response.families;
};

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
