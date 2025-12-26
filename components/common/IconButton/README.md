# IconButton Component

Button optimized for icon-only display with proper touch targets and accessibility.

## Features

- **Icon-Only Display**: Optimized for icon actions without text labels
- **Proper Touch Targets**: Minimum 40px touch target (WCAG AA)
- **Required Accessibility**: Enforced `aria-label` for screen readers
- **Same Variants as Button**: Primary, Secondary, Danger
- **Loading States**: Built-in spinner replacement
- **Optional Tooltip**: Visual label on hover

## Basic Usage

```tsx
import { IconButton } from '@/components/common';
import { PencilIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';

// Edit action
<IconButton 
  icon={<PencilIcon className="h-5 w-5" />}
  aria-label="Edit item"
  variant="secondary"
  onClick={handleEdit}
/>

// Delete action
<IconButton 
  icon={<TrashIcon className="h-5 w-5" />}
  aria-label="Delete item"
  variant="danger"
  onClick={handleDelete}
/>

// Close button
<IconButton 
  icon={<XMarkIcon className="h-5 w-5" />}
  aria-label="Close modal"
  variant="secondary"
  size="sm"
  onClick={onClose}
/>
```

## Sizes & Icon Recommendations

| Size | Touch Target | Icon Size (className) | Use Case |
|------|--------------|----------------------|----------|
| `sm` | 32px | `h-4 w-4` | Compact lists, inline actions |
| `md` | 40px (default) | `h-5 w-5` | Standard actions, toolbars |
| `lg` | 48px | `h-6 w-6` | Prominent actions, mobile |

```tsx
// Small (32px touch target)
<IconButton 
  size="sm"
  icon={<PencilIcon className="h-4 w-4" />}
  aria-label="Edit"
/>

// Medium (40px touch target - default)
<IconButton 
  size="md"
  icon={<PencilIcon className="h-5 w-5" />}
  aria-label="Edit"
/>

// Large (48px touch target)
<IconButton 
  size="lg"
  icon={<PencilIcon className="h-6 w-6" />}
  aria-label="Edit"
/>
```

## Variants

```tsx
// Primary - Main actions
<IconButton 
  variant="primary"
  icon={<PlusIcon className="h-5 w-5" />}
  aria-label="Add item"
/>

// Secondary - Alternative actions (default for icons)
<IconButton 
  variant="secondary"
  icon={<PencilIcon className="h-5 w-5" />}
  aria-label="Edit item"
/>

// Danger - Destructive actions
<IconButton 
  variant="danger"
  icon={<TrashIcon className="h-5 w-5" />}
  aria-label="Delete item"
/>
```

## Loading State

```tsx
const [isDeleting, setIsDeleting] = useState(false);

<IconButton 
  icon={<TrashIcon className="h-5 w-5" />}
  aria-label="Delete item"
  variant="danger"
  loading={isDeleting}
  onClick={async () => {
    setIsDeleting(true);
    await deleteItem();
    setIsDeleting(false);
  }}
/>
```

## Tooltip Label

Add a visual tooltip (in addition to required `aria-label`):

```tsx
<IconButton 
  icon={<PencilIcon className="h-5 w-5" />}
  aria-label="Edit item"
  label="Edit"  // Shows on hover as title attribute
  variant="secondary"
/>
```

## Common Patterns

### Action Row in List Items

```tsx
<div className="flex items-center gap-2">
  <IconButton 
    icon={<PencilIcon className="h-5 w-5" />}
    aria-label="Edit item"
    variant="secondary"
    size="sm"
    onClick={() => setEditMode(true)}
  />
  <IconButton 
    icon={<TrashIcon className="h-5 w-5" />}
    aria-label="Delete item"
    variant="danger"
    size="sm"
    loading={isDeleting}
    onClick={handleDelete}
  />
</div>
```

### Modal Header Actions

```tsx
<div className="flex items-center justify-between p-4 border-b">
  <h2>Modal Title</h2>
  <IconButton 
    icon={<XMarkIcon className="h-5 w-5" />}
    aria-label="Close modal"
    variant="secondary"
    size="sm"
    onClick={onClose}
  />
</div>
```

### Toolbar Actions

