/**
 * Link Component
 * Feature: 008-common-components
 * 
 * Styled anchor element with Next.js integration and external link detection.
 */

'use client';

import * as React from 'react';
import NextLink from 'next/link';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/20/solid';
import { LinkProps, LinkVariant } from './Link.types';
import { cn } from '@/lib/cn';

/**
 * Check if URL is external
 */
const isExternalUrl = (href: string): boolean => {
  try {
    // Relative paths and anchors are internal
    if (href.startsWith('/') || href.startsWith('#')) {
      return false;
    }
    
    // Check if it's an absolute URL to a different domain
    const url = new URL(href, window.location.origin);
    return url.origin !== window.location.origin;
  } catch {
    // Invalid URL, treat as internal
    return false;
  }
};

/**
 * Get variant-specific styles
 */
const getVariantStyles = (variant: LinkVariant): string => {
  const variants = {
    default: 'text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 hover:underline focus:underline',
    primary: 'text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 font-semibold underline',
    subtle: 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 no-underline',
  };
  
  return variants[variant];
};

/**
 * Link component
 */
export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ 
    href,
    children, 
    variant = 'default', 
    external: externalProp,
    showExternalIcon = true,
    className,
    ...props 
  }, ref) => {
    // Auto-detect external links if not explicitly set
    const isExternal = externalProp ?? isExternalUrl(href);
    
    // External link props
    const externalProps = isExternal ? {
      target: '_blank',
      rel: 'noopener noreferrer',
    } : {};
    
    const linkClasses = cn(
      'inline-flex items-center gap-1 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-sm',
      getVariantStyles(variant),
      className
    );
    
    // Use Next.js Link for internal links, standard anchor for external
    if (isExternal) {
      return (
        <a
          ref={ref}
          href={href}
          className={linkClasses}
          {...externalProps}
          {...props}
        >
          {children}
          {showExternalIcon && (
            <ArrowTopRightOnSquareIcon 
              className="h-4 w-4 flex-shrink-0" 
              aria-label="(opens in new tab)" 
            />
          )}
        </a>
      );
    }
    
    return (
      <NextLink
        ref={ref}
        href={href}
        className={linkClasses}
        {...props}
      >
        {children}
      </NextLink>
    );
  }
);

Link.displayName = 'Link';

export default Link;
