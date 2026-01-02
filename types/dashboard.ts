/**
 * Dashboard Types - Frontend
 * Feature: 014-inventory-dashboards
 * 
 * TypeScript types for Dashboard entities on the frontend.
 * These types may differ from backend types as they represent client-facing data.
 */

/**
 * Dashboard type
 */
export type DashboardType = 'location' | 'items';

/**
 * Public dashboard data (received from API)
 */
export interface PublicDashboard {
  dashboardId: string;
  title: string;
  type: DashboardType;
  itemCount: number;
}

/**
 * Dashboard item display data
 */
export interface DashboardItem {
  itemId: string;
  name: string;
  quantity: number;
  unit?: string;
  locationId?: string;
  locationName?: string;
  lowStockThreshold?: number;
  isLowStock: boolean;
}

/**
 * Dashboard with items (from public access endpoint)
 */
export interface DashboardWithItems {
  dashboard: PublicDashboard;
  items: DashboardItem[];
}

/**
 * Dashboard list item (for admin UI)
 */
export interface DashboardListItem {
  dashboardId: string;
  title: string;
  type: DashboardType;
  isActive: boolean;
  createdAt: string;
  lastAccessedAt?: string;
  accessCount: number;
}

/**
 * Create dashboard input
 */
export interface CreateDashboardInput {
  title: string;
  type: DashboardType;
  locationIds?: string[];
  itemIds?: string[];
}

/**
 * Update dashboard input
 */
export interface UpdateDashboardInput {
  dashboardId: string;
  title?: string;
  locationIds?: string[];
  itemIds?: string[];
}

/**
 * Quantity adjustment request
 */
export interface AdjustQuantityRequest {
  adjustment: number;
}

/**
 * Quantity adjustment response
 */
export interface AdjustQuantityResponse {
  newQuantity: number;
  message: string;
}

/**
 * Dashboard rotation response
 */
export interface DashboardRotationResponse {
  oldDashboardId: string;
  newDashboard: {
    dashboardId: string;
    title: string;
    type: DashboardType;
  };
}

/**
 * Dashboard API error response
 */
export interface DashboardErrorResponse {
  error: {
    code: string;
    message: string;
  };
}
