# TabNavigation Component

Tab-based content switching with full keyboard navigation and ARIA support for accessible tab interfaces.

## Features

- **Keyboard Navigation**: Arrow keys, Home, End support
- **ARIA Attributes**: Proper roles, aria-selected, aria-controls
- **Icon Support**: Optional icons before tab labels
- **Badge Support**: Optional count badges after labels
- **Orientation**: Horizontal (default) or vertical layouts
- **Disabled State**: Individual tabs can be disabled
- **Dark Mode**: Full theme support

## Usage

### Basic Tab Navigation

```tsx
import { TabNavigation } from '@/components/common';
import { useState } from 'react';

const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'details', label: 'Details' },
  { id: 'history', label: 'History' },
];

const [activeTab, setActiveTab] = useState('overview');

<TabNavigation 
  tabs={tabs}
  activeTab={activeTab}
  onChange={setActiveTab}
/>
```

### Tabs with Icons

```tsx
import { 
  ArchiveBoxIcon, 
  ShoppingCartIcon, 
  UsersIcon 
} from '@heroicons/react/24/outline';

const tabs = [
  { 
    id: 'inventory', 
    label: 'Inventory',
    icon: <ArchiveBoxIcon />
  },
  { 
    id: 'shopping', 
    label: 'Shopping List',
    icon: <ShoppingCartIcon />
  },
  { 
    id: 'members', 
    label: 'Members',
    icon: <UsersIcon />
  },
];

<TabNavigation tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
```

### Tabs with Badges

```tsx
const tabs = [
  { id: 'all', label: 'All Items' },
  { id: 'low-stock', label: 'Low Stock', badge: 5 },
  { id: 'expired', label: 'Expired', badge: 2 },
];

<TabNavigation tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
```

### Tabs with Disabled State

```tsx
const tabs = [
  { id: 'general', label: 'General' },
  { id: 'premium', label: 'Premium Features', disabled: true },
  { id: 'advanced', label: 'Advanced' },
];

<TabNavigation tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
```

### Vertical Tabs

```tsx
<TabNavigation 
  tabs={settingsTabs}
  activeTab={activeSection}
  onChange={setActiveSection}
  orientation="vertical"
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tabs` | `Tab[]` | Required | Array of tab definitions |
| `activeTab` | `string` | Required | Currently active tab ID |
| `onChange` | `(tabId: string) => void` | Required | Tab change callback |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Tab layout direction |
| `className` | `string` | `undefined` | Additional CSS classes |

### Tab Object

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `id` | `string` | Required | Unique tab identifier |
| `label` | `string` | Required | Tab visible text |
| `icon` | `ReactNode` | `undefined` | Optional icon component |
| `disabled` | `boolean` | `false` | Disable tab interaction |
| `badge` | `number` | `undefined` | Optional count badge |

## Keyboard Navigation

### Horizontal Orientation
- **Arrow Right**: Move to next tab
- **Arrow Left**: Move to previous tab
- **Home**: Jump to first tab
- **End**: Jump to last tab
- **Tab**: Move focus out of tab list

### Vertical Orientation
- **Arrow Down**: Move to next tab
- **Arrow Up**: Move to previous tab
- **Home**: Jump to first tab
- **End**: Jump to last tab
- **Tab**: Move focus out of tab list

## Accessibility

- Uses `role="tablist"` on container
- Uses `role="tab"` on each tab button
- `aria-selected` indicates active tab
- `aria-controls` links tab to its panel
- `aria-orientation` indicates layout direction
- `tabIndex={0}` on active tab, `tabIndex={-1}` on inactive tabs
- Disabled tabs have `disabled` attribute
- Focus management: Active tab receives focus on arrow key navigation

## Tab Panel Pattern

Pair TabNavigation with tab panels:

