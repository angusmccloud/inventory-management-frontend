/**
 * Settings Page - User Preferences and Reference Data
 * 
 * Consolidated settings page with tabs for:
 * - Members: Family member and invitation management
 * - App Theme: Theme preferences
 * - Manage Stores: Store/vendor management
 * - Manage Storage Locations: Storage location management
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getUserContext } from '@/lib/auth';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { TabNavigation, Card, PageLoading, Text, LoadingSpinner, Button, PageHeader, PageContainer } from '@/components/common';
import type { Tab } from '@/components/common/TabNavigation/TabNavigation.types';
import type { UserContext, StorageLocation, Store, Member, Invitation, MemberRole, ListMembersResponse } from '@/types/entities';
import StorageLocationList from '@/components/reference-data/StorageLocationList';
import StorageLocationForm from '@/components/reference-data/StorageLocationForm';
import StoreList from '@/components/reference-data/StoreList';
import StoreForm from '@/components/reference-data/StoreForm';
import ReferenceDataEmptyState from '@/components/reference-data/ReferenceDataEmptyState';
import { MemberList } from '@/components/members/MemberList';
import { InvitationList } from '@/components/members/InvitationList';
import { InviteMemberForm } from '@/components/members/InviteMemberForm';
import { RemoveMemberDialog } from '@/components/members/RemoveMemberDialog';
import {
  listStorageLocations,
  createStorageLocation,
  updateStorageLocation,
  deleteStorageLocation,
  listStores,
  createStore,
  updateStore,
  deleteStore,
} from '@/lib/api/reference-data';
import { listMembers, updateMember, removeMember } from '@/lib/api/members';
import {
  listInvitations,
  createInvitation,
  revokeInvitation,
} from '@/lib/api/invitations';
import { getErrorMessage } from '@/lib/api-client';
import { useSnackbar } from '@/contexts/SnackbarContext';

type DialogState = 
  | { type: 'none' }
  | { type: 'create-location' }
  | { type: 'edit-location'; location: StorageLocation }
  | { type: 'create-store' }
  | { type: 'edit-store'; store: Store }
  | { type: 'invite-member' };

export default function SettingsPage() {
  const router = useRouter();
  const { showSnackbar } = useSnackbar();
  const [userContext, setUserContext] = useState<UserContext | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('members');
  
  // Reference data state
  const [locations, setLocations] = useState<StorageLocation[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [loadingData, setLoadingData] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Members state
  const [members, setMembers] = useState<Member[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [summary, setSummary] = useState<ListMembersResponse['summary'] | null>(null);
  const [memberToRemove, setMemberToRemove] = useState<Member | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);
  
  // Dialog state
  const [dialogState, setDialogState] = useState<DialogState>({ type: 'none' });

  // Handle URL query parameter for tab selection
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const tabParam = searchParams.get('tab');
    if (tabParam && ['members', 'theme', 'stores', 'locations'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, []);

  useEffect(() => {
    const context = getUserContext();
    if (!context) {
      router.push('/login');
      return;
    }
    setUserContext(context);
    setLoading(false);
  }, [router]);

  // Load reference data when user context is available
  const loadData = useCallback(async () => {
    if (!userContext?.familyId) return;
    
    setLoadingData(true);
    setError(null);
    try {
      const [locationsData, storesData, membersData, invitationsData] = await Promise.all([
        listStorageLocations(userContext.familyId),
        listStores(userContext.familyId),
        listMembers(userContext.familyId, false),
        listInvitations(userContext.familyId, 'pending'),
      ]);
      setLocations(locationsData);
      setStores(storesData);
      setMembers(membersData.members);
      setSummary(membersData.summary);
      setInvitations(invitationsData);
    } catch (err) {
      setError('Failed to load data. Please try again.');
      console.error('Failed to load data:', err);
    } finally {
      setLoadingData(false);
    }
  }, [userContext?.familyId]);

  useEffect(() => {
    if (userContext?.familyId) {
      loadData();
    }
  }, [userContext?.familyId, loadData]);

  // Storage Location handlers
  const handleCreateLocation = async (data: { name: string; description?: string }, keepModalOpen: boolean = false) => {
    if (!userContext?.familyId) return;
    
    const newLocation = await createStorageLocation(userContext.familyId, data);
    setLocations((prev) => [...prev, newLocation]);
    
    // Only close modal if not quick-adding
    if (!keepModalOpen) {
      setDialogState({ type: 'none' });
    }
  };

  const handleUpdateLocation = async (data: { name: string; description?: string }) => {
    if (!userContext?.familyId || dialogState.type !== 'edit-location') return;
    
    const updated = await updateStorageLocation(
      userContext.familyId,
      dialogState.location.locationId,
      { ...data, version: dialogState.location.version }
    );
    setLocations((prev) =>
      prev.map((loc) => (loc.locationId === updated.locationId ? updated : loc))
    );
    setDialogState({ type: 'none' });
  };

  const handleDeleteLocation = async (locationId: string) => {
    if (!userContext?.familyId) return;
    
    try {
      await deleteStorageLocation(userContext.familyId, locationId);
      setLocations((prev) => prev.filter((loc) => loc.locationId !== locationId));
      showSnackbar({ variant: 'success', text: 'Storage location archived successfully' });
    } catch (err) {
      showSnackbar({ variant: 'error', text: getErrorMessage(err) });
      throw err;
    }
  };

  // Store handlers
  const handleCreateStore = async (data: { name: string; address?: string }, keepModalOpen: boolean = false) => {
    if (!userContext?.familyId) return;
    
    const newStore = await createStore(userContext.familyId, data);
    setStores((prev) => [...prev, newStore]);
    
    // Only close modal if not quick-adding
    if (!keepModalOpen) {
      setDialogState({ type: 'none' });
    }
  };

  const handleUpdateStore = async (data: { name: string; address?: string }) => {
    if (!userContext?.familyId || dialogState.type !== 'edit-store') return;
    
    const updated = await updateStore(
      userContext.familyId,
      dialogState.store.storeId,
      { ...data, version: dialogState.store.version }
    );
    setStores((prev) =>
      prev.map((store) => (store.storeId === updated.storeId ? updated : store))
    );
    setDialogState({ type: 'none' });
  };

  const handleDeleteStore = async (storeId: string) => {
    if (!userContext?.familyId) return;
    
    try {
      await deleteStore(userContext.familyId, storeId);
      setStores((prev) => prev.filter((store) => store.storeId !== storeId));
      showSnackbar({ variant: 'success', text: 'Store archived successfully' });
    } catch (err) {
      showSnackbar({ variant: 'error', text: getErrorMessage(err) });
      throw err;
    }
  };

  // Member handlers
  const handleInviteMember = async (email: string, role: MemberRole) => {
    if (!userContext?.familyId) return;

    try {
      await createInvitation(userContext.familyId, { email, role });
      showSnackbar({ variant: 'success', text: `Invitation sent to ${email}` });
      setDialogState({ type: 'none' });

      // Refresh invitations
      const invitationsData = await listInvitations(userContext.familyId, 'pending');
      setInvitations(invitationsData);
    } catch (err) {
      throw err; // Let the form handle the error
    }
  };

  const handleRevokeInvitation = async (invitationId: string) => {
    if (!userContext?.familyId) return;

    try {
      await revokeInvitation(userContext.familyId, invitationId);
      showSnackbar({ variant: 'success', text: 'Invitation revoked' });

      // Refresh invitations
      const invitationsData = await listInvitations(userContext.familyId, 'pending');
      setInvitations(invitationsData);
    } catch (err) {
      showSnackbar({ variant: 'error', text: getErrorMessage(err) });
    }
  };

  const handleUpdateRole = async (memberId: string, newRole: MemberRole) => {
    if (!userContext?.familyId) return;

    const member = members.find((m) => m.memberId === memberId);
    if (!member) return;

    try {
      const updatedMember = await updateMember(userContext.familyId, memberId, {
        role: newRole,
        version: member.version,
      });

      // Update local state
      setMembers((prev) =>
        prev.map((m) => (m.memberId === memberId ? updatedMember : m))
      );

      showSnackbar({ variant: 'success', text: `Role updated to ${newRole}` });

      // Refresh to update summary
      await loadData();
    } catch (err) {
      showSnackbar({ variant: 'error', text: getErrorMessage(err) });
    }
  };

  const handleRemoveMember = (memberId: string) => {
    const member = members.find((m) => m.memberId === memberId);
    if (member) {
      setMemberToRemove(member);
    }
  };

  const confirmRemoveMember = async () => {
    if (!userContext?.familyId || !memberToRemove) return;

    setIsRemoving(true);

    try {
      await removeMember(userContext.familyId, memberToRemove.memberId, memberToRemove.version);

      // If removing self, clear user context and redirect
      if (memberToRemove.memberId === userContext.memberId) {
        localStorage.removeItem('user_context');
        router.push('/dashboard');
        return;
      }

      showSnackbar({ variant: 'success', text: `${memberToRemove.name} removed from family` });
      setMemberToRemove(null);

      // Refresh members
      await loadData();
    } catch (err) {
      showSnackbar({ variant: 'error', text: getErrorMessage(err) });
    } finally {
      setIsRemoving(false);
    }
  };

  if (loading) {
    return <PageLoading message="Loading settings..." />;
  }

  if (!userContext) {
    return null;
  }

  const isAdmin = userContext.role === 'admin';
  const isLastAdmin = summary ? summary.admins === 1 && userContext.role === 'admin' : false;

  const tabs: Tab[] = [
    { id: 'members', label: 'Members', badge: summary?.total },
    { id: 'theme', label: 'App Theme' },
    { id: 'stores', label: 'Manage Stores', badge: stores.length },
    { id: 'locations', label: 'Manage Storage Locations', badge: locations.length },
  ];

  return (
    <PageContainer>
        {/* Header */}
        <PageHeader
          title="Settings"
          description={`Manage your personal preferences and family reference data${!isAdmin ? ' (Reference data is view-only for suggesters)' : ''}`}
        />

      {/* Error Message */}
      {error && (
        <div className="mb-6 rounded-md bg-error/10 p-4">
          <Text variant="bodySmall" color="error">{error}</Text>
        </div>
      )}

      {/* Tab Navigation */}
      <TabNavigation
        tabs={tabs}
        activeTab={activeTab}
        onChange={setActiveTab}
        responsiveMode="auto"
      />

      {/* Tab Content */}
      <div className="mt-6">
        {/* Members Tab */}
        {activeTab === 'members' && (
          <div>
            {loadingData ? (
              <div className="flex flex-col items-center justify-center py-12">
                <LoadingSpinner size="lg" />
                <Text variant="body" className="mt-4 text-text-secondary">
                  Loading members...
                </Text>
              </div>
            ) : (
              <>
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <Text variant="h3" className="text-text-default mb-1">
                      Family Members
                    </Text>
                    {summary && (
                      <Text variant="bodySmall" color="secondary">
                        {summary.total} member{summary.total !== 1 ? 's' : ''} ({summary.admins} admin{summary.admins !== 1 ? 's' : ''}, {summary.suggesters} suggester{summary.suggesters !== 1 ? 's' : ''})
                      </Text>
                    )}
                  </div>
                  {isAdmin && (
                    <Button
                      variant="primary"
                      onClick={() => setDialogState({ type: 'invite-member' })}
                    >
                      + Invite Member
                    </Button>
                  )}
                </div>

                {/* Active Members Section */}
                {isAdmin && invitations.length > 0 && (
                  <Text variant="h4" className="text-text-default mb-4">
                    Active Members
                  </Text>
                )}

                <MemberList
                  members={members}
                  currentUserId={userContext.memberId}
                  onUpdateRole={isAdmin ? handleUpdateRole : undefined}
                  onRemove={isAdmin ? handleRemoveMember : undefined}
                  canManage={isAdmin}
                />

                {/* Pending Invitations Section */}
                {isAdmin && invitations.length > 0 && (
                  <>
                    <Text variant="h4" className="text-text-default mt-8 mb-4">
                      Pending Invitations
                    </Text>
                    <InvitationList invitations={invitations} onRevoke={handleRevokeInvitation} />
                  </>
                )}
              </>
            )}
          </div>
        )}

        {/* Theme Tab */}
        {activeTab === 'theme' && (
          <div className="rounded-lg border border-border bg-surface p-6">
            <h2 className="text-lg font-semibold text-text-default mb-4">Appearance</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-default mb-2">
                  Theme
                </label>
                <Text variant="bodySmall" color="secondary" className="mb-3">
                  Choose how the interface looks. Auto mode follows your system preference.
                </Text>
                <ThemeToggle />
              </div>
            </div>
          </div>
        )}

        {/* Stores Tab */}
        {activeTab === 'stores' && (
          <div>
            {loadingData ? (
              <div className="flex flex-col items-center justify-center py-12">
                <LoadingSpinner size="lg" />
                <Text variant="body" className="mt-4 text-text-secondary">
                  Loading stores...
                </Text>
              </div>
            ) : (
              <>
                {isAdmin && (
                  <div className="mb-4">
                    <Button
                      variant="primary"
                      onClick={() => setDialogState({ type: 'create-store' })}
                    >
                      Add Store
                    </Button>
                  </div>
                )}
                {stores.length === 0 ? (
                  <ReferenceDataEmptyState 
                    type="stores" 
                    onAdd={() => setDialogState({ type: 'create-store' })}
                  />
                ) : (
                  <StoreList
                    stores={stores}
                    onEdit={(store) => setDialogState({ type: 'edit-store', store })}
                    onDelete={handleDeleteStore}
                  />
                )}
              </>
            )}
          </div>
        )}

        {/* Storage Locations Tab */}
        {activeTab === 'locations' && (
          <div>
            {loadingData ? (
              <div className="flex flex-col items-center justify-center py-12">
                <LoadingSpinner size="lg" />
                <Text variant="body" className="mt-4 text-text-secondary">
                  Loading storage locations...
                </Text>
              </div>
            ) : (
              <>
                {isAdmin && (
                  <div className="mb-4">
                    <Button
                      variant="primary"
                      onClick={() => setDialogState({ type: 'create-location' })}
                    >
                      Add Storage Location
                    </Button>
                  </div>
                )}
                {locations.length === 0 ? (
                  <ReferenceDataEmptyState 
                    type="locations" 
                    onAdd={() => setDialogState({ type: 'create-location' })}
                  />
                ) : (
                  <StorageLocationList
                    locations={locations}
                    onEdit={(location) => setDialogState({ type: 'edit-location', location })}
                    onDelete={handleDeleteLocation}
                  />
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Storage Location Form Dialog */}
      {(dialogState.type === 'create-location' || dialogState.type === 'edit-location') && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
            <div className="fixed inset-0 bg-surface-elevated bg-opacity-75 dark:bg-opacity-80 transition-opacity" onClick={() => setDialogState({ type: 'none' })} />
            <div className="relative w-[90%] max-w-full transform overflow-hidden rounded-lg bg-surface px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
              <h3 className="mb-4 text-lg font-semibold text-text-default">
                {dialogState.type === 'create-location' ? 'Add Storage Location' : 'Edit Storage Location'}
              </h3>
              <StorageLocationForm
                familyId={userContext.familyId}
                onSubmit={dialogState.type === 'create-location' ? handleCreateLocation : handleUpdateLocation}
                onCancel={() => setDialogState({ type: 'none' })}
                initialData={dialogState.type === 'edit-location' ? dialogState.location : undefined}
              />
            </div>
          </div>
        </div>
      )}

      {/* Store Form Dialog */}
      {(dialogState.type === 'create-store' || dialogState.type === 'edit-store') && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
            <div className="fixed inset-0 bg-surface-elevated bg-opacity-75 dark:bg-opacity-80 transition-opacity" onClick={() => setDialogState({ type: 'none' })} />
            <div className="relative w-[90%] max-w-full transform overflow-hidden rounded-lg bg-surface px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
              <h3 className="mb-4 text-lg font-semibold text-text-default">
                {dialogState.type === 'create-store' ? 'Add Store' : 'Edit Store'}
              </h3>
              <StoreForm
                familyId={userContext.familyId}
                onSubmit={dialogState.type === 'create-store' ? handleCreateStore : handleUpdateStore}
                onCancel={() => setDialogState({ type: 'none' })}
                initialData={dialogState.type === 'edit-store' ? dialogState.store : undefined}
              />
            </div>
          </div>
        </div>
      )}

      {/* Invite Member Dialog */}
      {dialogState.type === 'invite-member' && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setDialogState({ type: 'none' });
            }
          }}
        >
          <div className="bg-surface rounded-lg shadow-xl border border-border w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <Text variant="h2" className="text-text-default mb-6">
                Invite New Member
              </Text>
              <InviteMemberForm
                onSubmit={handleInviteMember}
                onCancel={() => setDialogState({ type: 'none' })}
              />
            </div>
          </div>
        </div>
      )}

      {/* Remove Member Dialog */}
      <RemoveMemberDialog
        member={memberToRemove}
        isOpen={!!memberToRemove}
        onConfirm={confirmRemoveMember}
        onCancel={() => setMemberToRemove(null)}
        isRemoving={isRemoving}
        isSelfRemoval={memberToRemove?.memberId === userContext.memberId}
        isLastAdmin={isLastAdmin && memberToRemove?.memberId === userContext.memberId}
      />
    </PageContainer>
  );
}
