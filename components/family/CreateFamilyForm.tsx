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
        <label htmlFor="family-name" className="block text-sm font-medium text-gray-700">
          Family Name
        </label>
        <input
          id="family-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          placeholder="Enter family name"
          required
          maxLength={100}
          disabled={loading}
        />
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create Family'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-md bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
