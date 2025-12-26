/**
 * IconButton Component Type Definitions
 * Feature: 008-common-components
 * 
 * Button optimized for icon-only display with proper touch targets.
 */

import * as React from 'react';
import type { ButtonProps } from '../Button/Button.types';

/**
 * IconButton component props
 * Button optimized for icon-only display with proper touch targets.
 * 
 * @example
 * <IconButton 
 *   icon={<PencilIcon />} 
 *   aria-label="Edit item"
 *   variant="secondary"
 *   onClick={handleEdit}
 * />
 * 
 * @example
 * <IconButton 
 *   icon={<TrashIcon />} 
 *   aria-label="Delete item"
 *   variant="danger"
 *   loading={isDeleting}
 *   onClick={handleDelete}
 * />
 */
export interface IconButtonProps extends Omit<ButtonProps, 'children' | 'leftIcon' | 'rightIcon'> {
  /**
   * Icon to display (React element, usually from Heroicons)
   */
  icon: React.ReactNode;
  
  /**
   * Accessible label for screen readers (REQUIRED)
   * IconButton enforces this prop because icon-only buttons need labels.
   */
  'aria-label': string;
  
  /**
   * Visual label tooltip (optional, shown on hover)
   */
  label?: string;
}
