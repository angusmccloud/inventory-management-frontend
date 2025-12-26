# PageHeader Component

Page title header with breadcrumbs, description, and action buttons for consistent page headers across the application.

## Features

- **Title & Description**: Main page heading with optional subtitle
- **Breadcrumb Navigation**: Optional breadcrumb trail
- **Primary Action**: CTA button aligned to the right
- **Secondary Actions**: Additional actions (e.g., icon buttons)
- **Responsive**: Adapts to different screen sizes
- **Dark Mode**: Full theme support

## Usage

### Simple Page Header

```tsx
import { PageHeader } from '@/components/common';

<PageHeader 
  title="Inventory"
  description="Manage your household items and supplies"
/>
```

### Page Header with Action

```tsx
import { Button } from '@/components/common';

<PageHeader 
  title="Shopping List"
  description="Items you need to purchase"
  action={
    <Button variant="primary" onClick={() => setShowAddForm(true)}>
      Add Item
    </Button>
  }
/>
```

### Page Header with Breadcrumbs

```tsx
<PageHeader 
  breadcrumbs={[
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Settings', href: '/dashboard/settings' },
    { label: 'Members' }, // Current page (no href)
  ]}
  title="Family Members"
  description="Manage your family members and their permissions"
/>
```

### Page Header with Secondary Actions

```tsx
import { Button, IconButton } from '@/components/common';
import { CogIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline';

<PageHeader 
  title="Inventory"
  action={
    <Button variant="primary" onClick={handleAddItem}>
      Add Item
    </Button>
  }
  secondaryActions={[
    <IconButton 
      icon={<CogIcon />} 
      aria-label="Settings" 
      onClick={handleSettings}
      key="settings"
    />,
    <IconButton 
      icon={<QuestionMarkCircleIcon />} 
      aria-label="Help" 
      onClick={handleHelp}
      key="help"
    />,
  ]}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | Required | Main page heading text |
| `description` | `string` | `undefined` | Optional description below title |
| `breadcrumbs` | `Breadcrumb[]` | `undefined` | Breadcrumb navigation items |
| `action` | `ReactNode` | `undefined` | Primary action button (top-right) |
| `secondaryActions` | `ReactNode[]` | `undefined` | Additional action buttons |
| `className` | `string` | `undefined` | Additional CSS classes |

### Breadcrumb Object

| Property | Type | Description |
|----------|------|-------------|
| `label` | `string` | Breadcrumb text |
| `href` | `string` | Link destination (optional, omit for current page) |

## Examples

### Dashboard Pages

```tsx
// Inventory Page
<PageHeader 
  title="Inventory"
  description={`${itemCount} items across ${locationCount} locations`}
  action={
    <Button variant="primary" onClick={() => setShowAddForm(true)}>
      Add Item
    </Button>
  }
/>

// Shopping List Page
<PageHeader 
  title="Shopping List"
  description={`${itemCount} items to purchase`}
  action={
    <Button variant="primary" onClick={handleAddItem}>
      Add Item
    </Button>
  }
  secondaryActions={[
    <Button variant="secondary" onClick={handleClearList} key="clear">
      Clear List
    </Button>
  ]}
/>

// Members Page
<PageHeader 
  title="Family Members"
  description={`${memberCount} active members`}
  action={
    <Button variant="primary" onClick={handleInvite}>
      Invite Member
    </Button>
  }
/>
```

### Settings Pages

```tsx
<PageHeader 
  breadcrumbs={[
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Settings' },
  ]}
  title="Family Settings"
  description="Configure your family inventory preferences"
/>
```

### Detail Pages

```tsx
<PageHeader 
  breadcrumbs={[
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Inventory', href: '/dashboard/inventory' },
    { label: item.name },
  ]}
  title={item.name}
  description={`Category: ${item.category} • Location: ${item.location}`}
  action={
    <Button variant="danger" onClick={handleDelete}>
      Delete Item
    </Button>
  }
  secondaryActions={[
    <Button variant="secondary" onClick={handleEdit} key="edit">
      Edit
    </Button>
  ]}
/>
```

### Admin Pages

```tsx
<PageHeader 
  breadcrumbs={[
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Settings', href: '/dashboard/settings' },
    { label: 'Reference Data' },
  ]}
  title="Reference Data"
  description="Manage categories, locations, and stores"
  action={
    <Button variant="primary" onClick={handleAddData}>
      Add Reference Data
    </Button>
  }
/>
```

## Breadcrumb Best Practices

1. **Start with Dashboard** - First breadcrumb should be Dashboard or Home
2. **Max 4 levels** - Keep breadcrumb trail short (Dashboard > Section > Page > Detail)
3. **Current page last** - Last breadcrumb is current page (no href)
4. **Mobile consideration** - Breadcrumbs may wrap or truncate on small screens
5. **Semantic HTML** - Uses `<nav>` with `aria-label="Breadcrumb"` and `<ol>` list

## Layout Guidelines

### Title Length
- **Ideal**: 1-5 words
- **Max**: Single line on desktop (wraps on mobile)
- **Consider**: Long titles may push actions to next line

### Description Length
- **Ideal**: 10-20 words
- **Max**: 2-3 lines
- **Use for**: Context, counts, status, or helpful hints

### Actions
- **Primary**: Main CTA (Add, Create, Invite, etc.)
- **Secondary**: Supporting actions (Settings, Help, Export, etc.)
- **Max**: 1 primary + 2-3 secondary actions

## Responsive Behavior

### Desktop (lg+)
- Title and actions on same line
- Breadcrumbs above title
- Description below title

### Tablet (md)
- Same as desktop
- Actions may wrap if too many

### Mobile (sm)
- Actions may stack vertically
- Title may wrap to multiple lines
- Breadcrumbs may truncate with ellipsis

## Accessibility

- Uses semantic `<h1>` for title via Text component
- Breadcrumbs use `<nav>` with proper `aria-label`
- Current breadcrumb has `aria-current="page"`
- Actions are keyboard accessible
- Sufficient color contrast

## Common Patterns

### Dynamic Description

```tsx
const description = loading 
  ? 'Loading...'
  : `${itemCount} items in inventory`;

<PageHeader title="Inventory" description={description} />
```

### Conditional Actions

```tsx
<PageHeader 
  title="Members"
  action={
    canInvite ? (
      <Button variant="primary" onClick={handleInvite}>
        Invite Member
      </Button>
    ) : null
  }
/>
```

### Multiple Action Buttons

```tsx
<PageHeader 
  title="Reports"
  secondaryActions={[
    <Button variant="secondary" onClick={handleExport} key="export">
      Export
    </Button>,
    <Button variant="secondary" onClick={handlePrint} key="print">
      Print
    </Button>
  ]}
  action={
    <Button variant="primary" onClick={handleGenerate}>
      Generate Report
    </Button>
  }
/>
```

## Related Components

- **Text**: Used for title and description
- **Link**: Used for breadcrumb links
- **Button**: Common for primary actions
- **IconButton**: Common for secondary actions

## Styling

### Custom Spacing

```tsx
<PageHeader 
  title="Inventory"
  className="mb-8" // Override default mb-6
/>
```

### Full Width Actions

```tsx
<div className="md:hidden">
  {/* Mobile: Full width button */}
  <Button className="w-full">Add Item</Button>
</div>
<div className="hidden md:block">
  {/* Desktop: Regular button */}
  <PageHeader 
    title="Inventory"
    action={<Button>Add Item</Button>}
  />
</div>
```
