'use client';

import { useState, FormEvent } from 'react';
import type { Store } from '../../types/entities';
import { Input } from '@/components/common';

interface StoreFormProps {
  familyId: string;
  onSubmit: (data: { name: string; address?: string }) => Promise<void>;
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
  const [submitError, setSubmitError] = useState<string | null>(null);

  const isNameValid = 
    name.trim().length > 0 &&
    name.trim().length <= 100;

  const canSubmit = isNameValid && !isSubmitting;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await onSubmit({
        name: name.trim(),
        address: address.trim() || undefined,
      });
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to save store');
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        id="name"
        label="Store Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        maxLength={100}
        placeholder="e.g., Walmart, Target, Costco"
        required
        helpText={`${name.length}/100 characters`}
        autoFocus
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
          className="mt-1 block w-full rounded-md border-0 px-3 py-2 bg-surface text-text-default ring-1 ring-inset ring-border placeholder:text-text-secondary dark:placeholder:text-text-secondary focus:ring-2 focus:ring-inset focus:ring-primary dark:focus:ring-primary sm:text-sm"
          placeholder="Store location or address"
        />
      </div>

      {submitError && (
        <div className="rounded-md bg-error/10/20 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-error" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-error">{submitError}</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end space-x-3">
        <Button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          variant="danger"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={!canSubmit}
          variant="primary"
        >
          {isSubmitting ? 'Saving...' : initialData ? 'Update Store' : 'Add Store'}
        </Button>
      </div>
    </form>
  );
}
