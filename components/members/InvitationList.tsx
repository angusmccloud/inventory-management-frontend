/**
 * InvitationList Component
 * Feature: 003-member-management
 */

'use client';

import { Invitation } from '@/types/entities';

interface InvitationListProps {
  invitations: Invitation[];
  onRevoke?: (invitationId: string) => void;
}

export function InvitationList({ invitations, onRevoke }: InvitationListProps) {
  if (invitations.length === 0) {
    return (
      <div className="text-center py-12">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No pending invitations</h3>
        <p className="mt-1 text-sm text-gray-500">
          Invite new members to start collaborating
        </p>
      </div>
    );
  }

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    accepted: 'bg-green-100 text-green-800 border-green-200',
    expired: 'bg-gray-100 text-gray-800 border-gray-200',
    revoked: 'bg-red-100 text-red-800 border-red-200',
  };

  const roleColors = {
    admin: 'bg-blue-100 text-blue-800',
    suggester: 'bg-purple-100 text-purple-800',
  };

  return (
    <div className="space-y-3">
      {invitations.map((invitation) => {
        const isExpired = new Date(invitation.expiresAt) < new Date();
        const expiresIn = Math.ceil(
          (new Date(invitation.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
        );

        return (
          <div
            key={invitation.invitationId}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="text-sm font-semibold text-gray-900">
                    {invitation.email}
                  </h4>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      roleColors[invitation.role]
                    }`}
                  >
                    {invitation.role}
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
                      statusColors[invitation.status]
                    }`}
                  >
                    {invitation.status.charAt(0).toUpperCase() +
                      invitation.status.slice(1)}
                  </span>

                  {invitation.status === 'pending' && !isExpired && (
                    <span className="text-xs text-gray-500">
                      Expires in {expiresIn} day{expiresIn !== 1 ? 's' : ''}
                    </span>
                  )}

                  {invitation.status === 'pending' && isExpired && (
                    <span className="text-xs text-red-600 font-medium">Expired</span>
                  )}
                </div>

                <p className="text-xs text-gray-500">
                  Invited by {invitation.invitedByName || 'Unknown'} on{' '}
                  {new Date(invitation.createdAt).toLocaleDateString()}
                </p>
              </div>

              {invitation.status === 'pending' && !isExpired && onRevoke && (
                <button
                  onClick={() => onRevoke(invitation.invitationId)}
                  className="ml-4 text-sm px-3 py-1 rounded border border-red-300 text-red-700 hover:bg-red-50 transition-colors"
                >
                  Revoke
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

