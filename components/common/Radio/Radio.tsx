/**
 * Radio Component
 *
 * Accessible radio button group with consistent styling.
 * Supports theming and follows WCAG 2.1 AA standards.
 */

'use client';

import * as React from 'react';
import { RadioProps } from './Radio.types';
import { Text } from '@/components/common/Text/Text';

export const Radio: React.FC<RadioProps> = ({
  name,
  options,
  value,
  onChange,
  label,
  helpText,
  disabled = false,
  error,
  required = false,
  className = '',
}) => {
  const groupId = React.useId();
  const hasError = Boolean(error);

  return (
    <div className={className}>
      {/* Group Label */}
      {label && (
        <label id={`${groupId}-label`} className="mb-2 block text-sm font-medium text-text-primary">
          {label}
          {required && <span className="ml-1 text-error">*</span>}
        </label>
      )}

      {/* Radio Options */}
      <div
        role="radiogroup"
        aria-labelledby={label ? `${groupId}-label` : undefined}
        aria-describedby={helpText || error ? `${groupId}-${error ? 'error' : 'help'}` : undefined}
        className="space-y-2"
      >
        {options.map((option) => {
          const isDisabled = disabled || option.disabled;
          const isChecked = value === option.value;
          const optionId = `${groupId}-${option.value}`;

          return (
            <label
              key={option.value}
              htmlFor={optionId}
              className={`flex cursor-pointer items-start ${
                isDisabled ? 'cursor-not-allowed opacity-50' : ''
              }`}
            >
              <input
                id={optionId}
                type="radio"
                name={name}
                value={option.value}
                checked={isChecked}
                onChange={(e) => !isDisabled && onChange(e.target.value)}
                disabled={isDisabled}
                className={`mt-0.5 h-4 w-4 flex-shrink-0 rounded-full border-2 ${hasError ? 'border-error' : 'border-border'} ${
                  isChecked
                    ? 'border-primary bg-primary text-primary-contrast'
                    : 'border-border bg-surface'
                } transition-colors hover:border-primary-hover focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`}
              />
              <div className="ml-3 flex-1">
                <span className="text-sm text-text-primary">{option.label}</span>
                {option.description && (
                  <Text variant="caption" color="secondary" className="mt-0.5">
                    {option.description}
                  </Text>
                )}
              </div>
            </label>
          );
        })}
      </div>

      {/* Help Text */}
      {helpText && !error && (
        <Text as="p" variant="caption" color="secondary" id={`${groupId}-help`} className="mt-1.5">
          {helpText}
        </Text>
      )}

      {/* Error Message */}
      {error && (
        <Text
          as="p"
          variant="caption"
          color="error"
          id={`${groupId}-error`}
          role="alert"
          className="mt-1.5"
        >
          {error}
        </Text>
      )}
    </div>
  );
};

Radio.displayName = 'Radio';
