'use client';

import * as React from 'react';
import { Card } from '@/components/common/Card/Card';
import { Button } from '@/components/common/Button/Button';
import { Input } from '@/components/common/Input/Input';
import { Text } from '@/components/common/Text/Text';

export type NameFormProps = {
  displayName?: string | null;
  onSubmit?: (displayName: string) => Promise<void> | void;
  isSubmitting?: boolean;
  errorMessage?: string | null;
};

export default function NameForm({
  displayName,
  onSubmit,
  isSubmitting = false,
  errorMessage,
}: NameFormProps) {
  const [nameValue, setNameValue] = React.useState(displayName ?? '');
  const [localError, setLocalError] = React.useState<string | null>(null);

  React.useEffect(() => {
    setNameValue(displayName ?? '');
  }, [displayName]);

  const validateName = (value: string) => {
    const trimmed = value.trim();
    if (trimmed.length < 2 || trimmed.length > 50) {
      return 'Display name must be between 2 and 50 characters.';
    }
    if (/[\x00-\x1F\x7F]/.test(trimmed)) {
      return 'Display name contains invalid characters.';
    }
    return null;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const validationError = validateName(nameValue);
    setLocalError(validationError);
    if (validationError) {
      return;
    }
    await onSubmit?.(nameValue.trim());
  };

  const activeError = localError || errorMessage || null;

  return (
    <Card>
      <div className="space-y-4">
        <div>
          <Text variant="h4" className="text-text-primary">
            Update Display Name
          </Text>
          <Text variant="bodySmall" color="secondary">
            Choose the name shown across your household dashboards.
          </Text>
        </div>
        <form className="space-y-3" onSubmit={handleSubmit}>
          <Input
            label="Display Name"
            value={nameValue}
            onChange={(event) => setNameValue(event.target.value)}
            required
          />
          {activeError && (
            <Text variant="caption" color="error">
              {activeError}
            </Text>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
      </div>
    </Card>
  );
}
