# EmptyState Component

Placeholder component displayed when no data is available in a list or view, with optional actions.

## Features

- **Optional Icon**: Display relevant icon from Heroicons or custom icon
- **Title & Description**: Clear messaging about the empty state
- **Primary Action**: CTA button using common Button component
- **Secondary Action**: Optional link-style action below primary
- **Accessibility**: Semantic structure with proper text hierarchy
- **Dark Mode**: Full theme support

## Usage

### Basic Empty State

```tsx
import { EmptyState } from '@/components/common';
import { InboxIcon } from '@heroicons/react/24/outline';

<EmptyState
  icon={<InboxIcon />}
  title="No Items Found"
  description="Start by adding your first inventory item."
/>;
```

### With Primary Action

```tsx
import { PlusIcon } from '@heroicons/react/24/outline';

<EmptyState
  icon={<PlusIcon />}
  title="No Items Yet"
  description="Add your first item to get started with inventory management."
  action={{
    label: 'Add Item',
    onClick: () => setShowAddForm(true),
    variant: 'primary',
  }}
/>;
```

### With Primary and Secondary Actions

```tsx
import { UserGroupIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

const router = useRouter();

<EmptyState
  icon={<UserGroupIcon />}
  title="No Members Yet"
  description="Invite family members to collaborate on your inventory."
  action={{
    label: 'Invite Member',
    onClick: handleInvite,
    variant: 'primary',
  }}
  secondaryAction={{
    label: 'Learn More About Member Roles',
    onClick: () => router.push('/docs/members'),
  }}
/>;
```

### Without Icon

```tsx
<EmptyState
  title="Search Returned No Results"
  description="Try adjusting your search terms or filters."
  action={{
    label: 'Clear Filters',
    onClick: handleClearFilters,
    variant: 'secondary',
  }}
/>
```

## Props

| Prop                      | Type            | Default     | Description                      |
| ------------------------- | --------------- | ----------- | -------------------------------- |
| `icon`                    | `ReactNode`     | `undefined` | Icon element (usually Heroicons) |
| `title`                   | `string`        | Required    | Primary message heading          |
| `description`             | `string`        | `undefined` | Supporting description text      |
| `action`                  | `object`        | `undefined` | Primary action button config     |
| `action.label`            | `string`        | Required    | Button text                      |
| `action.onClick`          | `() => void`    | Required    | Button click handler             |
| `action.variant`          | `ButtonVariant` | `'primary'` | Button style variant             |
| `secondaryAction`         | `object`        | `undefined` | Secondary action config          |
| `secondaryAction.label`   | `string`        | Required    | Link text                        |
| `secondaryAction.onClick` | `() => void`    | Required    | Link click handler               |
| `className`               | `string`        | `undefined` | Additional CSS classes           |

## Icon Guidelines

### Recommended Heroicons

- **Inventory/Items**: `ArchiveBoxIcon`, `CubeIcon`, `InboxIcon`
- **Shopping List**: `ShoppingCartIcon`, `ClipboardDocumentListIcon`
- **Members**: `UserGroupIcon`, `UsersIcon`
- **Search**: `MagnifyingGlassIcon`, `FunnelIcon`
- **General**: `ExclamationCircleIcon`, `PlusCircleIcon`

### Icon Sizing

Icons are automatically sized to `h-12 w-12`. You can override with custom className:

```tsx
<EmptyState icon={<InboxIcon className="h-16 w-16" />} title="No Items" />
```

## Examples

### Inventory List Empty State

```tsx
<EmptyState
  icon={<ArchiveBoxIcon />}
  title="No Inventory Items"
  description="Start tracking your pantry, fridge, and storage items."
  action={{
    label: 'Add Your First Item',
    onClick: () => setShowAddItemForm(true),
    variant: 'primary',
  }}
  secondaryAction={{
    label: 'Import from Spreadsheet',
    onClick: handleImport,
  }}
/>
```

### Shopping List Empty State

```tsx
<EmptyState
  icon={<ShoppingCartIcon />}
  title="Shopping List is Empty"
  description="Add items from your inventory or create custom items."
  action={{
    label: 'Add Item',
    onClick: () => setShowAddForm(true),
  }}
/>
```

### Search Results Empty State

```tsx
<EmptyState
  icon={<MagnifyingGlassIcon />}
  title="No Results Found"
  description={`No items match "${searchQuery}". Try a different search term.`}
  action={{
    label: 'Clear Search',
    onClick: () => setSearchQuery(''),
    variant: 'secondary',
  }}
/>
```

### Filtered List Empty State

```tsx
<EmptyState
  title="No Items Match Filters"
  description="Try adjusting your category or location filters."
  action={{
    label: 'Clear All Filters',
    onClick: handleClearFilters,
    variant: 'secondary',
  }}
/>
```

## Best Practices

1. **Provide context** - Explain why the list is empty
2. **Offer next steps** - Give users a clear action to take
3. **Use appropriate icons** - Choose icons that relate to the content type
4. **Keep it concise** - Short, friendly messages work best
5. **Consider the cause** - Different messages for "no data yet" vs "no results found"
6. **Make actions relevant** - Primary action should solve the empty state
7. **Don't overuse** - Only show when genuinely empty, not during loading

## Accessibility

- Uses `Text` component for proper heading hierarchy
- Primary action uses semantic `Button` component
- Secondary action is a button with proper focus styles
- Sufficient color contrast in light and dark modes

## Related Components

- **Button**: Used for primary action
- **Text**: Used for title and description
- **LoadingSpinner**: Show during data loading (before empty state)
