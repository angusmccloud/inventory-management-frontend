/**
 * MemberList Component
 * Feature: 003-member-management
 */

'use client';

import { Member, MemberRole } from '@/types/entities';
import { MemberCard } from './MemberCard';

interface MemberListProps {
  members: Member[];
  currentUserId?: string;
  onUpdateRole?: (memberId: string, role: MemberRole) => void;
  onRemove?: (memberId: string) => void;
  canManage?: boolean;
  emptyMessage?: string;
}

export function MemberList({
  members,
  currentUserId,
  onUpdateRole,
  onRemove,
  canManage = false,
  emptyMessage = 'No members found',
}: MemberListProps) {
  if (members.length === 0) {
    return (
      <div className="text-center py-12">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">{emptyMessage}</h3>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {members.map((member) => (
        <MemberCard
          key={member.memberId}
          member={member}
          isCurrentUser={member.memberId === currentUserId}
          onUpdateRole={onUpdateRole}
          onRemove={onRemove}
          canManage={canManage}
        />
      ))}
    </div>
  );
}

