# Theme System

This application uses a comprehensive theme system that automatically adapts to system preferences (light/dark mode).

## Overview

- **Automatic Mode**: Theme switches based on `prefers-color-scheme` media query
- **No Manual Toggle**: Respects user's system-wide preference
- **CSS Custom Properties**: Uses CSS variables for maximum flexibility
- **Tailwind Integration**: Seamless integration with Tailwind CSS utilities

## Quick Start

### Using Theme Colors in Components

```tsx
import { getThemeClasses } from '@/lib/theme';

// Primary button
<button className="bg-primary text-primary-contrast hover:bg-primary-hover px-4 py-2 rounded">
  Save
</button>

// Card with theme colors
<div className="bg-surface border border-border rounded-lg p-4">
  <h3 className="text-text-primary font-semibold">Card Title</h3>
  <p className="text-text-secondary">Card description</p>
</div>

// Using helper function
<button className={`${getThemeClasses('button', 'primary')} px-4 py-2 rounded`}>
  Primary Button
</button>

// Success notification
<div className="bg-success text-success-contrast p-3 rounded">
  Operation successful!
</div>
```

## Color Palette

### Brand Colors

| Token                | Light Mode       | Dark Mode              | Usage                  |
| -------------------- | ---------------- | ---------------------- | ---------------------- |
| `primary`            | Blue (#0ea5e9)   | Light Blue (#38bdf8)   | Primary actions, links |
| `primary-contrast`   | White            | Dark Gray              | Text on primary        |
| `primary-hover`      | Darker Blue      | Lighter Blue           | Hover states           |
| `secondary`          | Indigo (#6366f1) | Light Indigo (#818cf8) | Secondary actions      |
| `secondary-contrast` | White            | Dark Gray              | Text on secondary      |
| `secondary-hover`    | Darker Indigo    | Lighter Indigo         | Hover states           |

### Surface Colors

| Token              | Light Mode | Dark Mode | Usage             |
| ------------------ | ---------- | --------- | ----------------- |
| `surface`          | White      | Gray-800  | Cards, panels     |
| `surface-elevated` | Gray-50    | Gray-700  | Modals, dropdowns |
| `surface-hover`    | Gray-100   | Gray-600  | Hover states      |
| `background`       | Gray-50    | Gray-900  | Page background   |

### Text Colors

| Token            | Light Mode | Dark Mode | Usage               |
| ---------------- | ---------- | --------- | ------------------- |
| `text-primary`   | Gray-900   | Gray-100  | Headings, body text |
| `text-secondary` | Gray-500   | Gray-400  | Captions, labels    |
| `text-disabled`  | Gray-300   | Gray-600  | Disabled text       |

### Border Colors

| Token          | Light Mode | Dark Mode  | Usage           |
| -------------- | ---------- | ---------- | --------------- |
| `border`       | Gray-200   | Gray-700   | Default borders |
| `border-focus` | Blue       | Light Blue | Focus rings     |

### Semantic Colors

| Token              | Light Mode | Dark Mode | Usage            |
| ------------------ | ---------- | --------- | ---------------- |
| `success`          | Green-500  | Green-400 | Success messages |
| `success-contrast` | White      | Dark Gray | Text on success  |
| `warning`          | Amber-500  | Amber-400 | Warnings         |
| `warning-contrast` | White      | Dark Gray | Text on warning  |
| `error`            | Red-500    | Red-400   | Errors           |
| `error-contrast`   | White      | Dark Gray | Text on error    |
| `info`             | Blue-500   | Blue-400  | Info messages    |
| `info-contrast`    | White      | Dark Gray | Text on info     |

## Common Patterns

### Buttons

```tsx
// Primary button
<button className="bg-primary text-primary-contrast hover:bg-primary-hover px-4 py-2 rounded">
  Primary
</button>

// Secondary button
<button className="bg-secondary text-secondary-contrast hover:bg-secondary-hover px-4 py-2 rounded">
  Secondary
</button>

// Outline button
<button className="bg-transparent border border-border text-text-primary hover:bg-surface-hover px-4 py-2 rounded">
  Outline
</button>

// Danger button
<button className="bg-error text-error-contrast hover:opacity-90 px-4 py-2 rounded">
  Delete
</button>
```

### Cards and Panels

```tsx
// Basic card
<div className="bg-surface border border-border rounded-lg p-4">
  <h3 className="text-text-primary font-semibold mb-2">Card Title</h3>
  <p className="text-text-secondary">Card content</p>
</div>

// Elevated card (modal, dropdown)
<div className="bg-surface-elevated border border-border rounded-lg shadow-lg p-6">
  <h2 className="text-text-primary text-xl font-bold mb-4">Modal Title</h2>
  <p className="text-text-secondary">Modal content</p>
</div>

// Hoverable card
<div className="bg-surface border border-border rounded-lg p-4 hover:bg-surface-hover cursor-pointer transition-colors">
  <p className="text-text-primary">Clickable card</p>
</div>
```

### Form Elements

```tsx
// Text input
<input
  type="text"
  className="w-full px-3 py-2 bg-surface border border-border text-text-primary rounded focus:border-border-focus focus:ring-2 focus:ring-primary/20 outline-none"
  placeholder="Enter text..."
/>

// Select dropdown
<select className="w-full px-3 py-2 bg-surface border border-border text-text-primary rounded focus:border-border-focus focus:ring-2 focus:ring-primary/20 outline-none">
  <option>Option 1</option>
  <option>Option 2</option>
</select>

// Textarea
<textarea
  className="w-full px-3 py-2 bg-surface border border-border text-text-primary rounded focus:border-border-focus focus:ring-2 focus:ring-primary/20 outline-none resize-none"
  rows={4}
  placeholder="Enter description..."
/>
```

### Notifications

```tsx
// Success
<div className="bg-success text-success-contrast p-3 rounded flex items-center gap-2">
  <span>✓</span>
  <span>Item saved successfully</span>
</div>

// Error
<div className="bg-error text-error-contrast p-3 rounded flex items-center gap-2">
  <span>✗</span>
  <span>Failed to save item</span>
</div>

// Warning
<div className="bg-warning text-warning-contrast p-3 rounded flex items-center gap-2">
  <span>⚠</span>
  <span>This action cannot be undone</span>
</div>

// Info
<div className="bg-info text-info-contrast p-3 rounded flex items-center gap-2">
  <span>ℹ</span>
  <span>New feature available</span>
</div>
```

### Lists

```tsx
// List item
<div className="bg-surface border-b border-border p-4 hover:bg-surface-hover transition-colors">
  <h4 className="text-text-primary font-medium">List Item</h4>
  <p className="text-text-secondary text-sm">Description</p>
</div>

// Empty state
<div className="bg-surface border border-border rounded-lg p-8 text-center">
  <p className="text-text-secondary">No items found</p>
</div>
```

## Theme Helper Functions

Use the `getThemeClasses` helper for common component patterns:

```tsx
import { getThemeClasses } from '@/lib/theme';

// Button variants
<button className={`${getThemeClasses('button', 'primary')} px-4 py-2 rounded`}>
  Primary
</button>

// Card
<div className={getThemeClasses('card')}>
  Card content
</div>

// Input
<input className={getThemeClasses('input')} type="text" />

// Notifications
<div className={`${getThemeClasses('notification', 'success')} p-3 rounded`}>
  Success!
</div>
```

## Accessibility

All color combinations are tested to meet **WCAG 2.1 AA** contrast requirements:

- Normal text: 4.5:1 minimum contrast
- Large text (18pt+): 3:1 minimum contrast
- UI components: 3:1 minimum contrast

## Testing Themes

### Browser DevTools

Test dark mode in Chrome/Edge/Safari:

1. Open DevTools (F12)
2. Open Command Palette (Cmd/Ctrl + Shift + P)
3. Type "Rendering"
4. Find "Emulate CSS media feature prefers-color-scheme"
5. Select "dark" or "light"

### System Preferences

**macOS:**

- System Settings → Appearance → Dark/Light

**Windows:**

- Settings → Personalization → Colors → Choose your mode

**Linux (GNOME):**

- Settings → Appearance → Style → Light/Dark

## Extending the Theme

### Adding a New Color Token

1. **Update `app/globals.css`:**

```css
:root {
  --color-my-new-color: 100 150 200;
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-my-new-color: 150 180 220;
  }
}
```

2. **Update `tailwind.config.js`:**

```js
theme: {
  extend: {
    colors: {
      'my-new-color': 'rgb(var(--color-my-new-color) / <alpha-value>)',
    }
  }
}
```

3. **Use in components:**

```tsx
<div className="bg-my-new-color text-white">New color!</div>
```

### Modifying Existing Colors

Edit the RGB values in `app/globals.css`:

```css
:root {
  /* Change primary blue to purple */
  --color-primary: 139 92 246; /* #8b5cf6 */
}
```

## Migration Guide

If you have existing components with hardcoded colors, migrate them to use theme tokens:

```tsx
// ❌ Before
<button className="bg-blue-500 text-white hover:bg-blue-600">
  Click me
</button>

// ✅ After
<button className="bg-primary text-primary-contrast hover:bg-primary-hover">
  Click me
</button>

// ❌ Before
<div className="bg-white border border-gray-200 text-gray-900">
  Content
</div>

// ✅ After
<div className="bg-surface border border-border text-text-primary">
  Content
</div>
```

## Troubleshooting

### Colors not updating?

1. Restart Tailwind build process: `npm run dev`
2. Clear browser cache
3. Check that classes are in Tailwind's content paths

### Dark mode not working?

1. Verify `darkMode: 'media'` is set in `tailwind.config.js`
2. Check system dark mode preference is set correctly
3. Test with browser DevTools dark mode emulation

### Need more opacity?

Use Tailwind's opacity modifier:

```tsx
<div className="bg-primary/50">
  {' '}
  {/* 50% opacity */}
  Semi-transparent
</div>
```

## Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [MDN: prefers-color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme)
- [WCAG Contrast Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
