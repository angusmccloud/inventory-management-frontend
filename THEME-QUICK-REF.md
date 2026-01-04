# Theme System - Quick Reference

## Basic Usage

### Buttons

```tsx
// Primary action
<button className="bg-primary text-primary-contrast hover:bg-primary-hover">Save</button>

// Secondary action
<button className="bg-secondary text-secondary-contrast hover:bg-secondary-hover">Cancel</button>

// Outline
<button className="border border-border text-text-primary hover:bg-surface-hover">More</button>

// Danger
<button className="bg-error text-error-contrast hover:opacity-90">Delete</button>
```

### Cards

```tsx
<div className="rounded-lg border border-border bg-surface p-4">
  <h3 className="font-semibold text-text-primary">Card Title</h3>
  <p className="text-text-secondary">Card description</p>
</div>
```

### Forms

```tsx
<input
  className="border border-border bg-surface text-text-primary focus:border-border-focus focus:ring-2 focus:ring-primary/20"
  type="text"
/>
```

### Notifications

```tsx
// Success
<div className="bg-success text-success-contrast p-3 rounded">✓ Success!</div>

// Error
<div className="bg-error text-error-contrast p-3 rounded">✗ Error!</div>

// Warning
<div className="bg-warning text-warning-contrast p-3 rounded">⚠ Warning!</div>

// Info
<div className="bg-info text-info-contrast p-3 rounded">ℹ Info</div>
```

## Color Tokens

| Use Case         | Class                                  | Example           |
| ---------------- | -------------------------------------- | ----------------- |
| Primary button   | `bg-primary text-primary-contrast`     | Save, Submit      |
| Secondary button | `bg-secondary text-secondary-contrast` | Cancel, Back      |
| Card background  | `bg-surface`                           | Content cards     |
| Page background  | `bg-background`                        | Main page         |
| Heading text     | `text-text-primary`                    | H1, H2, H3        |
| Body text        | `text-text-primary`                    | Paragraphs        |
| Label/caption    | `text-text-secondary`                  | Form labels       |
| Disabled text    | `text-text-disabled`                   | Inactive elements |
| Border           | `border-border`                        | Card borders      |
| Focus ring       | `border-border-focus`                  | Input focus       |

## Helper Function

```tsx
import { getThemeClasses } from '@/lib/theme';

// Button variants
<button className={`${getThemeClasses('button', 'primary')} px-4 py-2 rounded`}>
  Primary
</button>

// Card
<div className={getThemeClasses('card')}>Content</div>

// Input
<input className={getThemeClasses('input')} type="text" />

// Notification
<div className={`${getThemeClasses('notification', 'success')} p-3 rounded`}>
  Success!
</div>
```

## Dark Mode Testing

**Browser DevTools**: Cmd/Ctrl+Shift+P → "Rendering" → "Emulate CSS media feature prefers-color-scheme" → "dark"

**System**:

- macOS: System Settings → Appearance
- Windows: Settings → Personalization → Colors
- Linux: Settings → Appearance

## Migration Pattern

```tsx
// ❌ Old way
<button className="bg-blue-500 text-white hover:bg-blue-600">
  Click me
</button>

// ✅ New way
<button className="bg-primary text-primary-contrast hover:bg-primary-hover">
  Click me
</button>
```

## Full Documentation

See [THEME.md](THEME.md) for complete documentation.
