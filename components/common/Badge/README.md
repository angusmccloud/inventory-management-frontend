# Badge Component

Small status or count indicator with multiple variants, sizes, and a dot-only mode.

## Features

- **Variants**: default, primary, success, warning, error, info
- **Sizes**: sm, md (default), lg
- **Dot Mode**: Display as a colored dot without text
- **Flexible Content**: Text, numbers, or icons
- **Theme-Aware**: Uses semantic colors from theme

## Basic Usage

```tsx
import { Badge } from '@/components/common';

// Status badges
<Badge variant="success">Active</Badge>
<Badge variant="error">Removed</Badge>
<Badge variant="warning">Low Stock</Badge>

// Count badges
<Badge variant="primary">{count}</Badge>
<Badge variant="info">12</Badge>

// Default (neutral)
<Badge>Draft</Badge>
```

## Variants

```tsx
import { Badge } from '@/components/common';

// Default - Neutral gray
<Badge variant="default">Default</Badge>

// Primary - Brand blue
<Badge variant="primary">Primary</Badge>

// Success - Green (positive status)
<Badge variant="success">Success</Badge>

// Warning - Yellow (caution status)
<Badge variant="warning">Warning</Badge>

// Error - Red (negative status)
<Badge variant="error">Error</Badge>

// Info - Light blue (informational)
<Badge variant="info">Info</Badge>
```

## Sizes

```tsx
import { Badge } from '@/components/common';

// Small
<Badge size="sm" variant="primary">Small</Badge>

// Medium (default)
<Badge size="md" variant="success">Medium</Badge>

// Large
<Badge size="lg" variant="error">Large</Badge>
```

## Dot Indicator

```tsx
import { Badge } from '@/components/common';

// Dot-only badges (no text)
<Badge variant="success" dot />
<Badge variant="error" dot />
<Badge variant="warning" dot />

// Dot with text (using flex layout)
<div className="flex items-center gap-2">
  <Badge variant="success" dot />
  <span>Active</span>
</div>
```

## Common Patterns

### Item Status
```tsx
import { Badge } from '@/components/common';

function ItemStatus({ status }: { status: string }) {
  const variantMap = {
    active: 'success',
    removed: 'error',
    'low-stock': 'warning',
  };

  return (
    <Badge variant={variantMap[status] as any}>
      {status.replace('-', ' ').toUpperCase()}
    </Badge>
  );
}
```

### Count Badge
```tsx
import { Badge } from '@/components/common';

function NotificationBadge({ count }: { count: number }) {
  if (count === 0) return null;

  return (
    <Badge variant="primary" size="sm">
      {count > 99 ? '99+' : count}
    </Badge>
  );
}
```

### Shopping List Priority
```tsx
import { Badge } from '@/components/common';

interface Item {
  name: string;
  priority: 'high' | 'medium' | 'low';
}

function ShoppingListItem({ item }: { item: Item }) {
  const priorityConfig = {
    high: { variant: 'error', label: 'High' },
    medium: { variant: 'warning', label: 'Medium' },
    low: { variant: 'info', label: 'Low' },
  };

  const config = priorityConfig[item.priority];

  return (
    <div className="flex items-center justify-between">
      <span>{item.name}</span>
      <Badge variant={config.variant as any} size="sm">
        {config.label}
      </Badge>
    </div>
  );
}
```

### Status with Dot
```tsx
import { Badge } from '@/components/common';

function UserStatus({ isOnline }: { isOnline: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <Badge variant={isOnline ? 'success' : 'default'} dot />
      <span className="text-sm text-text-secondary">
        {isOnline ? 'Online' : 'Offline'}
      </span>
    </div>
  );
}
```

### List with Badges
```tsx
import { Badge } from '@/components/common';

function InventoryList({ items }: { items: Item[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item.id} className="flex items-center justify-between p-4">
          <div>
            <h3 className="font-medium">{item.name}</h3>
            <p className="text-sm text-text-secondary">
              Quantity: {item.quantity}
            </p>
          </div>
          <div className="flex gap-2">
            <Badge variant="success" size="sm">
              {item.location}
            </Badge>
            {item.quantity < item.lowStockThreshold && (
              <Badge variant="warning" size="sm">
                Low Stock
              </Badge>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
```

### Category Tags
```tsx
import { Badge } from '@/components/common';

function ItemTags({ tags }: { tags: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <Badge key={tag} variant="default" size="sm">
          {tag}
        </Badge>
      ))}
    </div>
  );
}
```

### Notification Badge on Button
```tsx
import { Button, Badge } from '@/components/common';
import { BellIcon } from '@heroicons/react/24/outline';

function NotificationButton({ unreadCount }: { unreadCount: number }) {
  return (
    <Button variant="secondary" className="relative">
      <BellIcon className="w-5 h-5" />
      {unreadCount > 0 && (
        <Badge 
          variant="error" 
          size="sm"
          className="absolute -top-1 -right-1"
        >
          {unreadCount > 99 ? '99+' : unreadCount}
        </Badge>
      )}
    </Button>
  );
}
```

## Accessibility

- **Semantic Colors**: Variants use semantic colors (success, warning, error) that convey meaning
- **Text Content**: Ensure badge text is descriptive (avoid relying solely on color)
- **Contrast**: All variants meet WCAG 2.1 AA contrast requirements
- **Screen Readers**: Badge content is automatically announced

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'default' \| 'primary' \| 'success' \| 'warning' \| 'error' \| 'info'` | `'default'` | Badge color variant |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Badge size |
| `children` | `React.ReactNode` | - | Badge content (text or number) |
| `dot` | `boolean` | `false` | Render as dot indicator (ignores children) |
| `className` | `string` | - | Additional CSS classes |
| `...props` | `React.HTMLAttributes<HTMLSpanElement>` | - | All standard span attributes |

## Variant Colors

| Variant | Use Case | Color |
|---------|----------|-------|
| `default` | Neutral, tags, categories | Gray |
| `primary` | Brand-related, counts, highlights | Blue |
| `success` | Active, completed, positive status | Green |
| `warning` | Low stock, caution, attention needed | Yellow |
| `error` | Removed, failed, critical status | Red |
| `info` | Informational, help, guidance | Light Blue |

## Size Guidelines

- **sm**: Use for compact layouts, list items, or when space is limited
- **md**: Default size, suitable for most use cases
- **lg**: Use for prominent status indicators or when badge is a primary element

## Design Notes

- Badges have rounded-full corners for a pill-like appearance
- Text is centered both horizontally and vertically
- Border adds subtle definition to the badge
- Font weight is medium for readability
- Padding maintains consistent spacing across sizes
- Dot mode creates an 8px circular indicator
