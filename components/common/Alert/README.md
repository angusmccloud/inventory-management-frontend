# Alert Component

Contextual message display for notifications and feedback with severity-based styling and accessibility features.

## Features

- **Severity Variants**: info, success, warning, error with appropriate colors and icons
- **Optional Title**: Bold heading above the message
- **Dismissible**: Optional close button with callback
- **Accessibility**: ARIA live regions (polite/assertive) and proper role attributes
- **Dark Mode**: Full theme support with dark mode variants

## Usage

### Basic Alert

```tsx
import { Alert } from '@/components/common';

<Alert severity="success">Item successfully added to inventory.</Alert>;
```

### Alert with Title

```tsx
<Alert severity="info" title="Pro Tip">
  You can use the search bar to quickly find items in your inventory.
</Alert>
```

### Dismissible Alert

```tsx
const [showAlert, setShowAlert] = useState(true);

{
  showAlert && (
    <Alert
      severity="warning"
      title="Low Stock Warning"
      dismissible
      onDismiss={() => setShowAlert(false)}
    >
      Several items are running low. Consider restocking soon.
    </Alert>
  );
}
```

### Error Alert

```tsx
<Alert severity="error" title="Failed to Save">
  An error occurred while saving your changes. Please try again.
</Alert>
```

## Props

| Prop          | Type                                          | Default     | Description                      |
| ------------- | --------------------------------------------- | ----------- | -------------------------------- |
| `severity`    | `'info' \| 'success' \| 'warning' \| 'error'` | Required    | Determines color scheme and icon |
| `title`       | `string`                                      | `undefined` | Optional bold heading            |
| `children`    | `ReactNode`                                   | Required    | Alert message content            |
| `dismissible` | `boolean`                                     | `false`     | Show close button                |
| `onDismiss`   | `() => void`                                  | `undefined` | Callback when dismissed          |
| `className`   | `string`                                      | `undefined` | Additional CSS classes           |

## Accessibility

- Uses ARIA `role="status"` for info/success
- Uses ARIA `role="alert"` for warning/error
- `aria-live="polite"` for info/success
- `aria-live="assertive"` for warning/error (interrupts screen readers)
- Close button has `aria-label="Dismiss alert"`

## Severity Variants

### Info (Blue)

- Use for: General information, tips, feature announcements
- Icon: Information circle
- Example: "Your changes have been saved automatically"

### Success (Green)

- Use for: Successful operations, confirmations
- Icon: Check circle
- Example: "Item added to inventory successfully"

### Warning (Yellow)

- Use for: Cautions, non-critical issues, reminders
- Icon: Exclamation triangle
- Example: "This item is running low on stock"

### Error (Red)

- Use for: Failures, validation errors, critical issues
- Icon: X circle
- Example: "Failed to connect to server. Please try again"

## Examples

### Form Validation Error

```tsx
{
  formError && (
    <Alert severity="error" dismissible onDismiss={() => setFormError(null)}>
      {formError}
    </Alert>
  );
}
```

### Success Message with Auto-dismiss

```tsx
{
  successMessage && <Alert severity="success">{successMessage}</Alert>;
}

// In your submit handler:
setSuccessMessage('Changes saved!');
setTimeout(() => setSuccessMessage(null), 5000);
```

### Info Banner

```tsx
<Alert severity="info" title="New Feature Available">
  Check out the new shopping list feature!
  <a href="/dashboard/shopping-list" className="ml-1 underline">
    Try it now
  </a>
</Alert>
```

## Best Practices

1. **Keep messages concise** - Users should understand the issue/info at a glance
2. **Use appropriate severity** - Don't use error for non-critical issues
3. **Provide actionable information** - Tell users what to do next
4. **Consider auto-dismiss** - Success messages can auto-hide after 5 seconds
5. **Don't overuse dismissible** - Only if the alert isn't critical and user needs screen space
6. **Position correctly** - Place alerts near the relevant content or at the top of forms
