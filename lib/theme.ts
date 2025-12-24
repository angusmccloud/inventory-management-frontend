/**
 * Theme System Documentation
 * 
 * This application uses a CSS custom properties-based theme system with
 * Tailwind CSS integration. The theme automatically switches between light
 * and dark modes based on system preferences (prefers-color-scheme).
 * 
 * ## Usage in Components
 * 
 * Use Tailwind classes with theme color tokens:
 * 
 * ```tsx
 * // Primary button
 * <button className="bg-primary text-primary-contrast hover:bg-primary-hover">
 *   Click me
 * </button>
 * 
 * // Card surface
 * <div className="bg-surface border border-border rounded-lg p-4">
 *   <h2 className="text-text-primary">Title</h2>
 *   <p className="text-text-secondary">Description</p>
 * </div>
 * 
 * // Success notification
 * <div className="bg-success text-success-contrast p-3 rounded">
 *   Success message
 * </div>
 * ```
 * 
 * ## Color Tokens
 * 
 * ### Primary Colors
 * - `bg-primary` - Main brand color
 * - `text-primary-contrast` - Text color for use on primary background
 * - `bg-primary-hover` - Primary color for hover states
 * 
 * ### Secondary Colors
 * - `bg-secondary` - Accent color
 * - `text-secondary-contrast` - Text color for use on secondary background
 * - `bg-secondary-hover` - Secondary color for hover states
 * 
 * ### Surface Colors
 * - `bg-surface` - Default card/panel background
 * - `bg-surface-elevated` - Elevated surface (e.g., modal, dropdown)
 * - `bg-surface-hover` - Surface hover state
 * 
 * ### Background
 * - `bg-background` - Main page background
 * 
 * ### Text Colors
 * - `text-text-primary` - Primary text (headings, body text)
 * - `text-text-secondary` - Secondary text (captions, descriptions)
 * - `text-text-disabled` - Disabled text
 * 
 * ### Border Colors
 * - `border-border` - Default border color
 * - `border-border-focus` - Focus ring color
 * 
 * ### Semantic Colors
 * - `bg-success` / `text-success-contrast` - Success states
 * - `bg-warning` / `text-warning-contrast` - Warning states
 * - `bg-error` / `text-error-contrast` - Error states
 * - `bg-info` / `text-info-contrast` - Info states
 * 
 * ## Theme Configuration
 * 
 * Theme colors are defined in:
 * - `/app/globals.css` - CSS custom properties with light/dark values
 * - `/tailwind.config.js` - Tailwind theme extension mapping
 * 
 * The theme automatically switches based on `@media (prefers-color-scheme: dark)`
 * No JavaScript is required for theme switching.
 * 
 * ## Design Principles
 * 
 * 1. **Accessibility**: All color combinations meet WCAG 2.1 AA contrast ratios
 * 2. **Consistency**: Use semantic tokens (primary, secondary) over direct colors
 * 3. **Responsiveness**: Theme adapts to system preferences automatically
 * 4. **Maintainability**: Central theme definition, easy to update globally
 * 
 * ## Adding New Colors
 * 
 * To add a new color token:
 * 
 * 1. Add CSS custom property in `app/globals.css`:
 *    ```css
 *    :root {
 *      --color-new-token: 100 100 100;
 *    }
 *    @media (prefers-color-scheme: dark) {
 *      :root {
 *        --color-new-token: 200 200 200;
 *      }
 *    }
 *    ```
 * 
 * 2. Add Tailwind mapping in `tailwind.config.js`:
 *    ```js
 *    theme: {
 *      extend: {
 *        colors: {
 *          'new-token': 'rgb(var(--color-new-token) / <alpha-value>)',
 *        }
 *      }
 *    }
 *    ```
 * 
 * 3. Use in components:
 *    ```tsx
 *    <div className="bg-new-token">Content</div>
 *    ```
 */

export const themeColors = {
  primary: 'primary',
  primaryContrast: 'primary-contrast',
  primaryHover: 'primary-hover',
  secondary: 'secondary',
  secondaryContrast: 'secondary-contrast',
  secondaryHover: 'secondary-hover',
  surface: 'surface',
  surfaceElevated: 'surface-elevated',
  surfaceHover: 'surface-hover',
  background: 'background',
  textPrimary: 'text-primary',
  textSecondary: 'text-secondary',
  textDisabled: 'text-disabled',
  border: 'border',
  borderFocus: 'border-focus',
  success: 'success',
  successContrast: 'success-contrast',
  warning: 'warning',
  warningContrast: 'warning-contrast',
  error: 'error',
  errorContrast: 'error-contrast',
  info: 'info',
  infoContrast: 'info-contrast',
} as const;

export type ThemeColor = typeof themeColors[keyof typeof themeColors];

/**
 * Helper function to get theme-aware class names
 */
export function getThemeClasses(type: 'button' | 'card' | 'input' | 'notification', variant?: string): string {
  switch (type) {
    case 'button':
      switch (variant) {
        case 'primary':
          return 'bg-primary text-primary-contrast hover:bg-primary-hover';
        case 'secondary':
          return 'bg-secondary text-secondary-contrast hover:bg-secondary-hover';
        case 'outline':
          return 'bg-transparent border border-border text-text-primary hover:bg-surface-hover';
        default:
          return 'bg-surface text-text-primary hover:bg-surface-hover';
      }
    case 'card':
      return 'bg-surface border border-border rounded-lg shadow-sm';
    case 'input':
      return 'bg-surface border border-border text-text-primary focus:border-border-focus focus:ring-2 focus:ring-primary/20';
    case 'notification':
      switch (variant) {
        case 'success':
          return 'bg-success text-success-contrast';
        case 'warning':
          return 'bg-warning text-warning-contrast';
        case 'error':
          return 'bg-error text-error-contrast';
        case 'info':
          return 'bg-info text-info-contrast';
        default:
          return 'bg-surface-elevated text-text-primary border border-border';
      }
    default:
      return '';
  }
}