```tsx
const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'settings', label: 'Settings' },
];

const [activeTab, setActiveTab] = useState('overview');

<div>
  <TabNavigation 
    tabs={tabs}
    activeTab={activeTab}
    onChange={setActiveTab}
  />
  
  {/* Tab Panels */}
  <div className="mt-4">
    {activeTab === 'overview' && (
      <div role="tabpanel" id="tabpanel-overview" aria-labelledby="tab-overview">
        {/* Overview content */}
      </div>
    )}
    {activeTab === 'settings' && (
      <div role="tabpanel" id="tabpanel-settings" aria-labelledby="tab-settings">
        {/* Settings content */}
      </div>
    )}
  </div>
</div>
```

## Examples

### Dashboard Navigation

```tsx
const dashboardTabs = [
  { 
    id: 'inventory', 
    label: 'Inventory',
    icon: <ArchiveBoxIcon />,
    badge: inventoryCount
  },
  { 
    id: 'shopping', 
    label: 'Shopping List',
    icon: <ShoppingCartIcon />,
    badge: shoppingItemCount
  },
  { 
    id: 'members', 
    label: 'Members',
    icon: <UsersIcon />
  },
];

<TabNavigation 
  tabs={dashboardTabs}
  activeTab={currentView}
  onChange={setCurrentView}
/>
```

### Settings Sidebar

```tsx
const settingsSections = [
  { id: 'profile', label: 'Profile' },
  { id: 'family', label: 'Family Settings' },
  { id: 'notifications', label: 'Notifications', badge: unreadCount },
  { id: 'billing', label: 'Billing', disabled: !isPremium },
];

<div className="flex gap-6">
  <aside className="w-48">
    <TabNavigation 
      tabs={settingsSections}
      activeTab={activeSection}
      onChange={setActiveSection}
      orientation="vertical"
    />
  </aside>
  
  <main className="flex-1">
    {/* Settings content */}
  </main>
</div>
```

### Inventory Filters

```tsx
const filterTabs = [
  { id: 'all', label: 'All Items' },
  { id: 'pantry', label: 'Pantry', badge: pantryCount },
  { id: 'fridge', label: 'Fridge', badge: fridgeCount },
  { id: 'freezer', label: 'Freezer', badge: freezerCount },
];

<div>
  <TabNavigation 
    tabs={filterTabs}
    activeTab={selectedLocation}
    onChange={setSelectedLocation}
  />
  
  <InventoryList items={filteredItems} />
</div>
```

## Best Practices

1. **Limit tab count** - 3-7 tabs ideal, consider dropdown for more
2. **Keep labels short** - 1-2 words per tab label
3. **Use consistent order** - Don't reorder tabs dynamically
4. **Provide visual feedback** - Clear indication of active tab
5. **Consider mobile** - Horizontal tabs may need scrolling on small screens
6. **Use badges wisely** - Only for counts or status indicators
7. **Disable sparingly** - Consider hiding instead of disabling
8. **Maintain tab state** - Remember active tab on page reload if appropriate

## Performance

- Uses `useRef` Map for efficient tab element storage
- Keyboard navigation doesn't cause re-renders
- Badge components only render when badge prop > 0

## Related Components

- **Badge**: Used for count indicators
- **Button**: Similar interaction patterns
- **Link**: Use Link component for navigation tabs instead

## Common Patterns

### URL Sync

Sync active tab with URL query params:

```tsx
'use client';

import { useSearchParams, useRouter } from 'next/navigation';

const searchParams = useSearchParams();
const router = useRouter();
const activeTab = searchParams.get('tab') || 'overview';

const handleTabChange = (tabId: string) => {
  const params = new URLSearchParams(searchParams);
  params.set('tab', tabId);
  router.push(`?${params.toString()}`);
};

<TabNavigation 
  tabs={tabs}
  activeTab={activeTab}
  onChange={handleTabChange}
/>
```

### Lazy Loading Tab Content

```tsx
<div>
  <TabNavigation tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
  
  <div className="mt-4">
    {activeTab === 'overview' && <OverviewPanel />}
    {activeTab === 'details' && <DetailsPanel />}
    {activeTab === 'history' && <HistoryPanel />}
  </div>
</div>
```
