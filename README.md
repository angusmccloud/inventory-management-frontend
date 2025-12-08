# Family Inventory Management System - Frontend

Modern web application for family inventory management built with Next.js 15 (App Router), React 19, TypeScript, and Tailwind CSS.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5 (strict mode)
- **UI Library**: React 19
- **Styling**: Tailwind CSS
- **Testing**: Jest + React Testing Library
- **Validation**: Zod

## Prerequisites

- Node.js 20.x or higher
- npm or yarn

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy the environment template and fill in your values:

```bash
cp .env.example .env.local
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### 5. Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
inventory-management-frontend/
├── app/                 # Next.js App Router pages
│   ├── (auth)/         # Authentication pages
│   ├── dashboard/      # Dashboard and main features
│   ├── layout.tsx      # Root layout
│   ├── page.tsx        # Landing page
│   └── globals.css     # Global styles
├── components/         # React components
│   ├── family/        # Family-related components
│   ├── inventory/     # Inventory components
│   ├── shopping/      # Shopping list components
│   └── ui/            # Reusable UI components
├── lib/               # Utilities and helpers
│   ├── api/           # API client functions
│   └── validation/    # Zod schemas
├── types/             # TypeScript type definitions
├── public/            # Static assets
└── tests/             # Test files
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm test` - Run Jest tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate coverage report
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier
- `npm run type-check` - Check TypeScript types

## Features

### User Roles
- **Admin**: Full access to manage inventory, family members, and settings
- **Suggester**: View-only access with ability to submit suggestions

### Core Features
- Family inventory management
- Low-stock notifications
- Shopping list management
- Multi-user collaboration
- Role-based access control

## Testing

All components and utilities must have tests with 80% coverage:

```typescript
// Example test structure
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import InventoryList from './InventoryList';

describe('InventoryList', () => {
  it('should display inventory items', () => {
    const items = [{ id: '1', name: 'Item 1', quantity: 5 }];
    render(<InventoryList items={items} />);
    
    expect(screen.getByText('Item 1')).toBeInTheDocument();
  });
});
```

## Environment Variables

See `.env.example` for required environment variables. All public environment variables must be prefixed with `NEXT_PUBLIC_`.

## Code Style

- TypeScript strict mode enabled
- ESLint + Prettier for code formatting
- Tailwind CSS for styling
- Functional components with hooks
- Named exports preferred over default exports

## API Integration

API calls are made through the client functions in `lib/api/`:

```typescript
import { getInventoryItems } from '@/lib/api/inventory';

const items = await getInventoryItems(familyId);
```

## Contributing

1. Follow TypeScript strict mode guidelines
2. Write tests for all new features
3. Ensure all tests pass before committing
4. Use semantic commit messages
5. Keep components small and focused