```tsx
<div className="flex items-center gap-1 p-2 bg-surface rounded-lg border">
  <IconButton 
    icon={<BoldIcon className="h-5 w-5" />}
    aria-label="Bold text"
    variant={isBold ? 'primary' : 'secondary'}
    size="sm"
  />
  <IconButton 
    icon={<ItalicIcon className="h-5 w-5" />}
    aria-label="Italic text"
    variant={isItalic ? 'primary' : 'secondary'}
    size="sm"
  />
  <IconButton 
    icon={<UnderlineIcon className="h-5 w-5" />}
    aria-label="Underline text"
    variant={isUnderline ? 'primary' : 'secondary'}
    size="sm"
  />
</div>
```

### Floating Action Button

```tsx
<IconButton 
  icon={<PlusIcon className="h-6 w-6" />}
  aria-label="Add new item"
  variant="primary"
  size="lg"
  className="fixed bottom-6 right-6 rounded-full shadow-lg"
/>
```

## Best Practices

### ✅ Do

- Always provide descriptive `aria-label` (REQUIRED)
- Match icon size to button size (sm=h-4, md=h-5, lg=h-6)
- Use secondary variant for most icon actions (primary is high contrast)
- Add optional `label` prop for hover tooltips
- Group related icon buttons with consistent sizing

```tsx
// Good: Descriptive aria-label
<IconButton 
  icon={<TrashIcon />}
  aria-label="Delete item from inventory"
/>

// Good: Matched icon size
<IconButton 
  size="sm"
  icon={<PencilIcon className="h-4 w-4" />}
  aria-label="Edit"
/>
```

### ❌ Don't

- Don't omit `aria-label` (TypeScript enforces this)
- Don't use text labels (use Button component instead)
- Don't use tiny icons that are hard to tap (<32px touch target)
- Don't use icon buttons for navigation (use Link component)
- Don't forget loading state for async operations

```tsx
// Bad: Missing aria-label (won't compile)
<IconButton icon={<PencilIcon />} />

// Bad: Text label (use Button instead)
<IconButton icon={<PencilIcon />} aria-label="Edit">
  Edit
</IconButton>

// Bad: Navigation (use Link)
<IconButton 
  icon={<ArrowRightIcon />}
  aria-label="Go to dashboard"
  onClick={() => router.push('/dashboard')}
/>
```

## Accessibility

- **WCAG 2.1 AA Touch Targets**: All sizes meet minimum 32px × 32px requirement
- **Required aria-label**: TypeScript enforces accessible labeling
- **Title Attribute**: Automatically set from `label` or `aria-label`
- **Keyboard Navigation**: Activated with Enter or Space
- **Focus Indicator**: Visible focus ring
- **Loading State**: Announced via `aria-busy="true"`

```tsx
// Accessibility is enforced by TypeScript
<IconButton 
  icon={<TrashIcon className="h-5 w-5" />}
  aria-label="Delete item"  // REQUIRED - won't compile without it
  variant="danger"
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `icon` | `React.ReactNode` | Required | Icon to display (usually Heroicons) |
| `aria-label` | `string` | Required | Accessible label for screen readers |
| `label` | `string` | `undefined` | Visual tooltip (shown on hover) |
| `variant` | `'primary' \| 'secondary' \| 'danger'` | `'primary'` | Button visual style |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Button size (affects touch target) |
| `loading` | `boolean` | `false` | Show loading spinner |
| `disabled` | `boolean` | `false` | Disable button |
| `className` | `string` | `undefined` | Additional CSS classes |
| `onClick` | `() => void` | `undefined` | Click handler |

Plus all standard HTML button attributes.

## TypeScript

```tsx
import type { IconButtonProps } from '@/components/common';

// Fully typed props
const props: IconButtonProps = {
  icon: <PencilIcon className="h-5 w-5" />,
  'aria-label': 'Edit item',
  variant: 'secondary',
  size: 'md',
  onClick: () => console.log('clicked'),
};

// Using with refs
const buttonRef = useRef<HTMLButtonElement>(null);
<IconButton 
  ref={buttonRef}
  icon={<PencilIcon className="h-5 w-5" />}
  aria-label="Edit"
/>
```

## Icon Libraries

Recommended: **Heroicons** (already installed)

```tsx
import { 
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  PlusIcon,
  ArrowRightIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';  // Outline style
// or
from '@heroicons/react/24/solid';     // Solid style
```

Size your icons appropriately:
- Small button: `className="h-4 w-4"`
- Medium button: `className="h-5 w-5"`
- Large button: `className="h-6 w-6"`
