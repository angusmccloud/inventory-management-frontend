/**
 * MultiSelect Component
 * Feature: 008-common-components
 * 
 * Multi-select dropdown component for selecting multiple options.
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon, XMarkIcon } from '@heroicons/react/24/outline';
import type { SelectOption } from '../Select/Select.types';
import { Badge } from '../Badge/Badge';

interface MultiSelectProps<T = string> {
  id: string;
  label?: string;
  options: SelectOption<T>[];
  value: T[];
  onChange: (values: T[]) => void;
  placeholder?: string;
}

export default function MultiSelect<T extends string = string>({
  id,
  label,
  options,
  value,
  onChange,
  placeholder = 'Select...',
}: MultiSelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const toggleOption = (optionValue: T) => {
    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  const removeValue = (optionValue: T, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(value.filter((v) => v !== optionValue));
  };

  const getOptionLabel = (optionValue: T) => {
    const option = options.find((opt) => opt.value === optionValue);
    return option?.label || optionValue;
  };

  return (
    <div ref={containerRef} className="relative">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-text-default mb-1"
        >
          {label}
        </label>
      )}
      
      <div
        className="min-h-[42px] w-full rounded-md border border-border bg-surface px-3 py-2 text-sm cursor-pointer flex items-center justify-between gap-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex-1 flex flex-wrap gap-1">
          {value.length === 0 ? (
            <span className="text-text-subtle">{placeholder}</span>
          ) : (
            value.map((val) => (
              <Badge
                key={String(val)}
                variant="primary"
                size="md"
                className="inline-flex items-center gap-1"
              >
                {getOptionLabel(val)}
                <button
                  type="button"
                  onClick={(e) => removeValue(val, e)}
                  className="hover:opacity-80"
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </Badge>
            ))
          )}
        </div>
        <ChevronDownIcon
          className={`h-5 w-5 text-text-subtle transition-transform ${
            isOpen ? 'transform rotate-180' : ''
          }`}
        />
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full rounded-md border border-border bg-surface shadow-lg max-h-60 overflow-auto">
          {options.map((option) => {
            const isSelected = value.includes(option.value);
            return (
              <div
                key={String(option.value)}
                className={`px-3 py-2 cursor-pointer hover:bg-surface-hover ${
                  isSelected ? 'bg-primary/10' : ''
                } ${option.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => !option.disabled && toggleOption(option.value)}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => {}}
                    disabled={option.disabled}
                    className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-text-default">{option.label}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
