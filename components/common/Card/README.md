# Card Component

Container component for grouping related content with consistent styling, elevation, padding, and optional interactive behavior.

## Features

- **Four Elevation Levels**: Flat, Low, Medium, High
- **Four Padding Options**: None, Small, Medium, Large
- **Interactive Mode**: Hover effects and click handling for navigable cards
- **Theme-Aware**: Automatic light/dark mode support
- **Accessible**: Keyboard navigation, focus rings, semantic roles

## Basic Usage

```tsx
import { Card } from '@/components/common';

// Basic card
<Card>
  <h3>Card Title</h3>
  <p>Card content goes here...</p>
</Card>

// Card with custom elevation and padding
<Card elevation="medium" padding="lg">
  <h2>Important Section</h2>
  <p>This card has more shadow and padding.</p>
</Card>
```

## Elevation Levels

Control the shadow depth to indicate hierarchy and layering:

```tsx
// Flat - No shadow, border only
<Card elevation="flat">
  <p>Subtle container with border only</p>
</Card>

// Low (default) - Subtle shadow
<Card elevation="low">
  <p>Standard card elevation</p>
</Card>

// Medium - Moderate shadow (elevated above surface)
<Card elevation="medium">
  <p>Elevated content like featured items</p>
</Card>

// High - Strong shadow (modals, dropdowns, important panels)
<Card elevation="high">
  <p>Highly elevated content</p>
</Card>
```

**Use Cases**:
- **Flat**: Subtle containers, list items, inline forms
- **Low**: Default cards, content sections, dashboard widgets
- **Medium**: Featured content, expanded details, sidebar panels
- **High**: Modals, dropdowns, popovers, sticky headers

## Padding Options

Control internal spacing:

```tsx
// None - No padding (custom layout)
<Card padding="none">
  <div className="p-4 border-b bg-surface-elevated">
    <h3>Card Header</h3>
  </div>
  <div className="p-4">
    <p>Card Body</p>
  </div>
  <div className="p-4 border-t bg-surface-elevated">
    <button>Action</button>
  </div>
</Card>

// Small - Compact padding (p-3)
<Card padding="sm">
  <p>Compact content</p>
</Card>

// Medium (default) - Standard padding (p-4)
<Card padding="md">
  <p>Standard spacing</p>
</Card>

// Large - Generous padding (p-6)
<Card padding="lg">
  <h2>Important Content</h2>
  <p>More breathing room for emphasis</p>
</Card>
```

## Interactive Cards

Make cards clickable for navigation or actions:

```tsx
import { useRouter } from 'next/navigation';

const router = useRouter();

// Clickable card (navigates to item details)
<Card 
  interactive 
  onClick={() => router.push(`/items/${item.id}`)}
>
  <h3>{item.name}</h3>
  <p>{item.description}</p>
  <span className="text-sm text-text-secondary">
    Click to view details
  </span>
</Card>

// Interactive card with keyboard support (Enter/Space)
<Card 
  interactive
  onClick={handleExpand}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleExpand();
    }
  }}
>
  <p>Press Enter to expand</p>
</Card>
```

**Interactive Mode Features**:
- Hover effect (darker background)
- Increased shadow on hover
- Cursor pointer
- Focus ring (keyboard navigation)
- Accessible with `role="button"` and `tabIndex={0}`

## Common Patterns

### Item Card

```tsx
<Card elevation="low" padding="md">
  <div className="flex items-start justify-between">
    <div>
      <h3 className="font-semibold text-lg">{item.name}</h3>
      <p className="text-text-secondary text-sm">{item.location}</p>
    </div>
    <Badge variant={item.status === 'active' ? 'success' : 'default'}>
      {item.status}
    </Badge>
  </div>
  <p className="mt-2 text-text-secondary">{item.description}</p>
  <div className="mt-4 flex gap-2">
    <Button size="sm" variant="secondary">Edit</Button>
    <Button size="sm" variant="danger">Delete</Button>
  </div>
</Card>
```

### Dashboard Widget

```tsx
<Card elevation="low" padding="lg">
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-xl font-bold">Total Items</h2>
    <PackageIcon className="h-8 w-8 text-primary" />
  </div>
  <p className="text-4xl font-bold">{itemCount}</p>
  <p className="text-sm text-text-secondary mt-1">
    +{recentCount} added this week
  </p>
</Card>
```

