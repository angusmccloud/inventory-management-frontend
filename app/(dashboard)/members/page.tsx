/**
 * Members Page
 * Feature: 003-member-management
 * 
 * Displays family members and pending invitations with management controls
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Member,
  Invitation,
  MemberRole,
  ListMembersResponse,
} from '@/types/entities';
import { listMembers, updateMember, removeMember } from '@/lib/api/members';
import {
  listInvitations,
  createInvitation,
  revokeInvitation,
} from '@/lib/api/invitations';
import { getErrorMessage } from '@/lib/api-client';
import { MemberList } from '@/components/members/MemberList';
import { InvitationList } from '@/components/members/InvitationList';
import { InviteMemberForm } from '@/components/members/InviteMemberForm';
import { RemoveMemberDialog } from '@/components/members/RemoveMemberDialog';
import { Text, Button, Alert, PageHeader, TabNavigation, PageLoading, PageContainer } from '@/components/common';

export default function MembersPage() {
  const router = useRouter();

  // State
  const [members, setMembers] = useState<Member[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [summary, setSummary] = useState<ListMembersResponse['summary'] | null>(null);
  const [familyId, setFamilyId] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState<MemberRole>('suggester');

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [showInviteForm, setShowInviteForm] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<Member | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);

  const [activeTab, setActiveTab] = useState<'members' | 'invitations'>('members');

  // Derived state
  const isAdmin = currentUserRole === 'admin';
  const isLastAdmin = summary ? summary.admins === 1 && currentUserRole === 'admin' : false;

  // Load initial data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Get family ID from user context
      const userContextStr = localStorage.getItem('user_context');
      if (!userContextStr) {
        setError('No family selected. Please go to the dashboard first.');
        setIsLoading(false);
        return;
      }

      const userContext = JSON.parse(userContextStr);
      const storedFamilyId = userContext.familyId;
      const storedUserId = userContext.memberId;
      const storedRole = userContext.role as MemberRole;

      if (!storedFamilyId) {
        setError('No family selected. Please go to the dashboard to select a family.');
        setIsLoading(false);
        return;
      }

      setFamilyId(storedFamilyId);
      setCurrentUserId(storedUserId);
      setCurrentUserRole(storedRole || 'suggester');

      // Load members and invitations in parallel
      const [membersData, invitationsData] = await Promise.all([
        listMembers(storedFamilyId, false),
        listInvitations(storedFamilyId, 'pending'),
      ]);

      setMembers(membersData.members);
      setSummary(membersData.summary);
      setInvitations(invitationsData);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleInviteMember = async (email: string, role: MemberRole) => {
    if (!familyId) return;

    try {
      await createInvitation(familyId, { email, role });
      setSuccessMessage(`Invitation sent to ${email}`);
      setShowInviteForm(false);

      // Refresh invitations
      const invitationsData = await listInvitations(familyId, 'pending');
      setInvitations(invitationsData);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      throw err; // Let the form handle the error
    }
  };

  const handleRevokeInvitation = async (invitationId: string) => {
    if (!familyId) return;

    try {
      await revokeInvitation(familyId, invitationId);
      setSuccessMessage('Invitation revoked');

      // Refresh invitations
      const invitationsData = await listInvitations(familyId, 'pending');
      setInvitations(invitationsData);

      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleUpdateRole = async (memberId: string, newRole: MemberRole) => {
    if (!familyId) return;

    const member = members.find((m) => m.memberId === memberId);
    if (!member) return;

    try {
      const updatedMember = await updateMember(familyId, memberId, {
        role: newRole,
        version: member.version,
      });

      // Update local state
      setMembers((prev) =>
        prev.map((m) => (m.memberId === memberId ? updatedMember : m))
      );

      setSuccessMessage(`Role updated to ${newRole}`);
      setTimeout(() => setSuccessMessage(null), 3000);

      // Refresh to update summary
      await loadData();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleRemoveMember = (memberId: string) => {
    const member = members.find((m) => m.memberId === memberId);
    if (member) {
      setMemberToRemove(member);
    }
  };

  const confirmRemoveMember = async () => {
    if (!familyId || !memberToRemove) return;

    setIsRemoving(true);

    try {
      await removeMember(familyId, memberToRemove.memberId, memberToRemove.version);

      // If removing self, clear user context and redirect
      if (memberToRemove.memberId === currentUserId) {
        localStorage.removeItem('user_context');
        router.push('/dashboard');
        return;
      }

      setSuccessMessage(`${memberToRemove.name} removed from family`);
      setMemberToRemove(null);

      // Refresh members
      await loadData();

      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsRemoving(false);
    }
  };

  if (isLoading) {
    return <PageLoading message="Loading members..." fullHeight={false} />;
  }

  if (error && !familyId) {
    return (
      <PageContainer>
          <Alert severity="error">
            {error}
          </Alert>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
        {/* Header - T031: Apply mobileVertical for responsive stacking */}
      <PageHeader
        title="Family Members"
        description={summary ? `${summary.total} member${summary.total !== 1 ? 's' : ''} (${summary.admins} admin${summary.admins !== 1 ? 's' : ''}, ${summary.suggesters} suggester${summary.suggesters !== 1 ? 's' : ''})` : undefined}
        mobileVertical={true}
        action={
          isAdmin && !showInviteForm ? (
            <Button
              variant="primary"
              onClick={() => setShowInviteForm(true)}
            >
              + Invite Member
            </Button>
          ) : undefined
        }
      />

      {/* Success Message */}
      {successMessage && (
        <Alert severity="success" dismissible onDismiss={() => setSuccessMessage(null)} className="mb-6">
          {successMessage}
        </Alert>
      )}

      {/* Error Message */}
      {error && (
        <Alert severity="error" dismissible onDismiss={() => setError(null)} className="mb-6">
          {error}
        </Alert>
      )}

      {/* Invite Form */}
      {isAdmin && showInviteForm && (
        <div className="mb-6 bg-surface rounded-lg shadow-md border border-border p-6">
          <Text variant="h2" className="text-text-default mb-4">
            Invite New Member
          </Text>
          <InviteMemberForm
            onSubmit={handleInviteMember}
            onCancel={() => setShowInviteForm(false)}
          />
        </div>
      )}

      {/* Tabs */}
      <TabNavigation
        tabs={[
          { id: 'members', label: 'Active Members', badge: members.length },
          ...(isAdmin ? [{ id: 'invitations', label: 'Pending Invitations', badge: invitations.length }] : [])
        ]}
        activeTab={activeTab}
        onChange={(tabId) => setActiveTab(tabId as 'members' | 'invitations')}
        className="mb-6"
      />

      {/* Content */}
      {activeTab === 'members' && (
        <MemberList
          members={members}
          currentUserId={currentUserId || undefined}
          onUpdateRole={isAdmin ? handleUpdateRole : undefined}
          onRemove={isAdmin ? handleRemoveMember : undefined}
          canManage={isAdmin}
        />
      )}

      {activeTab === 'invitations' && isAdmin && (
        <InvitationList invitations={invitations} onRevoke={handleRevokeInvitation} />
      )}

      {/* Remove Member Dialog */}
      <RemoveMemberDialog
        member={memberToRemove}
        isOpen={!!memberToRemove}
        onConfirm={confirmRemoveMember}
        onCancel={() => setMemberToRemove(null)}
        isRemoving={isRemoving}
        isSelfRemoval={memberToRemove?.memberId === currentUserId}
        isLastAdmin={isLastAdmin && memberToRemove?.memberId === currentUserId}
      />
    </PageContainer>
  );
}

