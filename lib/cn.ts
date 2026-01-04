/**
 * Utility for merging Tailwind CSS class names
 * Feature: 008-common-components
 *
 * Combines clsx for conditional class names and tailwind-merge for
 * resolving Tailwind class conflicts (e.g., px-4 + px-2 = px-2).
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge class names with Tailwind conflict resolution
 *
 * @param inputs - Class names, objects, arrays, or conditional expressions
 * @returns Merged class name string with conflicts resolved
 *
 * @example
 * cn('px-4 py-2', 'px-6') // => 'py-2 px-6' (px-4 overridden)
 * cn('text-red-500', condition && 'text-blue-500') // => conditional color
 * cn({ 'bg-primary': isPrimary, 'bg-secondary': !isPrimary })
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
