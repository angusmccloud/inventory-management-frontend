/**
 * Autocomplete Component
 *
 * A flexible autocomplete input component with search functionality.
 * Supports both selecting from suggestions and free-text input.
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import { Input } from '../Input/Input';
import { Text } from '../Text/Text';
import type { AutocompleteProps, AutocompleteOption } from './Autocomplete.types';

export default function Autocomplete({
  id,
  label,
  value,
  onChange,
  onSearch,
  placeholder,
  required = false,
  disabled = false,
  maxLength,
  debounceMs = 300,
  minSearchLength = 2,
  emptyMessage = 'No results found',
  onKeyDown,
}: AutocompleteProps) {
  const [options, setOptions] = useState<AutocompleteOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search for options
  const performSearch = async (query: string) => {
    if (query.length < minSearchLength) {
      setOptions([]);
      setShowDropdown(false);
      return;
    }

    setIsLoading(true);
    try {
      const results = await onSearch(query);
      setOptions(results);
      setShowDropdown(results.length > 0);
      setHighlightedIndex(-1);
    } catch (error) {
      console.error('Autocomplete search error:', error);
      setOptions([]);
      setShowDropdown(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input change with debouncing
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);

    // Clear existing debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Debounce search
    debounceRef.current = setTimeout(() => {
      performSearch(newValue);
    }, debounceMs);
  };

  // Handle option selection
  const handleSelectOption = (option: AutocompleteOption) => {
    onChange(option.label, option);
    setShowDropdown(false);
    setOptions([]);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (showDropdown && options.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHighlightedIndex((prev) => (prev < options.length - 1 ? prev + 1 : prev));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
      } else if (e.key === 'Enter' && highlightedIndex >= 0 && highlightedIndex < options.length) {
        e.preventDefault();
        const selectedOption = options[highlightedIndex];
        if (selectedOption) {
          handleSelectOption(selectedOption);
        }
        return; // Don't call onKeyDown for Enter when selecting
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setShowDropdown(false);
        setHighlightedIndex(-1);
      }
    }

    // Call parent onKeyDown handler
    onKeyDown?.(e);
  };

  // Handle input focus
  const handleFocus = () => {
    if (value.length >= minSearchLength && options.length > 0) {
      setShowDropdown(true);
    }
  };

  return (
    <div ref={wrapperRef} className="relative">
      <Input
        id={id}
        label={label}
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        maxLength={maxLength}
        autoComplete="off"
      />

      {/* Dropdown */}
      {showDropdown && !disabled && (
        <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border border-border bg-surface shadow-lg">
          {isLoading ? (
            <div className="px-4 py-3">
              <Text variant="bodySmall" color="secondary">
                Searching...
              </Text>
            </div>
          ) : options.length === 0 ? (
            <div className="px-4 py-3">
              <Text variant="bodySmall" color="secondary">
                {emptyMessage}
              </Text>
            </div>
          ) : (
            <ul className="py-1">
              {options.map((option, index) => (
                <li
                  key={option.value}
                  onClick={() => handleSelectOption(option)}
                  className={`cursor-pointer px-4 py-2 transition-colors ${
                    index === highlightedIndex
                      ? 'bg-primary/10 text-primary'
                      : 'text-text-default hover:bg-surface-hover'
                  }`}
                >
                  <Text variant="body">{option.label}</Text>
                  {option.metadata?.['location'] && (
                    <Text variant="caption" color="secondary" className="mt-0.5">
                      {option.metadata['location']}
                    </Text>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
