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
 * Notification type (legacy - for general notifications)
 */
export type NotificationType = 'low_stock' | 'system' | 'suggestion_response';

/**
 * Notification status (legacy - for general notifications)
 */
export type NotificationStatus = 'unread' | 'read';

/**
 * Low-stock notification type
 */
export type LowStockNotificationType = 'low_stock';

/**
 * Low-stock notification status
 */
export type LowStockNotificationStatus = 'active' | 'resolved' | 'acknowledged';

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
  version: number; // Optimistic locking
  createdAt: string;
  updatedAt: string;
}

/**
 * Invitation Status
 */
export type InvitationStatus = 'pending' | 'accepted' | 'expired' | 'revoked';

/**
 * Invitation Entity
 */
export interface Invitation {
  invitationId: string;
  familyId: string;
  email: string;
  role: MemberRole;
  status: InvitationStatus;
  expiresAt: string;
  invitedBy: string;
  invitedByName?: string;
  acceptedBy: string | null;
  acceptedAt: string | null;
  revokedBy: string | null;
  revokedAt: string | null;
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
 * Notification Entity (legacy - for general notifications)
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
 * Low-Stock Notification Entity
 * Represents an alert when inventory items fall below thresholds
 */
export interface LowStockNotification {
  notificationId: string;
  familyId: string;
  itemId: string;
  itemName: string;
  type: LowStockNotificationType;
  status: LowStockNotificationStatus;
  currentQuantity: number;
  threshold: number;
  createdAt: string;
  updatedAt: string;
  resolvedAt: string | null;
}

/**
 * List notifications response
 */
export interface ListNotificationsResponse {
  notifications: LowStockNotification[];
  total: number;
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

export interface CreateInvitationRequest {
  email: string;
  role: MemberRole;
}

export interface AcceptInvitationRequest {
  token: string;
  name: string;
  password?: string;
}

export interface UpdateMemberRequest {
  name?: string;
  role?: MemberRole;
  version: number;
}

export interface RemoveMemberRequest {
  version: number;
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

export interface ListMembersResponse {
  members: Member[];
  summary: {
    total: number;
    admins: number;
    suggesters: number;
  };
}

export interface ListInvitationsResponse {
  invitations: Invitation[];
}

export interface AcceptInvitationResponse {
  member: Member;
  family: Family;
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
