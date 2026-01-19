'use client';

import { useState, FormEvent } from 'react';
import type { Store } from '../../types/entities';
import { Input, Button, Text } from '@/components/common';

interface StoreFormProps {
  familyId: string;
  onSubmit: (data: { name: string; address?: string }, keepModalOpen?: boolean) => Promise<void>;
  onCancel: () => void;
  initialData?: Store;
}

export default function StoreForm({
  familyId: _familyId, // Reserved for future use
  onSubmit,
  onCancel,
  initialData,
}: StoreFormProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [address, setAddress] = useState(initialData?.address || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isQuickAdding, setIsQuickAdding] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const isNameValid = name.trim().length > 0 && name.trim().length <= 100;

  const canSubmit = isNameValid && !isSubmitting;

  async function handleSubmit(e: FormEvent, keepModalOpen: boolean = false) {
    e.preventDefault();
    if (!canSubmit) return;

    setIsSubmitting(true);
    setIsQuickAdding(keepModalOpen);
    setSubmitError(null);

    try {
      await onSubmit(
        {
          name: name.trim(),
          address: address.trim() || undefined,
        },
        keepModalOpen
      );

      // Reset form if keeping modal open
      if (keepModalOpen) {
        setName('');
        setAddress('');
        // Focus back on name input for quick entry
        setTimeout(() => {
          document.getElementById('name')?.focus();
        }, 0);
      }
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to save store');
    } finally {
      setIsSubmitting(false);
      setIsQuickAdding(false);
    }
  }

  // Handle Enter key in name field for quick add (only when adding, not editing)
  const handleNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !isSubmitting && !initialData) {
      e.preventDefault();
      handleSubmit(e as any, true);
    }
  };

  return (
    <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-6">
      <Input
        id="name"
        label="Store Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={handleNameKeyDown}
        maxLength={100}
        placeholder="e.g., Walmart, Target, Costco"
        required
        helpText={
          !initialData
            ? `${name.length}/100 characters - Press Enter to quickly add multiple stores`
            : `${name.length}/100 characters`
        }
        autoFocus
        disabled={isSubmitting && !isQuickAdding}
      />

      <div>
        <label htmlFor="address" className="block text-sm font-medium text-text-default">
          Address (Optional)
        </label>
        <textarea
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          rows={3}
          className="mt-1 block w-full rounded-md border-0 bg-surface px-3 py-2 text-text-default ring-1 ring-inset ring-border placeholder:text-text-secondary focus:ring-2 focus:ring-inset focus:ring-primary dark:placeholder:text-text-secondary dark:focus:ring-primary sm:text-sm"
          placeholder="Store location or address"
        />
      </div>

      {submitError && (
        <div className="bg-error/10/20 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-error" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <Text variant="bodySmall" color="error">
                {submitError}
              </Text>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end space-x-3">
        <Button type="button" onClick={onCancel} disabled={isSubmitting} variant="warning">
          Cancel
        </Button>
        <Button type="submit" disabled={!canSubmit} variant="primary">
          {isSubmitting ? 'Saving...' : initialData ? 'Update Store' : 'Add Store'}
        </Button>
      </div>
    </form>
  );
}
