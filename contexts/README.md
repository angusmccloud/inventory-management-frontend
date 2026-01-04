# Snackbar System

Global notification system using context to display temporary messages at the bottom center of the screen.

## Architecture

- **SnackbarContext**: Global context that manages snackbar state and provides trigger methods
- **SnackbarProvider**: Wraps the app at the root level (in `app/layout.tsx`)
- **Snackbar Component**: Renders at the bottom center, uses Alert component internally

## Usage

### Basic Usage

```typescript
import { useSnackbar } from '@/contexts/SnackbarContext';

function MyComponent() {
  const { showSnackbar } = useSnackbar();

  const handleSuccess = () => {
    showSnackbar({
      variant: 'success',
      text: 'Operation completed successfully!',
    });
  };

  return <button onClick={handleSuccess}>Save</button>;
}
```

### Variants

```typescript
// Info (blue)
showSnackbar({ variant: 'info', text: 'Information message' });

// Success (green)
showSnackbar({ variant: 'success', text: 'Success message' });

// Warning (yellow)
showSnackbar({ variant: 'warning', text: 'Warning message' });

// Error (red)
showSnackbar({ variant: 'error', text: 'Error message' });
```

### Configuration Options

```typescript
interface SnackbarConfig {
  variant: 'info' | 'success' | 'warning' | 'error';
  text: string;
  autoHide?: boolean; // Default: true
  autoHideDuration?: number; // Default: 5000ms (5 seconds)
}
```

### Examples

**Default auto-hide (5 seconds)**

```typescript
showSnackbar({
  variant: 'success',
  text: 'Item added to inventory',
});
```

**Custom auto-hide duration**

```typescript
showSnackbar({
  variant: 'warning',
  text: 'Session will expire soon',
  autoHideDuration: 10000, // 10 seconds
});
```

**No auto-hide (requires manual dismiss)**

```typescript
showSnackbar({
  variant: 'error',
  text: 'Critical error - please review',
  autoHide: false,
});
```

**Manual dismiss**

```typescript
const { showSnackbar, hideSnackbar } = useSnackbar();

// Show
showSnackbar({ variant: 'info', text: 'Processing...' });

// Later, hide manually
hideSnackbar();
```

## Testing

See the theme test page at `/theme-test` for interactive examples of all variants.

## Implementation Details

- Only one snackbar is displayed at a time
- New snackbar automatically replaces existing one
- Snackbar appears at bottom center with smooth animation
- User can dismiss by clicking the X button
- Auto-hide timer is cleared when:
  - User manually dismisses the snackbar
  - A new snackbar is triggered
  - Component unmounts
- Uses Alert component internally for consistent styling
- Fully theme-aware (works in light and dark mode)

## TypeScript Support

Full TypeScript support with type safety:

```typescript
import { useSnackbar, SnackbarConfig } from '@/contexts/SnackbarContext';

const config: SnackbarConfig = {
  variant: 'success',
  text: 'Item saved',
  autoHide: true,
  autoHideDuration: 3000,
};

showSnackbar(config);
```
