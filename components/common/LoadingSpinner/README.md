# LoadingSpinner Component

Animated circular loading indicator with multiple size variants and accessibility support.

## Features

- **Sizes**: sm (16px), md (24px), lg (32px), xl (48px)
- **Center Option**: Automatically centers in a container
- **Accessibility**: ARIA role and label for screen readers
- **Animation**: Smooth CSS-based rotation
- **Theme-Aware**: Uses theme colors for consistency

## Basic Usage

```tsx
import { LoadingSpinner } from '@/components/common';

// Basic spinner
<LoadingSpinner />

// With custom label
<LoadingSpinner label="Loading inventory..." />

// Conditional rendering
{isLoading && <LoadingSpinner />}
```

## Sizes

```tsx
import { LoadingSpinner } from '@/components/common';

// Small (16px) - Inline with text or small buttons
<LoadingSpinner size="sm" />

// Medium (24px) - Default, general purpose
<LoadingSpinner size="md" />

// Large (32px) - Large buttons or card loading
<LoadingSpinner size="lg" />

// Extra Large (48px) - Page-level loading
<LoadingSpinner size="xl" />
```

## Centering

```tsx
import { LoadingSpinner } from '@/components/common';

// Centered in container (adds flex wrapper with min-height)
<LoadingSpinner center size="lg" label="Loading data..." />

// Manual centering
<div className="flex justify-center items-center h-screen">
  <LoadingSpinner size="xl" label="Loading application..." />
</div>
```

## Common Patterns

### Button Loading State
```tsx
import { Button, LoadingSpinner } from '@/components/common';

<Button disabled={isLoading}>
  {isLoading ? (
    <>
      <LoadingSpinner size="sm" />
      <span className="ml-2">Saving...</span>
    </>
  ) : (
    'Save Changes'
  )}
</Button>
```

### Page Loading
```tsx
import { LoadingSpinner } from '@/components/common';

function InventoryPage() {
  const { data, isLoading } = useInventory();

  if (isLoading) {
    return <LoadingSpinner center size="xl" label="Loading inventory..." />;
  }

  return <InventoryList items={data} />;
}
```

### Card Loading
```tsx
import { Card, LoadingSpinner } from '@/components/common';

<Card>
  {isLoading ? (
    <div className="flex justify-center py-8">
      <LoadingSpinner size="lg" label="Loading content..." />
    </div>
  ) : (
    <CardContent data={data} />
  )}
</Card>
```

### Form Submission
```tsx
import { Button, LoadingSpinner } from '@/components/common';

function AddItemForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await addItem(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <LoadingSpinner size="sm" />
            <span className="ml-2">Adding Item...</span>
          </>
        ) : (
          'Add Item'
        )}
      </Button>
    </form>
  );
}
```

### Data Fetching with Suspense Fallback
```tsx
import { LoadingSpinner } from '@/components/common';
import { Suspense } from 'react';

<Suspense fallback={<LoadingSpinner center size="xl" label="Loading..." />}>
  <AsyncComponent />
</Suspense>
```

### Inline Loading
```tsx
import { LoadingSpinner } from '@/components/common';

<div className="flex items-center gap-2">
  <LoadingSpinner size="sm" />
  <span className="text-sm text-text-secondary">Fetching updates...</span>
</div>
```

### List Loading
```tsx
import { LoadingSpinner } from '@/components/common';

function ItemList({ items, isLoading }: ItemListProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-2 p-4 bg-surface rounded">
            <LoadingSpinner size="sm" />
            <div className="text-text-secondary">Loading item {i}...</div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <ul>
      {items.map((item) => (
        <ItemRow key={item.id} item={item} />
      ))}
    </ul>
  );
}
```

## Accessibility

- **ARIA Role**: Uses `role="status"` for live region announcements
- **ARIA Label**: Configurable label announces loading state to screen readers
- **Screen Reader Only**: Visual label hidden with `sr-only` class
- **Semantic HTML**: Proper use of status role for dynamic content updates

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Spinner size (sm=16px, md=24px, lg=32px, xl=48px) |
| `label` | `string` | `'Loading...'` | Accessible label for screen readers |
| `center` | `boolean` | `false` | Center spinner in container with flex wrapper |
| `className` | `string` | - | Additional CSS classes for the spinner |

## Size Guidelines

- **sm (16px)**: Use inline with text, small buttons, or dense layouts
- **md (24px)**: Default size, suitable for most use cases
- **lg (32px)**: Use in larger buttons, cards, or prominent UI elements
- **xl (48px)**: Use for full-page loading states or major async operations

## Animation

The spinner uses CSS `animate-spin` utility from Tailwind CSS:
- **Duration**: 1 second per rotation
- **Timing**: Linear (constant speed)
- **Performance**: GPU-accelerated using CSS transforms
- **Theme**: Border color uses `border-border-focus` from theme

## Styling Notes

- Border width increases with size (2px for sm/md, 3px for lg/xl)
- Top border is transparent to create the rotating effect
- Uses theme color `border-border-focus` for consistency
- Animation is infinite and runs automatically
