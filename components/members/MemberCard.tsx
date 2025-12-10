/**
 * MemberCard Component
 * Feature: 003-member-management
 */

'use client';

import { Member } from '@/types/entities';

interface MemberCardProps {
  member: Member;
  isCurrentUser?: boolean;
  onUpdateRole?: (memberId: string, role: 'admin' | 'suggester') => void;
  onRemove?: (memberId: string) => void;
  canManage?: boolean;
}

export function MemberCard({
  member,
  isCurrentUser = false,
  onUpdateRole,
  onRemove,
  canManage = false,
}: MemberCardProps) {
  const roleColors = {
    admin: 'bg-blue-100 text-blue-800 border-blue-200',
    suggester: 'bg-purple-100 text-purple-800 border-purple-200',
  };

  const statusColors = {
    active: 'bg-green-100 text-green-800',
    removed: 'bg-red-100 text-red-800',
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">
              {member.name}
              {isCurrentUser && (
                <span className="ml-2 text-sm text-gray-500">(You)</span>
              )}
            </h3>
          </div>

          <p className="text-sm text-gray-600 mb-3">{member.email}</p>

          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                roleColors[member.role]
              }`}
            >
              {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
            </span>

            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                statusColors[member.status]
              }`}
            >
              {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
            </span>
          </div>

          <p className="text-xs text-gray-500 mt-2">
            Joined {new Date(member.createdAt).toLocaleDateString()}
          </p>
        </div>

        {canManage && member.status === 'active' && (
          <div className="flex flex-col gap-2 ml-4">
            {onUpdateRole && (
              <button
                onClick={() =>
                  onUpdateRole(
                    member.memberId,
                    member.role === 'admin' ? 'suggester' : 'admin'
                  )
                }
                className="text-sm px-3 py-1 rounded border border-blue-300 text-blue-700 hover:bg-blue-50 transition-colors"
                disabled={isCurrentUser}
                title={isCurrentUser ? 'Cannot change your own role' : 'Toggle role'}
              >
                {member.role === 'admin' ? 'Make Suggester' : 'Make Admin'}
              </button>
            )}

            {onRemove && (
              <button
                onClick={() => onRemove(member.memberId)}
                className="text-sm px-3 py-1 rounded border border-red-300 text-red-700 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title={isCurrentUser ? 'Remove yourself from family' : 'Remove member'}
              >
                Remove
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

