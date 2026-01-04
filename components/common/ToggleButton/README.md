# ToggleButton Component

A fully accessible toggle switch component with consistent theming support.

## Features

- ✅ **Accessible**: WCAG 2.1 AA compliant with proper ARIA attributes
- ✅ **Keyboard support**: Space and Enter keys toggle the switch
- ✅ **Theme variants**: Primary, Secondary, Tertiary, Success, Warning, Error
- ✅ **Responsive sizes**: Small, Medium, Large with mobile-friendly touch targets
- ✅ **Form integration**: Optional hidden checkbox for form submission
- ✅ **Error handling**: Built-in error states and validation feedback
- ✅ **Help text**: Support for descriptions and contextual help
- ✅ **TypeScript**: Full type safety with strict mode

## Usage

### Basic Example

```tsx
import { ToggleButton } from '@/components/common';

function MyComponent() {
  const [isEnabled, setIsEnabled] = useState(false);

  return <ToggleButton checked={isEnabled} onChange={setIsEnabled} label="Enable notifications" />;
}
```

### With Description

```tsx
<ToggleButton
  checked={darkMode}
  onChange={setDarkMode}
  label="Dark mode"
  description="Use dark theme for better visibility in low light"
/>
```

### Different Variants

```tsx
// Primary (default)
<ToggleButton
  checked={enabled}
  onChange={setEnabled}
  label="Primary toggle"
  variant="primary"
/>

// Success
<ToggleButton
  checked={active}
  onChange={setActive}
  label="Active status"
  variant="success"
/>

// Error/Danger
<ToggleButton
  checked={dangerous}
  onChange={setDangerous}
  label="Danger mode"
  variant="error"
/>
```

### Sizes

```tsx
// Small
<ToggleButton
  checked={checked}
  onChange={setChecked}
  label="Small toggle"
  size="sm"
/>

// Medium (default)
<ToggleButton
  checked={checked}
  onChange={setChecked}
  label="Medium toggle"
  size="md"
/>

// Large
<ToggleButton
  checked={checked}
  onChange={setChecked}
  label="Large toggle"
  size="lg"
/>
```

### Form Integration

```tsx
<form onSubmit={handleSubmit}>
  <ToggleButton
    checked={agreedToTerms}
    onChange={setAgreedToTerms}
    label="I agree to the terms"
    name="terms_agreement"
    required
  />

  <button type="submit">Submit</button>
</form>
```

### With Error State

```tsx
<ToggleButton
  checked={accepted}
  onChange={setAccepted}
  label="Accept terms and conditions"
  error={!accepted ? 'You must accept the terms to continue' : undefined}
  required
/>
```

### Disabled State

```tsx
<ToggleButton
  checked={value}
  onChange={setValue}
  label="Disabled toggle"
  disabled
  helpText="This option is currently unavailable"
/>
```

## Props

| Prop           | Type                         | Default      | Description                                                                       |
| -------------- | ---------------------------- | ------------ | --------------------------------------------------------------------------------- |
| `checked`      | `boolean`                    | **Required** | Whether the toggle is in the "on" state                                           |
| `onChange`     | `(checked: boolean) => void` | **Required** | Change handler - receives new checked state                                       |
| `label`        | `string`                     | **Required** | Label text for accessibility                                                      |
| `visibleLabel` | `string`                     | `undefined`  | Optional visible label (if different from aria-label)                             |
| `description`  | `string`                     | `undefined`  | Optional description text shown below label                                       |
| `variant`      | `ToggleButtonVariant`        | `'primary'`  | Visual variant: `primary`, `secondary`, `tertiary`, `success`, `warning`, `error` |
| `size`         | `ToggleButtonSize`           | `'md'`       | Size: `sm`, `md`, `lg`                                                            |
| `disabled`     | `boolean`                    | `false`      | Whether the toggle is disabled                                                    |
| `required`     | `boolean`                    | `false`      | Whether this field is required                                                    |
| `error`        | `string`                     | `undefined`  | Error message (shows red styling)                                                 |
| `helpText`     | `string`                     | `undefined`  | Help text shown below the toggle                                                  |
| `name`         | `string`                     | `undefined`  | HTML name attribute for forms                                                     |
| `className`    | `string`                     | `''`         | Additional CSS classes                                                            |
| `testId`       | `string`                     | `undefined`  | Test ID for testing                                                               |

## Accessibility

The ToggleButton component follows WCAG 2.1 AA guidelines:

- **ARIA role**: Uses `role="switch"` for proper screen reader support
- **ARIA attributes**: Includes `aria-checked` and `aria-label`
- **Keyboard navigation**: Full keyboard support (Space, Enter)
- **Focus indicators**: Visible focus ring with theme colors
- **Touch targets**: Minimum 44x44px on mobile devices
- **Descriptive text**: Supports `aria-describedby` for help text and errors

## Theme Integration

The component uses CSS variables from the global theme:

```css
--color-primary
--color-secondary
--color-tertiary
--color-success
--color-warning
--color-error
--color-border
```

All variants automatically adapt to light and dark themes.

## Testing

The component includes comprehensive tests covering:

- Rendering with all prop combinations
- Accessibility (ARIA attributes, keyboard navigation)
- User interactions (click, keyboard)
- Visual states (checked, unchecked, disabled)
- Form integration
- All variants and sizes

Run tests:

```bash
npm test -- ToggleButton.test.tsx
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Related Components

- [Button](../Button/README.md) - Action buttons
- [Checkbox](../Checkbox/README.md) - Multi-selection checkboxes
- [Radio](../Radio/README.md) - Single-selection radio buttons
- [ThemeToggle](../ThemeToggle.tsx) - Specialized theme switcher

## Feature

Part of Feature: `008-common-components` - Common UI component library