### Custom Layout with Sections

```tsx
<Card padding="none">
  {/* Header */}
  <div className="p-4 border-b bg-surface-elevated">
    <h2 className="font-semibold">Settings</h2>
  </div>
  
  {/* Body with custom padding */}
  <div className="p-6">
    <form>
      <Input label="Name" />
      <Input label="Email" />
    </form>
  </div>
  
  {/* Footer */}
  <div className="p-4 border-t bg-surface-elevated flex justify-end gap-2">
    <Button variant="secondary">Cancel</Button>
    <Button variant="primary">Save</Button>
  </div>
</Card>
```

### List of Interactive Cards

```tsx
<div className="space-y-3">
  {items.map(item => (
    <Card 
      key={item.id}
      interactive
      onClick={() => selectItem(item.id)}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium">{item.name}</h3>
          <p className="text-sm text-text-secondary">{item.category}</p>
        </div>
        <ArrowRightIcon className="h-5 w-5 text-text-secondary" />
      </div>
    </Card>
  ))}
</div>
```

## Best Practices

### ✅ Do

- Use elevation to indicate hierarchy (higher elevation = more important)
- Use interactive mode for clickable cards
- Keep card content focused (one main topic per card)
- Use consistent padding across similar cards
- Add hover feedback for interactive cards

```tsx
// Good: Clear hierarchy with elevation
<Card elevation="medium">
  <h2>Featured Item</h2>
</Card>

// Good: Interactive with clear affordance
<Card interactive onClick={handleClick}>
  <p>Click to expand</p>
  <ArrowRightIcon />
</Card>
```

### ❌ Don't

- Don't nest cards inside cards (use sections or nested divs instead)
- Don't use high elevation for regular content (reserve for overlays)
- Don't make entire card interactive if only specific elements should be clickable
- Don't use excessive padding on mobile (sm or md preferred)

```tsx
// Bad: Card nesting
<Card>
  <Card>Nested card</Card>
</Card>

// Bad: Conflicting interactions
<Card interactive onClick={handleCard}>
  <Button onClick={handleButton}>Button</Button>
</Card>

// Good: Specific clickable elements
<Card>
  <h3>Card Title</h3>
  <Button onClick={handleButton}>Action</Button>
</Card>
```

## Accessibility

- **Interactive Cards**: Automatically receive `role="button"`, `tabIndex="0"`, and focus ring
- **Keyboard Navigation**: Interactive cards are focusable and activate with Enter/Space
- **Focus Indicators**: Visible focus ring meets WCAG requirements
- **Semantic HTML**: Uses `<div>` with appropriate ARIA roles

```tsx
// Accessibility is built-in for interactive cards
<Card interactive onClick={handleClick}>
  {/* Automatically gets:
      - role="button"
      - tabIndex={0}
      - keyboard event handling
      - focus ring
  */}
  Content
</Card>
```

## Responsive Design

```tsx
// Adjust padding on mobile
<Card padding="sm" className="md:p-6">
  <h2>Responsive Card</h2>
</Card>

// Grid of cards
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <Card>Card 1</Card>
  <Card>Card 2</Card>
  <Card>Card 3</Card>
</div>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `elevation` | `'flat' \| 'low' \| 'medium' \| 'high'` | `'low'` | Shadow/elevation level |
| `padding` | `'none' \| 'sm' \| 'md' \| 'lg'` | `'md'` | Internal padding size |
| `interactive` | `boolean` | `false` | Enable hover effects and click handling |
| `children` | `React.ReactNode` | Required | Card content |
| `className` | `string` | `undefined` | Additional CSS classes |
| `onClick` | `() => void` | `undefined` | Click handler (pairs with interactive) |

Plus all standard HTML div attributes (`id`, `aria-*`, `data-*`, etc.)

## TypeScript

```tsx
import type { CardProps, CardElevation, CardPadding } from '@/components/common';

// Fully typed props
const props: CardProps = {
  elevation: 'medium',
  padding: 'lg',
  interactive: true,
  onClick: () => console.log('clicked'),
  children: 'Content',
};

// Using with refs
const cardRef = useRef<HTMLDivElement>(null);
<Card ref={cardRef}>Content</Card>
```
