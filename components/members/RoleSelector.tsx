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
      <label className="block text-sm font-medium text-gray-700">Role</label>

      <div className="space-y-2">
        <label className="flex items-start p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
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
              <span className="font-medium text-gray-900">Admin</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                Full Access
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Can manage inventory, invite members, and control all settings
            </p>
          </div>
        </label>

        <label className="flex items-start p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
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
              <span className="font-medium text-gray-900">Suggester</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
                Limited Access
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Can view inventory and suggest items for admin approval
            </p>
          </div>
        </label>
      </div>
    </div>
  );
}

