/**
 * Notifications Page - Inventory HQ
 *
 * Displays low-stock notifications with filtering and acknowledge functionality.
 */

'use client';

import { useCallback, useEffect, useState } from 'react';
import NotificationList from '@/components/notifications/NotificationList';
import EditItemForm from '@/components/inventory/EditItemForm';
import { listNotifications, resolveNotification } from '@/lib/api/notifications';
import { addToShoppingList } from '@/lib/api/shoppingList';
import { listInventoryItems } from '@/lib/api/inventory';
import { listUserFamilies } from '@/lib/api/families';
import { getUserContext, setUserContext as saveUserContext } from '@/lib/auth';
import { getErrorMessage, isApiClientError } from '@/lib/api-client';
import { LowStockNotification, InventoryItem } from '@/types/entities';
import type { UserContext } from '@/types/entities';
import { PageLoading, PageContainer, PageHeader, Text, ToggleButton } from '@/components/common';
import { useSnackbar } from '@/contexts/SnackbarContext';

export default function NotificationsPage() {
  const { showSnackbar } = useSnackbar();
  const [notifications, setNotifications] = useState<LowStockNotification[]>([]);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userContext, setUserContext] = useState<UserContext | null>(null);
  const [acknowledging, setAcknowledging] = useState<string | null>(null);
  const [showArchive, setShowArchive] = useState<boolean>(false);
  const [displayedNotifications, setDisplayedNotifications] = useState<LowStockNotification[]>([]);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [activeItemIds, setActiveItemIds] = useState<Set<string>>(new Set());

  // Load user context
  useEffect(() => {
    const context = getUserContext();
    setUserContext(context);

    // Fetch the actual role from family membership
    const loadUserRole = async () => {
      try {
        const families = await listUserFamilies();
        if (families && families.length > 0 && families[0] && context) {
          const family = families[0];
          const updatedContext = {
            ...context,
            familyId: family.familyId,
            role: family.role as 'admin' | 'suggester',
          };
          saveUserContext(updatedContext);
          setUserContext(updatedContext);
        }
      } catch (error) {
        console.error('Failed to load user role:', error);
      }
    };

    loadUserRole();
  }, []);

  // Fetch notifications and inventory items
  const fetchNotifications = useCallback(async () => {
    if (!userContext?.familyId) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Fetch notifications and active inventory items (listInventoryItems returns only active items)
      const [notificationsData, inventoryData] = await Promise.all([
        listNotifications(userContext.familyId),
        listInventoryItems(userContext.familyId),
      ]);

      // Create a set of active item IDs. If an item isn't returned it's considered archived.
      const activeIdsSet = new Set((inventoryData.items || []).map((item) => item.itemId));

      // Keep only notifications for items that are active
      const activeNotifications = notificationsData.filter((notification) =>
        activeIdsSet.has(notification.itemId)
      );

      setNotifications(activeNotifications);
      // Apply current archive toggle to determine which notifications to show.
      setDisplayedNotifications(
        showArchive
          ? activeNotifications
          : activeNotifications.filter((n) => n.status !== 'resolved')
      );
      // Inventory items returned are active; use them directly for the edit modal
      setInventoryItems(inventoryData.items || []);
      // Persist active item ids for header counters
      setActiveItemIds(activeIdsSet);
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      // Set empty array on error so UI still renders
      setNotifications([]);
      setInventoryItems([]);
      setActiveItemIds(new Set());
    } finally {
      setLoading(false);
    }
  }, [userContext?.familyId]);

  // Fetch notifications when user context is available
  useEffect(() => {
    if (userContext?.familyId) {
      fetchNotifications();
    }
  }, [userContext?.familyId, fetchNotifications]);

  // Log errors for visibility (error state is set but not directly rendered)
  useEffect(() => {
    if (error) {
      console.error('Notifications page error:', error);
    }
  }, [error]);

  // Handle add to shopping list
  const handleAddToShoppingList = async (notification: LowStockNotification) => {
    if (!userContext?.familyId) {
      return;
    }

    setAcknowledging(notification.notificationId);

    try {
      // Add to shopping list
      await addToShoppingList(userContext.familyId, {
        itemId: notification.itemId,
        name: notification.itemName,
        quantity: 1,
        notes: null,
      });

      // Automatically resolve the notification (whether it was added or already existed)
      const updatedNotification = await resolveNotification(
        userContext.familyId,
        notification.notificationId
      );

      // Update notifications and refresh displayed list according to current archive toggle
      setNotifications((prev) => {
        const newNotifs = prev.map((n) =>
          n.notificationId === notification.notificationId ? updatedNotification : n
        );
        setDisplayedNotifications(
          showArchive ? newNotifs : newNotifs.filter((n) => n.status !== 'resolved')
        );
        return newNotifs;
      });

      showSnackbar({
        variant: 'success',
        text: `${notification.itemName} added to shopping list`,
      });
    } catch (err) {
      // On any failure to add to shopping list, attempt to resolve the notification
      // so the low-stock notification does not remain open if the intent was satisfied.
      try {
        const updatedNotification = await resolveNotification(
          userContext.familyId,
          notification.notificationId
        );

        // Update notifications and refresh displayed list according to current archive toggle
        setNotifications((prev) => {
          const newNotifs = prev.map((n) =>
            n.notificationId === notification.notificationId ? updatedNotification : n
          );
          setDisplayedNotifications(
            showArchive ? newNotifs : newNotifs.filter((n) => n.status !== 'resolved')
          );
          return newNotifs;
        });

        // If the original error was a duplicate, show a warning; otherwise inform user we resolved anyway
        if (isApiClientError(err) && err.statusCode === 409) {
          showSnackbar({
            variant: 'warning',
            text: `${notification.itemName} is already in shopping list`,
          });
        } else {
          const origMessage = getErrorMessage(err);
          showSnackbar({
            variant: 'warning',
            text: `Failed to add to shopping list: ${origMessage}. Notification resolved anyway.`,
          });
        }
      } catch (resolveErr) {
        // If resolving also failed, show the original add error if available, otherwise show resolve error
        const addMessage = getErrorMessage(err);
        const resolveMessage = getErrorMessage(resolveErr);
        showSnackbar({
          variant: 'error',
          text: `Failed to add to shopping list (${addMessage}) and failed to resolve notification (${resolveMessage})`,
        });
      }
    } finally {
      setAcknowledging(null);
    }
  };

  // Handle edit item (reconcile)
  const handleEditItem = (notification: LowStockNotification) => {
    // Find the inventory item
    const item = inventoryItems.find((i) => i.itemId === notification.itemId);
    if (item) {
      setEditingItem(item);
    }
  };

  // Handle item updated from edit modal
  const handleItemUpdated = async (updatedItem: InventoryItem) => {
    // Reference updatedItem to avoid unused variable TypeScript error
    void updatedItem;

    setEditingItem(null);

    // Refresh notifications to reflect any changes
    await fetchNotifications();

    showSnackbar({
      variant: 'success',
      text: 'Item updated successfully',
    });
  };

  const isAdmin = userContext?.role === 'admin';

  // `displayedNotifications` is computed on page load and when the toggle is pressed.
  // When resolving/acknowledging single items we intentionally do NOT reapply this filter.

  // Count notifications by status, only for active items
  const activeCount = notifications.filter(
    (n) => activeItemIds.has(n.itemId) && n.status === 'active'
  ).length;
  const acknowledgedCount = notifications.filter(
    (n) => activeItemIds.has(n.itemId) && n.status === 'acknowledged'
  ).length;
  const resolvedCount = notifications.filter(
    (n) => activeItemIds.has(n.itemId) && n.status === 'resolved'
  ).length;

  // Reference counts to avoid unused variable TypeScript errors
  void activeCount;
  void acknowledgedCount;
  void resolvedCount;

  if (loading) {
    return <PageLoading message="Loading notifications..." fullHeight={false} />;
  }

  return (
    <PageContainer>
      {/* Page header with toggle */}
      <PageHeader
        title="Low Stock Notifications"
        // description={`${activeCount} active, ${acknowledgedCount} acknowledged, ${resolvedCount} resolved`}
        action={
          <ToggleButton
            checked={showArchive}
            onChange={(val: boolean) => {
              // Update toggle and recompute displayed list based on current notifications
              setShowArchive(val);
              setDisplayedNotifications(
                val ? notifications : notifications.filter((n) => n.status !== 'resolved')
              );
            }}
            label="Show Resolved"
            visibleLabel="Show Resolved"
            variant="primary"
            size="md"
          />
        }
      />

      {/* Notification list */}
      {!loading && (
        <NotificationList
          notifications={displayedNotifications}
          onAddToShoppingList={handleAddToShoppingList}
          onEdit={handleEditItem}
          isAdmin={isAdmin}
          processingId={acknowledging}
        />
      )}

      {/* Per-row processing indicated by disabling buttons; no global overlay */}

      {/* Edit Item Modal */}
      {editingItem && userContext?.familyId && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center px-4 text-center sm:p-0">
            {/* Background overlay */}
            <div
              className="fixed inset-0 bg-surface-elevated bg-opacity-75 transition-opacity dark:bg-opacity-80"
              onClick={() => setEditingItem(null)}
            />

            {/* Modal panel */}
            <div className="relative inline-block w-[90%] max-w-full transform overflow-hidden rounded-lg bg-surface px-4 pb-4 pt-5 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 sm:align-middle">
              <div>
                <Text variant="h3" className="mb-4 text-text-default">
                  Edit Item
                </Text>

                <EditItemForm
                  familyId={userContext.familyId}
                  item={editingItem}
                  onSuccess={handleItemUpdated}
                  onCancel={() => setEditingItem(null)}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
}
