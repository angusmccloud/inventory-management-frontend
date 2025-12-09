/**
 * Entity Type Definitions - Family Inventory Management System Frontend
 * 
 * Shared TypeScript types for frontend components.
 * These mirror the backend entity types but are simplified for client use.
 */

/**
 * Member role within a family
 */
export type MemberRole = 'admin' | 'suggester';

/**
 * Member status
 */
export type MemberStatus = 'active' | 'removed';

/**
 * Inventory item status
 */
export type ItemStatus = 'active' | 'archived';

/**
 * Notification type
 */
export type NotificationType = 'low_stock' | 'system' | 'suggestion_response';

/**
 * Notification status
 */
export type NotificationStatus = 'unread' | 'read';

/**
 * Suggestion status
 */
export type SuggestionStatus = 'pending' | 'approved' | 'rejected';

/**
 * Suggestion type
 */
export type SuggestionType = 'add_item' | 'add_to_shopping_list' | 'other';

/**
 * Family Entity
 */
export interface Family {
  familyId: string;
  name: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Member Entity
 */
export interface Member {
  memberId: string;
  familyId: string;
  email: string;
  name: string;
  role: MemberRole;
  status: MemberStatus;
  createdAt: string;
  updatedAt: string;
}

/**
 * InventoryItem Entity
 */
export interface InventoryItem {
  itemId: string;
  familyId: string;
  name: string;
  quantity: number;
  unit?: string;
  locationId?: string;
  locationName?: string;
  preferredStoreId?: string;
  preferredStoreName?: string;
  lowStockThreshold: number;
  status: ItemStatus;
  notes?: string;
  createdBy: string;
  lastModifiedBy: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * StorageLocation Entity
 */
export interface StorageLocation {
  locationId: string;
  familyId: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Store Entity
 */
export interface Store {
  storeId: string;
  familyId: string;
  name: string;
  address?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * ShoppingListItem Entity
 */
export interface ShoppingListItem {
  shoppingItemId: string;
  familyId: string;
  inventoryItemId?: string;
  itemName: string;
  quantity: number;
  unit?: string;
  storeId?: string;
  storeName?: string;
  isPurchased: boolean;
  addedBy: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Notification Entity
 */
export interface Notification {
  notificationId: string;
  familyId: string;
  recipientId: string;
  type: NotificationType;
  status: NotificationStatus;
  title: string;
  message: string;
  relatedItemId?: string;
  relatedItemType?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Suggestion Entity
 */
export interface Suggestion {
  suggestionId: string;
  familyId: string;
  suggestedBy: string;
  type: SuggestionType;
  status: SuggestionStatus;
  itemName: string;
  quantity?: number;
  unit?: string;
  locationId?: string;
  storeId?: string;
  notes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  reviewNotes?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * API Request Types
 */

export interface CreateFamilyRequest {
  name: string;
}

export interface UpdateFamilyRequest {
  name: string;
}

export interface AddMemberRequest {
  email: string;
  name: string;
  role: MemberRole;
}

export interface CreateInventoryItemRequest {
  name: string;
  quantity: number;
  unit?: string;
  locationId?: string;
  preferredStoreId?: string;
  lowStockThreshold: number;
  notes?: string;
}

export interface UpdateInventoryItemRequest {
  name?: string;
  quantity?: number;
  unit?: string;
  locationId?: string;
  preferredStoreId?: string;
  lowStockThreshold?: number;
  notes?: string;
  status?: ItemStatus;
}

export interface AdjustQuantityRequest {
  adjustment: number;
}

export interface CreateStorageLocationRequest {
  name: string;
  description?: string;
}

export interface UpdateStorageLocationRequest {
  name?: string;
  description?: string;
}

export interface CreateStoreRequest {
  name: string;
  address?: string;
  notes?: string;
}

export interface UpdateStoreRequest {
  name?: string;
  address?: string;
  notes?: string;
}

export interface AddToShoppingListRequest {
  inventoryItemId?: string;
  itemName: string;
  quantity: number;
  unit?: string;
  storeId?: string;
  notes?: string;
}

export interface UpdateShoppingListItemRequest {
  quantity?: number;
  isPurchased?: boolean;
  notes?: string;
}

export interface CreateSuggestionRequest {
  type: SuggestionType;
  itemName: string;
  quantity?: number;
  unit?: string;
  locationId?: string;
  storeId?: string;
  notes?: string;
}

export interface ReviewSuggestionRequest {
  reviewNotes?: string;
}

/**
 * API Response Types
 */

export interface ListInventoryResponse {
  items: InventoryItem[];
  total: number;
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export interface ApiSuccess<T> {
  data: T;
  message?: string;
}

/**
 * User Context from Cognito
 */
export interface UserContext {
  memberId: string;
  familyId: string;
  role: MemberRole;
  email: string;
  name?: string;
}
