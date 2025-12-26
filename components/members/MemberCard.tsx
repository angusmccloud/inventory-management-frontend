/**
 * MemberCard Component
 * Feature: 003-member-management
 */

'use client';

import { Member } from '@/types/entities';
import { Badge, Button } from '@/components/common';
import type { BadgeVariant } from '@/components/common';

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
  const roleVariants: Record<string, BadgeVariant> = {
    admin: 'primary',
    suggester: 'info',
  };

  const statusVariants: Record<string, BadgeVariant> = {
    active: 'success',
    removed: 'error',
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {member.name}
              {isCurrentUser && (
                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">(You)</span>
              )}
            </h3>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{member.email}</p>

          <div className="flex items-center gap-2">
            <Badge variant={roleVariants[member.role]} size="sm">
              {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
            </Badge>

            <Badge variant={statusVariants[member.status]} size="sm">
              {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
            </Badge>
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Joined {new Date(member.createdAt).toLocaleDateString()}
          </p>
        </div>

        {canManage && member.status === 'active' && (
          <div className="flex flex-col gap-2 ml-4">
            {onUpdateRole && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() =>
                  onUpdateRole(
                    member.memberId,
                    member.role === 'admin' ? 'suggester' : 'admin'
                  )
                }
                disabled={isCurrentUser}
                title={isCurrentUser ? 'Cannot change your own role' : 'Toggle role'}
              >
                {member.role === 'admin' ? 'Make Suggester' : 'Make Admin'}
              </Button>
            )}

            {onRemove && (
              <Button
                variant="danger"
                size="sm"
                onClick={() => onRemove(member.memberId)}
                disabled={isCurrentUser}
                title={isCurrentUser ? 'Remove yourself from family' : 'Remove member'}
              >
                Remove
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

