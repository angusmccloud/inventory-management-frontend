# Button Component

Primary action button with variants for different contexts, built-in loading states, and icon support.

## Features

- **Three Variants**: Primary, Secondary, Danger
- **Three Sizes**: Small, Medium, Large
- **Loading States**: Built-in spinner with automatic disable
- **Icon Support**: Left and right icon positioning
- **Full Width Option**: Stretch to container width
- **Theme-Aware**: Automatic light/dark mode support
- **Accessible**: ARIA attributes, keyboard navigation, focus rings

## Basic Usage

```tsx
import { Button } from '@/components/common';

// Primary button (default)
<Button onClick={handleSave}>
  Save Changes
</Button>

// Secondary button
<Button variant="secondary" onClick={handleCancel}>
  Cancel
</Button>

// Danger button for destructive actions
<Button variant="danger" onClick={handleDelete}>
  Delete Item
</Button>
```

## Variants

### Primary (Default)
Main call-to-action with high contrast. Use for the primary action on a page.

```tsx
<Button variant="primary" onClick={handleSubmit}>
  Submit Form
</Button>
```

### Secondary
Alternative actions with lower visual weight. Use for secondary actions.

```tsx
<Button variant="secondary" onClick={handleCancel}>
  Cancel
</Button>
```

### Danger
Destructive actions like delete or remove. Use sparingly for irreversible actions.

```tsx
<Button variant="danger" onClick={handleDelete}>
  Delete Item
</Button>
```

## Sizes

```tsx
// Small
<Button size="sm">Small Button</Button>

// Medium (default)
<Button size="md">Medium Button</Button>

// Large
<Button size="lg">Large Button</Button>
```

## Loading State

Shows a spinner and automatically disables the button during asynchronous operations.

```tsx
const [isSaving, setIsSaving] = useState(false);

<Button 
  variant="primary" 
  loading={isSaving}
  onClick={async () => {
    setIsSaving(true);
    await saveData();
    setIsSaving(false);
  }}
>
  Save Changes
</Button>
```

## Icons

Add icons before or after button text using Heroicons:

```tsx
import { PlusIcon, TrashIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

// Left icon
<Button leftIcon={<PlusIcon className="h-5 w-5" />}>
  Add Item
</Button>

// Right icon
<Button rightIcon={<ArrowRightIcon className="h-5 w-5" />}>
  Continue
</Button>

// Both icons
<Button 
  leftIcon={<PlusIcon className="h-5 w-5" />}
  rightIcon={<ArrowRightIcon className="h-5 w-5" />}
>
  Add and Continue
</Button>

// Icon with loading state (spinner replaces left icon)
<Button 
  leftIcon={<PlusIcon className="h-5 w-5" />}
  loading={isAdding}
>
  Add Item
</Button>
```

**Icon Sizes**:
- Small button: `h-4 w-4`
- Medium button: `h-5 w-5`
- Large button: `h-6 w-6`

## Full Width

Stretch button to fill container width (useful for mobile forms):

```tsx
<div className="max-w-md">
  <Button fullWidth onClick={handleSubmit}>
    Submit Form
  </Button>
</div>
```

## Disabled State

```tsx
<Button disabled onClick={handleClick}>
  Disabled Button
</Button>

// Disabled during loading (automatic)
<Button loading onClick={handleClick}>
  Loading Button
</Button>
```

## Custom Styling

Add additional Tailwind classes via `className`:

```tsx
<Button className="mt-4 shadow-lg">
  Custom Styled Button
</Button>
```

## Form Integration

Buttons automatically work as form submit buttons:

```tsx
<form onSubmit={handleSubmit}>
  <input type="text" name="name" />
  <Button type="submit" variant="primary">
    Submit
  </Button>
  <Button type="button" variant="secondary" onClick={handleCancel}>
    Cancel
  </Button>
</form>
```

## Best Practices

### ✅ Do

- Use one primary button per section/page
- Use danger variant for destructive actions (delete, remove, revoke)
- Show loading state during async operations
- Use appropriate size for context (sm for table actions, lg for forms)
- Include meaningful text labels (avoid "Submit", "OK", "Yes")

```tsx
// Good: Clear intent
<Button variant="danger" leftIcon={<TrashIcon />} loading={isDeleting}>
  Delete Item
</Button>

// Good: Contextual sizing
<td>
  <Button size="sm" variant="secondary">Edit</Button>
</td>
```

### ❌ Don't

- Don't use multiple primary buttons in the same section
- Don't use danger variant for non-destructive actions
- Don't forget to handle loading states for async operations
- Don't use generic labels without context
- Don't use buttons for navigation (use Link component)

```tsx
// Bad: Multiple primary buttons compete for attention
<div>
  <Button variant="primary">Save</Button>
  <Button variant="primary">Cancel</Button>
</div>

// Bad: Button for navigation
<Button onClick={() => router.push('/dashboard')}>
  Go to Dashboard
</Button>

// Good: Use Link component for navigation
<Link href="/dashboard">Go to Dashboard</Link>
```

## Accessibility

- **ARIA Attributes**: Automatically sets `aria-busy` and `aria-disabled`
- **Keyboard**: Activated with Enter or Space
- **Focus Ring**: Visible focus indicator meets WCAG requirements
- **Disabled State**: Properly communicated to screen readers
- **Loading State**: Announced via `aria-busy="true"`

```tsx
// Accessibility is built-in
<Button loading={isSaving}>
  {/* aria-busy="true" automatically set when loading */}
  Save Changes
</Button>
```

## Common Patterns

### Form Actions

```tsx
<div className="flex gap-2 justify-end">
  <Button variant="secondary" onClick={handleCancel}>
    Cancel
  </Button>
  <Button variant="primary" type="submit" loading={isSaving}>
    Save Changes
  </Button>
</div>
```

### Destructive Confirmation

```tsx
<div className="flex gap-2">
  <Button variant="secondary" onClick={onCancel}>
    Keep Item
  </Button>
  <Button variant="danger" onClick={handleDelete} loading={isDeleting}>
    Delete Forever
  </Button>
</div>
```

### Mobile Full-Width Actions

```tsx
<div className="md:inline-flex md:gap-2">
  <Button fullWidth className="mb-2 md:mb-0 md:w-auto">
    Primary Action
  </Button>
  <Button variant="secondary" fullWidth className="md:w-auto">
    Secondary Action
  </Button>
</div>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'primary' \| 'secondary' \| 'danger'` | `'primary'` | Button visual style |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Button size |
| `loading` | `boolean` | `false` | Show loading spinner, disable interaction |
| `fullWidth` | `boolean` | `false` | Stretch to container width |
| `disabled` | `boolean` | `false` | Disable button |
| `leftIcon` | `React.ReactNode` | `undefined` | Icon before text |
| `rightIcon` | `React.ReactNode` | `undefined` | Icon after text |
| `className` | `string` | `undefined` | Additional CSS classes |
| `children` | `React.ReactNode` | Required | Button label text |
| `onClick` | `() => void` | `undefined` | Click handler |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | HTML button type |

Plus all standard HTML button attributes (`disabled`, `type`, `form`, etc.)

## TypeScript

```tsx
import type { ButtonProps, ButtonVariant, ButtonSize } from '@/components/common';

// Fully typed props
const props: ButtonProps = {
  variant: 'primary',
  size: 'md',
  loading: false,
  onClick: () => console.log('clicked'),
  children: 'Click me',
};

// Using with refs
const buttonRef = useRef<HTMLButtonElement>(null);
<Button ref={buttonRef}>Click me</Button>
```
