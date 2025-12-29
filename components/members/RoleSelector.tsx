/**
 * RoleSelector Component
 * Feature: 003-member-management
 */

'use client';

import { MemberRole } from '@/types/entities';

interface RoleSelectorProps {
  value: MemberRole;
  onChange: (role: MemberRole) => void;
  disabled?: boolean;
}

export function RoleSelector({ value, onChange, disabled = false }: RoleSelectorProps) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-text-default">Role</label>

      <div className="space-y-2">
        <label className="flex items-start p-3 border dark:border-border rounded-lg cursor-pointer hover:bg-surface-elevated dark:hover:bg-surface-elevated transition-colors">
          <input
            type="radio"
            name="role"
            value="admin"
            checked={value === 'admin'}
            onChange={(e) => onChange(e.target.value as MemberRole)}
            disabled={disabled}
            className="mt-1 mr-3"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium text-text-default">Admin</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary dark:bg-primary/30 text-primary border border-primary">
                Full Access
              </span>
            </div>
            <p className="text-sm text-text-default mt-1">
              Can manage inventory, invite members, and control all settings
            </p>
          </div>
        </label>

        <label className="flex items-start p-3 border dark:border-border rounded-lg cursor-pointer hover:bg-surface-elevated dark:hover:bg-surface-elevated transition-colors">
          <input
            type="radio"
            name="role"
            value="suggester"
            checked={value === 'suggester'}
            onChange={(e) => onChange(e.target.value as MemberRole)}
            disabled={disabled}
            className="mt-1 mr-3"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium text-text-default">Suggester</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 border border-purple-200 dark:border-purple-800">
                Limited Access
              </span>
            </div>
            <p className="text-sm text-text-default mt-1">
              Can view inventory and suggest items for admin approval
            </p>
          </div>
        </label>
      </div>
    </div>
  );
}

