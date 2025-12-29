/**
 * CreateFamilyForm Component
 * 
 * Form for creating a new family.
 */

'use client';

import { useState, FormEvent } from 'react';
import { createFamily } from '@/lib/api/families';
import { Family } from '@/types/entities';

interface CreateFamilyFormProps {
  onSuccess: (family: Family) => void;
  onCancel?: () => void;
}

export default function CreateFamilyForm({
  onSuccess,
  onCancel,
}: CreateFamilyFormProps) {
  const [name, setName] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Family name is required');
      return;
    }
    
    setError('');
    setLoading(true);

    try {
      const family = await createFamily({ name: name.trim() });
      onSuccess(family);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create family');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="family-name" className="block text-sm font-medium text-text-default">
          Family Name
        </label>
        <input
          id="family-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full rounded-md border-0 px-3 py-2 text-text-default bg-surface ring-1 ring-inset ring-border placeholder:text-text-disabled focus:z-10 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
          placeholder="Enter family name"
          required
          maxLength={100}
          disabled={loading}
        />
      </div>

      {error && (
        <div className="rounded-md bg-error/10 p-4">
          <p className="text-sm text-error">{error}</p>
        </div>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-contrast hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create Family'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-md bg-surface px-4 py-2 text-sm font-semibold text-text-default ring-1 ring-inset ring-border hover:bg-surface-elevated focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
