# Link Component

Styled anchor element with Next.js integration, external link detection, and consistent appearance across the application.

## Features

- **Next.js Integration**: Uses Next.js Link for internal navigation (client-side routing)
- **External Link Detection**: Automatically detects and handles external URLs
- **Visual Variants**: default, primary, subtle styles
- **External Icon**: Optional icon indicator for external links
- **Accessibility**: Proper focus states and external link indicators
- **Dark Mode**: Full theme support

## Usage

### Internal Link (Default)

```tsx
import { Link } from '@/components/common';

<Link href="/dashboard/inventory">
  View Inventory
</Link>
```

### External Link

```tsx
// Automatically detected
<Link href="https://example.com">
  Visit Website
</Link>

// Or explicitly marked
<Link href="https://docs.example.com" external>
  View Documentation
</Link>
```

### Link Variants

```tsx
// Default: blue with underline on hover
<Link href="/settings" variant="default">
  Settings
</Link>

// Primary: bold with constant underline
<Link href="/dashboard" variant="primary">
  Dashboard
</Link>

// Subtle: gray, no underline
<Link href="/help" variant="subtle">
  Help
</Link>
```

### Hide External Icon

```tsx
<Link href="https://example.com" showExternalIcon={false}>
  External Link Without Icon
</Link>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `href` | `string` | Required | Link destination (relative or absolute URL) |
| `children` | `ReactNode` | Required | Link content/text |
| `variant` | `'default' \| 'primary' \| 'subtle'` | `'default'` | Visual style variant |
| `external` | `boolean` | Auto-detected | Force external link behavior |
| `showExternalIcon` | `boolean` | `true` | Show external link icon |
| `className` | `string` | `undefined` | Additional CSS classes |

## Variants

### Default
- **Use for**: Standard inline links, navigation links
- **Style**: Blue color, underline on hover
- **Example**: "View details", "Learn more"

```tsx
<Link href="/profile">View Profile</Link>
```

### Primary
- **Use for**: Important call-to-action links
- **Style**: Blue color, bold text, always underlined
- **Example**: Primary navigation, emphasized links

```tsx
<Link href="/get-started" variant="primary">Get Started</Link>
```

### Subtle
- **Use for**: Secondary navigation, less prominent links
- **Style**: Gray color, no underline
- **Example**: Footer links, breadcrumbs, metadata links

```tsx
<Link href="/terms" variant="subtle">Terms of Service</Link>
```

## External Link Detection

The Link component automatically detects external URLs:

- **Internal**: Paths starting with `/` or `#` (uses Next.js Link)
- **External**: Full URLs with different domains (opens in new tab)

```tsx
// Internal (Next.js Link, client-side navigation)
<Link href="/dashboard">Dashboard</Link>
<Link href="#section">Jump to section</Link>

// External (standard anchor, opens in new tab)
<Link href="https://github.com">GitHub</Link>
<Link href="https://docs.example.com">Docs</Link>
```

You can override detection:

```tsx
// Force external treatment
<Link href="/api/download" external>Download File</Link>
```

## Examples

### Navigation Link

```tsx
<nav className="flex gap-4">
  <Link href="/dashboard">Dashboard</Link>
  <Link href="/inventory">Inventory</Link>
  <Link href="/shopping-list">Shopping List</Link>
  <Link href="/members">Members</Link>
</nav>
```

### External Documentation Link

```tsx
<div className="text-sm text-gray-600 dark:text-gray-400">
  Need help? Check out our{' '}
  <Link href="https://docs.example.com">documentation</Link>.
</div>
```

### Inline Link in Text

```tsx
<p>
  To learn more about inventory management,{' '}
  <Link href="/docs/inventory">read the guide</Link>.
</p>
```

### Footer Links

```tsx
<footer className="flex gap-4 text-sm">
  <Link href="/privacy" variant="subtle">Privacy Policy</Link>
  <Link href="/terms" variant="subtle">Terms of Service</Link>
  <Link href="/contact" variant="subtle">Contact Us</Link>
</footer>
```

### Link with Custom Styling

```tsx
<Link 
  href="/dashboard" 
  className="text-lg font-bold"
>
  Go to Dashboard
</Link>
```

## Accessibility

- Uses semantic `<a>` elements
- External links include `target="_blank"` and `rel="noopener noreferrer"` for security
- External icon includes `aria-label="(opens in new tab)"`
- Proper focus states with visible ring
- Keyboard navigable

## Next.js Integration

### Client-Side Navigation

Internal links use Next.js `Link` component for optimal performance:

- **Prefetching**: Links in viewport are prefetched automatically
- **Client-side routing**: No full page reload
- **Scroll restoration**: Browser back/forward works correctly

### Programmatic Navigation

For programmatic navigation, use Next.js router:

```tsx
import { useRouter } from 'next/navigation';

const router = useRouter();

// Instead of:
// <Link href="/dashboard">Go</Link>

// Use:
router.push('/dashboard');
```

## Best Practices

1. **Use meaningful link text** - Avoid "click here", use descriptive text
2. **Don't nest interactive elements** - No buttons inside links
3. **Choose appropriate variant** - Match importance and context
4. **External links open new tabs** - Users expect this behavior
5. **Consider focus states** - Ensure visible keyboard navigation
6. **Test keyboard navigation** - Tab through links to verify order

## Related Components

- **Button**: Use for actions (submit, delete), not navigation
- **Text**: Can contain Link components for inline text links
- **TabNavigation**: Use for tab-based content switching

## Common Patterns

### Breadcrumb Links

```tsx
<div className="flex items-center gap-2 text-sm">
  <Link href="/dashboard" variant="subtle">Dashboard</Link>
  <span className="text-gray-400">/</span>
  <Link href="/dashboard/inventory" variant="subtle">Inventory</Link>
  <span className="text-gray-400">/</span>
  <span className="text-gray-600 dark:text-gray-400">Item Details</span>
</div>
```

### Card Link

```tsx
<Card 
  interactive 
  onClick={() => router.push('/item/123')}
  className="cursor-pointer"
>
  <h3 className="font-semibold mb-2">Item Name</h3>
  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
    Description...
  </p>
  <Link href="/item/123" variant="primary">
    View Details →
  </Link>
</Card>
```
