/**
 * CreateFamilyForm Component
 * 
 * Form for creating a new family.
 */

'use client';

import { useState, FormEvent } from 'react';
import { createFamily } from '@/lib/api/families';
import { Family } from '@/types/entities';
import { Button } from '@/components/common/Button/Button';
import { Input } from '@/components/common';

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
      <Input
        id="family-name"
        type="text"
        label="Family Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter family name"
        required
        maxLength={100}
        disabled={loading}
      />

      {error && (
        <div className="rounded-md bg-error/10 p-4">
          <p className="text-sm text-error">{error}</p>
        </div>
      )}

      <div className="flex gap-3">
        <Button
          type="submit"
          variant="primary"
          size="md"
          fullWidth
          disabled={loading}
          loading={loading}
        >
          {loading ? 'Creating...' : 'Create Family'}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
