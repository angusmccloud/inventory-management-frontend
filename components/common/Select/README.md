# Select Component

Dropdown selection component with validation states, labels, and consistent styling with Input component.

## Features

- **Options**: Array-based option configuration
- **Validation States**: default, success, error (matches Input component)
- **Sizes**: sm, md (default), lg (matches Input component)
- **Accessibility**: ARIA attributes, required field indicators, error associations
- **Labels**: Optional label with required indicator
- **Help Text**: Contextual help or validation feedback
- **Placeholder**: Optional placeholder text for empty state

## Basic Usage

```tsx
import { Select } from '@/components/common';

const storageOptions = [
  { label: 'Pantry', value: 'pantry' },
  { label: 'Fridge', value: 'fridge' },
  { label: 'Freezer', value: 'freezer' },
];

// Simple select
<Select 
  label="Storage Location"
  options={storageOptions}
  value={location}
  onChange={setLocation}
/>

// With placeholder
<Select 
  label="Category"
  options={categoryOptions}
  value={category}
  onChange={setCategory}
  placeholder="Select a category..."
/>

// Required field
<Select 
  label="Item Type"
  options={typeOptions}
  value={type}
  onChange={setType}
  required
/>
```

## Validation States

```tsx
import { Select } from '@/components/common';

// Error state
<Select 
  label="Storage Location"
  options={storageOptions}
  value={location}
  onChange={setLocation}
  error="Please select a storage location"
/>

// Success state
<Select 
  label="Category"
  options={categoryOptions}
  value={category}
  onChange={setCategory}
  success="Category saved"
/>

// With help text
<Select 
  label="Priority"
  options={priorityOptions}
  value={priority}
  onChange={setPriority}
  helpText="Select item priority for shopping list"
/>
```

## Sizes

```tsx
import { Select } from '@/components/common';

// Small
<Select size="sm" label="Small Select" options={options} />

// Medium (default)
<Select size="md" label="Medium Select" options={options} />

// Large
<Select size="lg" label="Large Select" options={options} />
```

## Option Configuration

```tsx
import { Select, SelectOption } from '@/components/common';

// Basic options
const basicOptions: SelectOption[] = [
  { label: 'Option 1', value: '1' },
  { label: 'Option 2', value: '2' },
  { label: 'Option 3', value: '3' },
];

// Disabled options
const optionsWithDisabled: SelectOption[] = [
  { label: 'Available', value: 'available' },
  { label: 'Out of Stock', value: 'out-of-stock', disabled: true },
  { label: 'Discontinued', value: 'discontinued', disabled: true },
];

// Typed options (generic)
interface Category {
  id: number;
  name: string;
}

const categoryOptions: SelectOption<number>[] = [
  { label: 'Dairy', value: 1 },
  { label: 'Produce', value: 2 },
  { label: 'Meat', value: 3 },
];

<Select<number>
  options={categoryOptions}
  value={categoryId}
  onChange={setCategoryId}
/>
```

## Form Integration

```tsx
import { Select } from '@/components/common';
import { useState } from 'react';

function AddItemForm() {
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [errors, setErrors] = useState<{ location?: string; category?: string }>({});

  const storageOptions = [
    { label: 'Pantry', value: 'pantry' },
    { label: 'Fridge', value: 'fridge' },
    { label: 'Freezer', value: 'freezer' },
  ];

  const categoryOptions = [
    { label: 'Dairy', value: 'dairy' },
    { label: 'Produce', value: 'produce' },
    { label: 'Meat', value: 'meat' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: { location?: string; category?: string } = {};
    
    if (!location) {
      newErrors.location = 'Please select a storage location';
    }
    
    if (!category) {
      newErrors.category = 'Please select a category';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Submit form...
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Select
        label="Storage Location"
        options={storageOptions}
        value={location}
        onChange={(value) => {
          setLocation(value);
          if (errors.location) setErrors({ ...errors, location: undefined });
        }}
        error={errors.location}
        placeholder="Select location..."
        required
      />
      
      <Select
        label="Category"
        options={categoryOptions}
        value={category}
        onChange={(value) => {
          setCategory(value);
          if (errors.category) setErrors({ ...errors, category: undefined });
        }}
        error={errors.category}
        placeholder="Select category..."
        required
      />
      
      <button type="submit">Add Item</button>
    </form>
  );
}
```

## Accessibility

- **Labels**: Always provide a `label` for screen readers
- **Required Fields**: Automatically adds visual indicator (*)
- **Error States**: Uses `aria-invalid` and `aria-describedby` for error announcements
- **Help Text**: Associated with select via `aria-describedby`
- **Focus**: Visible focus ring with proper contrast
- **Keyboard**: Full keyboard navigation support (arrow keys, Enter, Tab)

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `options` | `SelectOption<T>[]` | Required | Array of options to display |
| `label` | `string` | - | Select label text |
| `placeholder` | `string` | - | Placeholder text for empty state |
| `value` | `T` | - | Selected value (controlled) |
| `onChange` | `(value: T) => void` | - | Change handler (receives value, not event) |
| `helpText` | `string` | - | Help text displayed below select |
| `error` | `string` | - | Error message (sets validation state to error) |
| `success` | `string` | - | Success message (sets validation state to success) |
| `validationState` | `'default' \| 'success' \| 'error'` | `'default'` | Validation state (overridden by error/success) |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Select size |
| `required` | `boolean` | `false` | Whether field is required |
| `wrapperClassName` | `string` | - | Additional classes for wrapper div |
| `className` | `string` | - | Additional classes for select element |
| `...props` | `React.SelectHTMLAttributes` | - | All standard select attributes |

## Common Patterns

### Controlled Select
```tsx
const [value, setValue] = useState('');
<Select options={options} value={value} onChange={setValue} />
```

### With Default Value
```tsx
const [value, setValue] = useState('pantry'); // default value
<Select options={storageOptions} value={value} onChange={setValue} />
```

### Dynamic Options
```tsx
const [options, setOptions] = useState<SelectOption[]>([]);

useEffect(() => {
  fetchCategories().then(categories => {
    setOptions(categories.map(cat => ({
      label: cat.name,
      value: cat.id
    })));
  });
}, []);

<Select options={options} value={selected} onChange={setSelected} />
```

### Disabled Options
```tsx
const options = [
  { label: 'Active', value: 'active' },
  { label: 'Disabled', value: 'disabled', disabled: true },
];

<Select options={options} value={value} onChange={setValue} />
```
