/**
 * Text Component
 * Feature: 008-common-components
 * 
 * Polymorphic typography component with semantic variants for consistent text rendering.
 * Automatically applies theme-based font families, sizes, weights, and colors.
 */

import * as React from 'react';
import { cn } from '@/lib/cn';
import type { TextProps, TextVariant, TextColor, FontWeight } from './Text.types';

/**
 * Variant-specific styles mapping
 * Maps semantic variants to Tailwind classes for size, weight, and line-height
 */
const variantStyles: Record<TextVariant, string> = {
  h1: 'text-3xl font-bold leading-tight tracking-tight',
  h2: 'text-2xl font-bold leading-tight',
  h3: 'text-xl font-semibold leading-snug',
  h4: 'text-lg font-semibold leading-snug',
  h5: 'text-base font-semibold leading-normal',
  h6: 'text-sm font-semibold leading-normal',
  body: 'text-base font-normal leading-relaxed',
  bodySmall: 'text-sm font-normal leading-relaxed',
  caption: 'text-xs font-normal leading-normal',
  label: 'text-sm font-semibold leading-normal',
};

/**
 * Color-specific styles mapping
 * Maps semantic colors to theme-aware Tailwind classes
 */
const colorStyles: Record<TextColor, string> = {
  primary: 'text-text-primary',
  secondary: 'text-text-secondary',
  tertiary: 'text-text-disabled',
  inverse: 'text-primary-contrast',
  success: 'text-success',
  warning: 'text-warning',
  error: 'text-error',
  info: 'text-info',
};

/**
 * Font weight override styles
 */
const weightStyles: Record<FontWeight, string> = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
};

/**
 * Text component with polymorphic rendering capabilities
 * 
 * @example
 * ```tsx
 * // Page title
 * <Text as="h1" variant="h1" color="primary">
 *   Inventory Management
 * </Text>
 * 
 * // Body text
 * <Text variant="body" color="secondary">
 *   Manage your household items and supplies.
 * </Text>
 * 
 * // Caption
 * <Text variant="caption" color="tertiary">
 *   Last updated {lastUpdated}
 * </Text>
 * ```
 */
export function Text<T extends React.ElementType = 'p'>({
  as,
  variant = 'body',
  color = 'primary',
  children,
  className,
  weight,
  ...props
}: TextProps<T> & Omit<React.ComponentPropsWithoutRef<T>, keyof TextProps<T>>) {
  const Component = as || 'p';
  
  return (
    <Component
      className={cn(
        variantStyles[variant],
        colorStyles[color],
        weight && weightStyles[weight],
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

Text.displayName = 'Text';
