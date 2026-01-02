/**
 * Checkbox Component
 * 
 * Accessible checkbox with consistent styling.
 * Supports theming and follows WCAG 2.1 AA standards.
 */

'use client';

import * as React from 'react';
import { CheckboxProps } from './Checkbox.types';

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
        className={`flex items-start cursor-pointer ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
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
          className={`
            mt-0.5 h-4 w-4 flex-shrink-0
            rounded border-2
            ${hasError ? 'border-error' : 'border-border'}
            ${
              checked
                ? 'bg-primary border-primary'
                : 'bg-surface'
            }
            focus:ring-2 focus:ring-primary focus:ring-offset-2
            disabled:cursor-not-allowed disabled:opacity-50
            transition-colors
          `}
        />
        <div className="ml-3 flex-1">
          <span className="text-sm text-text-primary">
            {label}
            {required && <span className="text-error ml-1">*</span>}
          </span>
          {description && (
            <p
              id={`${id}-desc`}
              className="text-xs text-text-secondary mt-0.5"
            >
              {description}
            </p>
          )}
        </div>
      </label>

      {/* Help Text */}
      {helpText && !error && (
        <p
          id={`${id}-help`}
          className="mt-1.5 ml-7 text-xs text-text-secondary"
        >
          {helpText}
        </p>
      )}

      {/* Error Message */}
      {error && (
        <p
          id={`${id}-error`}
          className="mt-1.5 ml-7 text-xs text-error"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
};

Checkbox.displayName = 'Checkbox';
