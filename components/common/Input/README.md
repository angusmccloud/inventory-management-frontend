# Input Component

Form input component with validation states, labels, help text, and icon support.

## Features

- **Multiple Types**: text, number, email, password, tel, url
- **Validation States**: default, success, error
- **Sizes**: sm, md (default), lg
- **Icon Support**: Left and right icon slots
- **Accessibility**: ARIA attributes, required field indicators, error associations
- **Labels**: Optional label with required indicator
- **Help Text**: Contextual help or validation feedback

## Basic Usage

```tsx
import { Input } from '@/components/common';

// Simple text input
<Input 
  label="Item Name"
  value={name}
  onChange={(e) => setName(e.target.value)}
  placeholder="Enter item name"
/>

// Required field
<Input 
  label="Email Address"
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  required
  placeholder="you@example.com"
/>

// With help text
<Input 
  label="Quantity"
  type="number"
  value={quantity}
  onChange={(e) => setQuantity(e.target.value)}
  helpText="Minimum quantity is 1"
  min={1}
/>
```

## Validation States

```tsx
import { Input } from '@/components/common';

// Error state
<Input 
  label="Username"
  value={username}
  onChange={(e) => setUsername(e.target.value)}
  error="Username must be at least 3 characters"
/>

// Success state
<Input 
  label="Username"
  value={username}
  onChange={(e) => setUsername(e.target.value)}
  success="Username is available"
/>

// Custom validation state
<Input 
  label="Password"
  type="password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  validationState="error"
  error="Password must be at least 8 characters"
/>
```

## Sizes

```tsx
import { Input } from '@/components/common';

// Small
<Input size="sm" label="Small Input" />

// Medium (default)
<Input size="md" label="Medium Input" />

// Large
<Input size="lg" label="Large Input" />
```

## Icons

```tsx
import { Input } from '@/components/common';
import { MagnifyingGlassIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

// Left icon
<Input 
  label="Search"
  leftIcon={<MagnifyingGlassIcon className="w-5 h-5" />}
  placeholder="Search items..."
/>

// Right icon
<Input 
  label="Email"
  type="email"
  rightIcon={<EnvelopeIcon className="w-5 h-5" />}
  placeholder="you@example.com"
/>

// Both icons
<Input 
  leftIcon={<MagnifyingGlassIcon className="w-5 h-5" />}
  rightIcon={<XMarkIcon className="w-5 h-5" />}
  placeholder="Search..."
/>
```

## Input Types

```tsx
import { Input } from '@/components/common';

// Text
<Input type="text" label="Item Name" />

// Number
<Input type="number" label="Quantity" min={0} step={1} />

// Email
<Input type="email" label="Email" />

// Password
<Input type="password" label="Password" />

// Tel
<Input type="tel" label="Phone Number" />

// URL
<Input type="url" label="Website" />
```

## Form Integration

```tsx
import { Input } from '@/components/common';
import { useState } from 'react';

function AddItemForm() {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [errors, setErrors] = useState<{ name?: string; quantity?: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: { name?: string; quantity?: string } = {};
    
    if (!name.trim()) {
      newErrors.name = 'Item name is required';
    }
    
    if (!quantity || Number(quantity) < 1) {
      newErrors.quantity = 'Quantity must be at least 1';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Submit form...
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Item Name"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          if (errors.name) setErrors({ ...errors, name: undefined });
        }}
        error={errors.name}
        placeholder="Enter item name"
        required
      />
      
      <Input
        label="Quantity"
        type="number"
        value={quantity}
        onChange={(e) => {
          setQuantity(e.target.value);
          if (errors.quantity) setErrors({ ...errors, quantity: undefined });
        }}
        error={errors.quantity}
        min={1}
        step={1}
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
- **Help Text**: Associated with input via `aria-describedby`
- **Focus**: Visible focus ring with proper contrast
- **Keyboard**: Full keyboard navigation support

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | - | Input label text |
| `helpText` | `string` | - | Help text displayed below input |
| `error` | `string` | - | Error message (sets validation state to error) |
| `success` | `string` | - | Success message (sets validation state to success) |
| `validationState` | `'default' \| 'success' \| 'error'` | `'default'` | Validation state (overridden by error/success) |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Input size |
| `required` | `boolean` | `false` | Whether field is required |
| `type` | `InputType` | `'text'` | Input type (text/number/email/password/tel/url) |
| `leftIcon` | `React.ReactNode` | - | Icon to display on the left |
| `rightIcon` | `React.ReactNode` | - | Icon to display on the right |
| `wrapperClassName` | `string` | - | Additional classes for wrapper div |
| `className` | `string` | - | Additional classes for input element |
| `...props` | `React.InputHTMLAttributes` | - | All standard input attributes |

## Common Patterns

### Controlled Input
```tsx
const [value, setValue] = useState('');
<Input value={value} onChange={(e) => setValue(e.target.value)} />
```

### Search Input
```tsx
<Input 
  leftIcon={<MagnifyingGlassIcon className="w-5 h-5" />}
  placeholder="Search..."
  type="text"
/>
```

### Password Input with Toggle
```tsx
const [showPassword, setShowPassword] = useState(false);
<Input 
  type={showPassword ? 'text' : 'password'}
  rightIcon={
    <button onClick={() => setShowPassword(!showPassword)}>
      {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
    </button>
  }
/>
```

### Number Input with Min/Max
```tsx
<Input 
  type="number"
  min={0}
  max={100}
  step={1}
  label="Quantity"
/>
```
