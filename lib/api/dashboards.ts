/**
 * Dashboard API Client
 * Feature: 014-inventory-dashboards
 * 
 * API client methods for dashboard operations (both authenticated admin and unauthenticated public).
 */

import { apiClient } from '../api-client';
import {
  DashboardWithItems,
  DashboardListItem,
  CreateDashboardInput,
  UpdateDashboardInput,
  AdjustQuantityRequest,
  AdjustQuantityResponse,
  DashboardRotationResponse,
} from '@/types/dashboard';

/**
 * Get dashboard with items for public viewing (unauthenticated)
 * 
 * @param dashboardId - Dashboard ID in format {familyId}_{randomString}
 * @returns Dashboard with items
 */
export const getDashboardPublic = async (
  dashboardId: string
): Promise<DashboardWithItems> => {
  return apiClient.get<DashboardWithItems>(`/d/${dashboardId}`, false);
};

/**
 * Adjust item quantity from dashboard (unauthenticated)
 * 
 * @param dashboardId - Dashboard ID
 * @param itemId - Item UUID
 * @param adjustment - Quantity adjustment (positive or negative)
 * @returns Adjustment response with new quantity and message
 */
export const adjustDashboardItemQuantity = async (
  dashboardId: string,
  itemId: string,
  adjustment: number
): Promise<AdjustQuantityResponse> => {
  const data: AdjustQuantityRequest = { adjustment };
  return apiClient.post<AdjustQuantityResponse>(
    `/api/public/dashboards/${dashboardId}/items/${itemId}/adjust`,
    data,
    false // Unauthenticated
  );
};

/**
 * Record dashboard access for analytics (unauthenticated)
 * 
 * @param dashboardId - Dashboard ID
 */
export const recordDashboardAccess = async (dashboardId: string): Promise<void> => {
  try {
    await apiClient.post(`/d/${dashboardId}/access`, {}, false);
  } catch (error) {
    // Silent fail - don't block dashboard viewing if analytics fail
    console.error('Failed to record dashboard access:', error);
  }
};

/**
 * List all dashboards for a family (authenticated admin only)
 * 
 * @param includeInactive - Whether to include inactive dashboards
 * @returns Array of dashboard list items
 */
export const listDashboards = async (
  includeInactive: boolean = false
): Promise<DashboardListItem[]> => {
  const params = new URLSearchParams();
  if (includeInactive) {
    params.append('includeInactive', 'true');
  }
  
  const queryString = params.toString();
  const url = `/api/dashboards${queryString ? `?${queryString}` : ''}`;
  
  const response = await apiClient.get<{ dashboards: DashboardListItem[] }>(
    url,
    true // Authenticated
  );
  
  return response.dashboards;
};

/**
 * Get dashboard details (authenticated admin only)
 * 
 * @param dashboardId - Dashboard ID
 * @returns Dashboard details
 */
export const getDashboard = async (dashboardId: string): Promise<DashboardWithItems> => {
  return apiClient.get<DashboardWithItems>(`/api/dashboards/${dashboardId}`, true);
};

/**
 * Create new dashboard (authenticated admin only)
 * 
 * @param data - Create dashboard input
 * @returns Created dashboard
 */
export const createDashboard = async (
  data: CreateDashboardInput
): Promise<DashboardWithItems> => {
  return apiClient.post<DashboardWithItems>('/api/dashboards', data, true);
};

/**
 * Update dashboard configuration (authenticated admin only)
 * 
 * @param data - Update dashboard input with dashboardId
 * @returns Updated dashboard
 */
export const updateDashboard = async (
  data: UpdateDashboardInput
): Promise<DashboardWithItems> => {
  const { dashboardId, ...updateData } = data;
  return apiClient.patch<DashboardWithItems>(
    `/api/dashboards/${dashboardId}`,
    updateData,
    true
  );
};

/**
 * Delete dashboard (authenticated admin only)
 * 
 * @param dashboardId - Dashboard ID to delete
 */
export const deleteDashboard = async (dashboardId: string): Promise<void> => {
  await apiClient.delete(`/api/dashboards/${dashboardId}`, true);
};

/**
 * Rotate dashboard URL (authenticated admin only)
 * Creates new dashboard with same config, deactivates old one
 * 
 * @param dashboardId - Dashboard ID to rotate
 * @returns Rotation response with old and new dashboard IDs
 */
export const rotateDashboard = async (
  dashboardId: string
): Promise<DashboardRotationResponse> => {
  return apiClient.post<DashboardRotationResponse>(
    `/api/dashboards/${dashboardId}/rotate`,
    {},
    true
  );
};
