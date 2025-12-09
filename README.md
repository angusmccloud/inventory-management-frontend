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

### 2. Configure Environment (Optional)

The `.env.local` is already configured to connect to the local backend. The default configuration is:

```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

To change the API endpoint, create/edit `.env.local`:

```bash
# For local development (default)
NEXT_PUBLIC_API_URL=http://localhost:3001

# For deployed backend
# NEXT_PUBLIC_API_URL=https://your-api-gateway-url.amazonaws.com/dev
```

### 3. Start the Backend (Required)

The frontend requires the backend API to be running. Navigate to the backend directory and start it:

```bash
cd ../inventory-management-backend
./start-local.sh
```

Wait for the message: `Running on http://127.0.0.1:3001`

### 4. Run Development Server

In a new terminal, start the frontend:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Test the Application

1. **Create Account**: Click "Sign In / Create Account" and register
2. **Create Family**: Fill in your family name
3. **Add Inventory**: Navigate to "Inventory" and add items
4. **Adjust Quantities**: Use +/- buttons to track usage

### 6. Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### 7. Build for Production

```bash
npm run build
npm start
```

## Local Development Architecture

```
┌─────────────────────────────────┐
│  Browser                        │
│  http://localhost:3000          │
└────────────┬────────────────────┘
             │
             │ React/Next.js UI
             │
┌────────────▼────────────────────┐
│  Frontend (Next.js)             │
│  Port: 3000                     │
│  - Pages & Components           │
│  - API Client                   │
│  - Mock Authentication          │
└────────────┬────────────────────┘
             │
             │ HTTP Requests
             │ API calls to localhost:3001
             ▼
┌─────────────────────────────────┐
│  Backend (SAM Local)            │
│  Port: 3001                     │
│  - Lambda Functions             │
│  - Mock Authorizer              │
└────────────┬────────────────────┘
             │
             │ DynamoDB Calls
             ▼
┌─────────────────────────────────┐
│  DynamoDB Local (Docker)        │
│  Port: 8000                     │
│  - InventoryTable               │
└─────────────────────────────────┘
```

## Troubleshooting

### Cannot connect to backend API

**Error**: `Failed to fetch` or `Network error`

**Solution**:
1. Verify backend is running: `curl http://localhost:3001/health`
2. Check `.env.local` has correct `NEXT_PUBLIC_API_URL`
3. Ensure no CORS issues (backend CORS is set to allow all origins in dev)

### Authentication not working

**Issue**: Cannot create family or access protected routes

**Explanation**: We're using mock authentication for local development. Real Cognito authentication will be configured during deployment (Task T030).

**Current Behavior**: 
- Login accepts any email/password
- Creates a mock JWT token stored in localStorage
- All API requests use mock authorization

### Styles not loading

**Solution**:
```bash
rm -rf .next
npm run dev
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
