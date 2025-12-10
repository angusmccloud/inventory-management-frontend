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
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            <div className="h-24 bg-gray-200 rounded"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !familyId) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold text-gray-900">Family Members</h1>
          {isAdmin && !showInviteForm && (
            <button
              onClick={() => setShowInviteForm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              + Invite Member
            </button>
          )}
        </div>

        {summary && (
          <p className="text-gray-600">
            {summary.total} member{summary.total !== 1 ? 's' : ''} ({summary.admins} admin
            {summary.admins !== 1 ? 's' : ''}, {summary.suggesters} suggester
            {summary.suggesters !== 1 ? 's' : ''})
          </p>
        )}
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800">{successMessage}</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Invite Form */}
      {isAdmin && showInviteForm && (
        <div className="mb-6 bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Invite New Member
          </h2>
          <InviteMemberForm
            onSubmit={handleInviteMember}
            onCancel={() => setShowInviteForm(false)}
          />
        </div>
      )}

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('members')}
              className={`${
                activeTab === 'members'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
            >
              Active Members ({members.length})
            </button>
            {isAdmin && (
              <button
                onClick={() => setActiveTab('invitations')}
                className={`${
                  activeTab === 'invitations'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
              >
                Pending Invitations ({invitations.length})
              </button>
            )}
          </nav>
        </div>
      </div>

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
    </div>
  );
}

