/**
 * RoleSelector Component
 * Feature: 003-member-management
 */

'use client';

import { MemberRole } from '@/types/entities';
import { Radio } from '@/components/common';
import type { RadioOption } from '@/components/common/Radio/Radio.types';

interface RoleSelectorProps {
  value: MemberRole;
  onChange: (role: MemberRole) => void;
  disabled?: boolean;
}

const roleOptions: RadioOption[] = [
  {
    value: 'admin',
    label: (
      <div className="flex items-center gap-2">
        <span className="font-medium text-text-default">Admin</span>
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary dark:bg-primary/30 text-primary border border-primary">
          Full Access
        </span>
      </div>
    ),
    description: 'Can manage inventory, invite members, and control all settings',
  },
  {
    value: 'suggester',
    label: (
      <div className="flex items-center gap-2">
        <span className="font-medium text-text-default">Suggester</span>
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 border border-purple-200 dark:border-purple-800">
          Limited Access
        </span>
      </div>
    ),
    description: 'Can view inventory and suggest items for admin approval',
  },
];

export function RoleSelector({ value, onChange, disabled = false }: RoleSelectorProps) {
  return (
    <Radio
      label="Role"
      name="role"
      value={value}
      options={roleOptions}
      onChange={(value) => onChange(value as MemberRole)}
      disabled={disabled}
    />
  );
}

