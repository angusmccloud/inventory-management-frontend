# Dark Mode Fix - Implementation Guide

## Problem
The theme was always showing in light mode because:
1. Components used hardcoded Tailwind colors (bg-white, text-gray-900) instead of theme-aware classes
2. CSS custom properties alone don't override explicit Tailwind utility classes
3. The body tag had hardcoded `bg-gray-50` class

## Solution
Implemented a **hybrid approach**:
1. **CSS Custom Properties** - For theme token system (bg-primary, text-text-primary, etc.)
2. **Tailwind Dark Mode Classes** - For existing components with hardcoded colors (dark:bg-gray-800, etc.)
3. **Auto-detect System Preference** - ThemeProvider component automatically applies `dark` class

## What Was Added

### 1. ThemeProvider Component
`/components/common/ThemeProvider.tsx`

Automatically adds/removes the `dark` class on the `<html>` element based on system preferences.

```tsx
'use client';

import { useEffect } from 'react';

export default function ThemeProvider({ children }) {
  useEffect(() => {
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const updateTheme = (e) => {
      document.documentElement.classList.toggle('dark', e.matches);
    };
    
    updateTheme(darkModeQuery);
    darkModeQuery.addEventListener('change', updateTheme);
    
    return () => darkModeQuery.removeEventListener('change', updateTheme);
  }, []);

  return <>{children}</>;
}
```

### 2. Updated Root Layout
`/app/layout.tsx`

- Removed hardcoded `bg-gray-50` from body
- Wrapped children in ThemeProvider

```tsx
<body className="min-h-screen antialiased">
  <ThemeProvider>
    {children}
  </ThemeProvider>
</body>
```

### 3. Updated Tailwind Config
`/tailwind.config.js`

Changed `darkMode: 'media'` to `darkMode: 'class'` for manual control via the `dark` class.

### 4. Updated Dashboard Layout
`/app/dashboard/layout.tsx`

Added dark mode classes to key sections:
```tsx
<div className="min-h-screen bg-gray-50 dark:bg-gray-900">
  <nav className="bg-white dark:bg-gray-800 shadow">
    <h1 className="text-blue-600 dark:text-blue-400">
      Inventory HQ
    </h1>
```

### 5. Test Page
`/app/theme-test/page.tsx`

Created a visual test page at `/theme-test` showing dark mode in action.

## How It Works

1. **Page Load**: ThemeProvider checks system dark mode preference
2. **Dark Mode Detected**: Adds `dark` class to `<html>` element
3. **CSS Applies**: 
   - Tailwind's `dark:` variants activate (dark:bg-gray-900, etc.)
   - CSS custom properties switch to dark values
4. **System Changes**: Event listener detects preference changes and updates automatically

## Testing Dark Mode

### Browser DevTools (Easiest)
1. Open DevTools (F12)
2. Open Command Palette (Cmd/Ctrl + Shift + P)
3. Type "Rendering"
4. Find "Emulate CSS media feature prefers-color-scheme"
5. Select "dark" or "light"
6. **Page should update immediately**

### System Settings
- **macOS**: System Settings → Appearance → Dark
- **Windows**: Settings → Personalization → Colors → Dark
- **Linux**: Settings → Appearance → Dark

## Usage in Components

### For New Components
Use theme tokens from `/lib/theme.ts`:

```tsx
<div className="bg-surface border border-border text-text-primary">
  Theme-aware content
</div>
```

### For Existing Components
Add `dark:` variants to hardcoded colors:

```tsx
// Before
<div className="bg-white text-gray-900">
  Content
</div>

// After
<div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
  Content
</div>
```

## Migration Strategy

### Phase 1: ✅ COMPLETE
- Created ThemeProvider
- Updated root layout
- Updated main dashboard layout
- Created test page

### Phase 2: IN PROGRESS
Gradually update components to support dark mode by adding `dark:` variants:

**Priority Order:**
1. Navigation and layout components (partially done)
2. Dashboard pages
3. Forms and dialogs
4. List items and cards
5. Minor UI elements

### Phase 3: FUTURE
Replace hardcoded colors with theme tokens for full consistency:
```tsx
// Current
<div className="bg-white dark:bg-gray-800">

// Future
<div className="bg-surface">
```

## Common Patterns

### Cards
```tsx
<div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
  <h3 className="text-gray-900 dark:text-gray-100">Title</h3>
  <p className="text-gray-600 dark:text-gray-400">Description</p>
</div>
```

### Buttons
```tsx
// Primary
<button className="bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600">
  Save
</button>

// Secondary
<button className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600">
  Cancel
</button>
```

### Forms
```tsx
<input 
  className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:ring-blue-500"
  type="text"
/>
```

### Navigation Links
```tsx
<a className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100">
  Link
</a>
```

## Troubleshooting

### Dark mode not activating?
1. Check browser console for errors
2. Verify ThemeProvider is in the layout
3. Test with DevTools dark mode emulation
4. Check that `darkMode: 'class'` is in tailwind.config.js

### Some elements still light?
Those components need `dark:` variants added. See migration strategy above.

### Flashing on page load?
This is expected with client-side theme detection. To fix:
1. Add a script tag in <head> (before React hydration)
2. OR use server-side detection with cookies

## Files Modified

1. `/components/common/ThemeProvider.tsx` - NEW
2. `/app/layout.tsx` - Added ThemeProvider
3. `/app/dashboard/layout.tsx` - Added dark: classes
4. `/tailwind.config.js` - Changed darkMode to 'class'
5. `/app/theme-test/page.tsx` - NEW test page

## Next Steps

1. Test the `/theme-test` page to verify dark mode works
2. Gradually add `dark:` variants to components
3. Update component library docs with dark mode examples
4. Add dark mode screenshots to documentation

## Resources

- [Tailwind Dark Mode Docs](https://tailwindcss.com/docs/dark-mode)
- [prefers-color-scheme MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme)
- Internal: `THEME.md` for theme token system
