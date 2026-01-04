/**
 * RoleSelector Component
 * Feature: 003-member-management
 */

'use client';

import { MemberRole } from '@/types/entities';
import { Radio, Badge } from '@/components/common';
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
        <Badge variant="primary" size="sm">
          Full Access
        </Badge>
      </div>
    ),
    description: 'Can manage inventory, invite members, and control all settings',
  },
  {
    value: 'suggester',
    label: (
      <div className="flex items-center gap-2">
        <span className="font-medium text-text-default">Suggester</span>
        <Badge variant="info" size="sm">
          Limited Access
        </Badge>
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
