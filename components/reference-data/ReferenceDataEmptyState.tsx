'use client';

import { EmptyState } from '@/components/common';
import { MapPinIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';

interface ReferenceDataEmptyStateProps {
  type: 'locations' | 'stores';
  onAdd: () => void;
}

export default function ReferenceDataEmptyState({ type, onAdd }: ReferenceDataEmptyStateProps) {
  const title = type === 'locations' ? 'No Storage Locations' : 'No Stores';
  const description =
    type === 'locations'
      ? 'Add storage locations to organize where items are stored.'
      : 'Add stores to track where items can be purchased.';
  const buttonText = type === 'locations' ? 'Add Location' : 'Add Store';
  const icon = type === 'locations' ? <MapPinIcon /> : <ShoppingBagIcon />;

  return (
    <EmptyState
      icon={icon}
      title={title}
      description={description}
      action={{
        label: buttonText,
        onClick: onAdd,
        variant: 'primary',
      }}
    />
  );
}
