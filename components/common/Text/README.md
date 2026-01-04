# Text Component

Typography component with semantic variants for consistent text rendering across the application.

## Features

- **Semantic Variants**: h1-h6, body, bodySmall, caption, label
- **Theme-Aware Colors**: Automatically adapts to light/dark mode
- **Polymorphic**: Can render as any HTML element
- **Type-Safe**: Full TypeScript support with explicit types
- **Accessible**: Semantic HTML elements for screen readers

## Basic Usage

```tsx
import { Text } from '@/components/common';

// Page title
<Text as="h1" variant="h1">
  Inventory Management
</Text>

// Section heading
<Text as="h2" variant="h2">
  Recent Items
</Text>

// Body text (default)
<Text variant="body" color="secondary">
  Manage your household items and supplies.
</Text>

// Caption/metadata
<Text variant="caption" color="tertiary">
  Last updated {lastUpdated}
</Text>
```

## Typography Scale

| Variant     | Size        | Weight   | Use Case            | Default Element |
| ----------- | ----------- | -------- | ------------------- | --------------- |
| `h1`        | 3xl (30px)  | Bold     | Page titles         | `<h1>`          |
| `h2`        | 2xl (24px)  | Bold     | Section headings    | `<h2>`          |
| `h3`        | xl (20px)   | Semibold | Subsection headings | `<h3>`          |
| `h4`        | lg (18px)   | Semibold | Card titles         | `<h4>`          |
| `h5`        | base (16px) | Semibold | Small headings      | `<h5>`          |
| `h6`        | sm (14px)   | Semibold | Tiny headings       | `<h6>`          |
| `body`      | base (16px) | Normal   | Default text        | `<p>`           |
| `bodySmall` | sm (14px)   | Normal   | Smaller text        | `<p>`           |
| `caption`   | xs (12px)   | Normal   | Fine print          | `<span>`        |
| `label`     | sm (14px)   | Semibold | Form labels         | `<label>`       |

## Color Variants

```tsx
// Primary (default) - Main content
<Text color="primary">Primary text color</Text>

// Secondary - Supporting text
<Text color="secondary">Secondary text color</Text>

// Tertiary - Subtle text
<Text color="tertiary">Tertiary text color</Text>

// Semantic colors
<Text color="success">Success message</Text>
<Text color="warning">Warning message</Text>
<Text color="error">Error message</Text>
<Text color="info">Info message</Text>

// Inverse - Light text on dark background
<div className="bg-primary p-4">
  <Text color="inverse">Light text on dark background</Text>
</div>
```

## Polymorphic Rendering

The `as` prop allows rendering as any HTML element while maintaining type safety:

```tsx
// Render as different elements
<Text as="h1" variant="h1">Heading 1</Text>
<Text as="span" variant="caption">Inline caption</Text>
<Text as="label" variant="label" htmlFor="email">Email</Text>
<Text as="div" variant="body">Block content</Text>

// HTML attributes are properly typed based on 'as' prop
<Text as="a" variant="body" href="/dashboard" target="_blank">
  Link text
</Text>
```

## Font Weight Override

Override the default weight for specific use cases:

```tsx
<Text variant="body" weight="semibold">
  Important body text
</Text>

<Text variant="h3" weight="normal">
  Lighter heading
</Text>
```

**Note**: Use weight override sparingly. Variants have appropriate default weights for their semantic meaning.

## Custom Styling

Add custom Tailwind classes via `className`:

```tsx
<Text variant="h2" className="mb-4 text-center">
  Centered Heading with Margin
</Text>

<Text variant="body" className="underline hover:no-underline">
  Hover effect text
</Text>
```

## Best Practices

### ✅ Do

- Use semantic variants that match content meaning
- Pair `as` and `variant` semantically (e.g., `as="h1"` with `variant="h1"`)
- Use `color` prop for theme-aware text colors
- Use `label` variant for form labels

```tsx
// Good: Semantic alignment
<Text as="h1" variant="h1">Page Title</Text>
<Text as="label" variant="label" htmlFor="name">Name</Text>
```

### ❌ Don't

- Don't use `as="h1"` with `variant="body"` (semantic mismatch)
- Don't apply font-family directly (theme handles this)
- Don't use inline styles for colors (use `color` prop)
- Don't override font-size with className (use correct variant)

```tsx
// Bad: Semantic mismatch
<Text as="h1" variant="body">Title</Text>

// Bad: Bypassing theme
<Text style={{ color: '#FF0000' }}>Error</Text>
```

## Accessibility

- Headings (h1-h6) create proper document outline for screen readers
- Semantic HTML elements improve navigation
- Theme colors meet WCAG 2.1 AA contrast ratios
- Use appropriate heading levels (don't skip levels)

```tsx
// Good: Proper heading hierarchy
<Text as="h1" variant="h1">Main Title</Text>
<Text as="h2" variant="h2">Section</Text>
<Text as="h3" variant="h3">Subsection</Text>

// Bad: Skipped h2
<Text as="h1" variant="h1">Main Title</Text>
<Text as="h3" variant="h3">Subsection</Text>
```

## Props

| Prop        | Type                | Default     | Description                 |
| ----------- | ------------------- | ----------- | --------------------------- |
| `as`        | `React.ElementType` | `'p'`       | HTML element to render      |
| `variant`   | `TextVariant`       | `'body'`    | Semantic typography variant |
| `color`     | `TextColor`         | `'primary'` | Theme-aware text color      |
| `children`  | `React.ReactNode`   | Required    | Text content                |
| `className` | `string`            | `undefined` | Additional CSS classes      |
| `weight`    | `FontWeight`        | `undefined` | Font weight override        |

## TypeScript

```tsx
import type { TextProps, TextVariant, TextColor } from '@/components/common';

// Fully typed props
const props: TextProps = {
  variant: 'h1',
  color: 'primary',
  children: 'Title',
};

// Polymorphic with element-specific props
<Text<'a'> as="a" variant="body" href="/link" target="_blank">
  Link
</Text>;
```
