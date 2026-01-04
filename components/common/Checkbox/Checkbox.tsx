/**
 * Checkbox Component
 *
 * Accessible checkbox with consistent styling.
 * Supports theming and follows WCAG 2.1 AA standards.
 */

'use client';

import * as React from 'react';
import { CheckboxProps } from './Checkbox.types';
import { Text } from '@/components/common/Text/Text';

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  description,
  checked,
  onChange,
  disabled = false,
  required = false,
  error,
  helpText,
  className = '',
  name,
}) => {
  const id = React.useId();
  const hasError = Boolean(error);

  return (
    <div className={className}>
      <label
        htmlFor={id}
        className={`flex cursor-pointer items-start ${
          disabled ? 'cursor-not-allowed opacity-50' : ''
        }`}
      >
        <input
          id={id}
          type="checkbox"
          name={name}
          checked={checked}
          onChange={(e) => !disabled && onChange(e.target.checked)}
          disabled={disabled}
          aria-describedby={
            helpText || error || description
              ? `${id}-${error ? 'error' : description ? 'desc' : 'help'}`
              : undefined
          }
          className={`mt-0.5 h-4 w-4 flex-shrink-0 rounded border-2 ${hasError ? 'border-error' : 'border-border'} ${
            checked ? 'border-primary bg-primary text-primary-contrast' : 'border-border bg-surface'
          } transition-colors hover:border-primary-hover focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`}
        />
        <div className="ml-3 flex-1">
          <span className="text-sm text-text-primary">
            {label}
            {required && <span className="ml-1 text-error">*</span>}
          </span>
          {description && (
            <Text as="p" variant="caption" color="secondary" id={`${id}-desc`} className="mt-0.5">
              {description}
            </Text>
          )}
        </div>
      </label>

      {/* Help Text */}
      {helpText && !error && (
        <Text as="p" variant="caption" color="secondary" id={`${id}-help`} className="ml-7 mt-1.5">
          {helpText}
        </Text>
      )}

      {/* Error Message */}
      {error && (
        <Text
          as="p"
          variant="caption"
          color="error"
          id={`${id}-error`}
          role="alert"
          className="ml-7 mt-1.5"
        >
          {error}
        </Text>
      )}
    </div>
  );
};

Checkbox.displayName = 'Checkbox';
