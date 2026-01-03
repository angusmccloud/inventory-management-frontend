/**
 * InviteMemberForm Component
 * Feature: 003-member-management
 */

'use client';

import { useState } from 'react';
import { MemberRole } from '@/types/entities';
import { RoleSelector } from './RoleSelector';
import { Input, Button, Text } from '@/components/common';

interface InviteMemberFormProps {
  onSubmit: (email: string, role: MemberRole) => Promise<void>;
  onCancel?: () => void;
}

export function InviteMemberForm({ onSubmit, onCancel }: InviteMemberFormProps) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<MemberRole>('suggester');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await onSubmit(email, role);
      // Reset form on success
      setEmail('');
      setRole('suggester');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send invitation');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="email"
        id="email"
        label="Email Address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        placeholder="member@example.com"
        disabled={isSubmitting}
      />

      <RoleSelector value={role} onChange={setRole} disabled={isSubmitting} />

      {error && (
        <div className="p-3 bg-error/10 border border-error rounded-lg">
          <Text variant="bodySmall" color="error">{error}</Text>
        </div>
      )}

      <div className="flex gap-3">
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting || !email}
          loading={isSubmitting}
          className="flex-1"
        >
          {isSubmitting ? 'Sending...' : 'Send Invitation'}
        </Button>

        {onCancel && (
          <Button
            type="button"
            variant="danger"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}

