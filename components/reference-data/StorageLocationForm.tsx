'use client';

import { useState, FormEvent } from 'react';
import type { StorageLocation } from '../../types/entities';
import { Input, Button, Alert } from '@/components/common';

interface StorageLocationFormProps {
  familyId: string;
  onSubmit: (data: { name: string; description?: string }) => Promise<void>;
  onCancel: () => void;
  initialData?: StorageLocation;
}

export default function StorageLocationForm({
  familyId: _familyId, // Reserved for future use
  onSubmit,
  onCancel,
  initialData,
}: StorageLocationFormProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const isNameValid = 
    name.trim().length > 0 &&
    name.trim().length <= 50;

  const canSubmit = isNameValid && !isSubmitting;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await onSubmit({
        name: name.trim(),
        description: description.trim() || undefined,
      });
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to save storage location');
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        id="name"
        label="Location Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        maxLength={50}
        placeholder="e.g., Pantry, Fridge, Garage"
        required
        helpText={`${name.length}/50 characters`}
        autoFocus
      />

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-text-default">
          Description (Optional)
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="mt-1 block w-full rounded-md border-0 px-3 py-2 bg-surface text-text-default ring-1 ring-inset ring-border placeholder:text-text-secondary dark:placeholder:text-text-secondary focus:ring-2 focus:ring-inset focus:ring-primary dark:focus:ring-primary sm:text-sm"
          placeholder="Add any additional details about this location"
        />
      </div>

      {submitError && (
        <Alert severity="error">
          {submitError}
        </Alert>
      )}

      <div className="flex justify-end space-x-3">
        <Button
          type="button"
          variant="warning"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={!canSubmit}
        >
          {isSubmitting ? 'Saving...' : initialData ? 'Update Location' : 'Add Location'}
        </Button>
      </div>
    </form>
  );
}
