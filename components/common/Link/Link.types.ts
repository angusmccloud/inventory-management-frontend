/**
 * Link Component Type Definitions
 * Feature: 008-common-components
 *
 * Styled anchor element with consistent appearance and Next.js integration.
 */

import * as React from 'react';

/**
 * Link visual variants
 */
export type LinkVariant =
  | 'default' // Standard link (underline on hover)
  | 'primary' // Primary color, bold
  | 'subtle'; // No underline, subtle color

/**
 * Link component props
 * Styled anchor element with consistent appearance.
 *
 * @example
 * <Link href="/dashboard">Go to Dashboard</Link>
 *
 * @example
 * <Link href="https://example.com" external>
 *   View Documentation
 * </Link>
 *
 * @example
 * <Link href="/settings" variant="subtle">Settings</Link>
 */
export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /**
   * Link destination
   */
  href: string;

  /**
   * Link content
   */
  children: React.ReactNode;

  /**
   * Link visual variant
   * @default 'default'
   */
  variant?: LinkVariant;

  /**
   * External link (opens in new tab, shows external icon)
   * Auto-detected from href if not specified (http/https external domains)
   * @default false (determined automatically from href)
   */
  external?: boolean;

  /**
   * Show external link icon
   * @default true (when external is true)
   */
  showExternalIcon?: boolean;

  /**
   * Additional CSS classes
   */
  className?: string;
}
