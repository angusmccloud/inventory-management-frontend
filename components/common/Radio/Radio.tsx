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
        <label
          id={`${groupId}-label`}
          className="block text-sm font-medium text-text-primary mb-2"
        >
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}

      {/* Radio Options */}
      <div
        role="radiogroup"
        aria-labelledby={label ? `${groupId}-label` : undefined}
        aria-describedby={
          helpText || error
            ? `${groupId}-${error ? 'error' : 'help'}`
            : undefined
        }
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
              className={`flex items-start cursor-pointer ${
                isDisabled ? 'opacity-50 cursor-not-allowed' : ''
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
                className={`
                  mt-0.5 h-4 w-4 flex-shrink-0
                  border-2 rounded-full
                  ${hasError ? 'border-error' : 'border-border'}
                  ${
                    isChecked
                      ? 'bg-primary border-primary text-primary-contrast'
                      : 'bg-surface border-border'
                  }
                  focus:ring-2 focus:ring-primary focus:ring-offset-2
                  disabled:cursor-not-allowed disabled:opacity-50
                  transition-colors hover:border-primary-hover
                `}
              />
              <div className="ml-3 flex-1">
                <span className="text-sm text-text-primary">
                  {option.label}
                </span>
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
        <Text
          as="p"
          variant="caption"
          color="secondary"
          id={`${groupId}-help`}
          className="mt-1.5"
        >
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
