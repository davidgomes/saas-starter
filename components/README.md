# Components

This directory contains reusable React components for the Next.js SaaS application.

## Layout Components

### `providers.tsx`
A wrapper component that provides all necessary context providers to the application:
- **ThemeProvider**: Manages dark/light/system theme switching
- **SWRConfig**: Configures SWR for data fetching with optimized settings

### `error-boundary.tsx`
A React error boundary component that catches JavaScript errors anywhere in the child component tree and displays a fallback UI instead of crashing the entire app.

## Theme Components

### `theme-provider.tsx`
A context provider for managing application themes with support for:
- Light mode
- Dark mode  
- System preference detection
- Local storage persistence
- Smooth theme transitions

### `theme-toggle.tsx`
A dropdown component for switching between theme modes with icons and accessibility features.

## UI Components

### `loading.tsx`
Reusable loading components with different sizes and optional text:
- `Loading`: Basic loading spinner with customizable size
- `PageLoading`: Full-page loading component

## Usage

### Basic Setup
```tsx
import { Providers } from '@/components/providers';
import { ErrorBoundary } from '@/components/error-boundary';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ErrorBoundary>
          <Providers>
            {children}
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}
```

### Theme Usage
```tsx
import { useTheme } from '@/components/theme-provider';
import { ThemeToggle } from '@/components/theme-toggle';

function MyComponent() {
  const { theme, setTheme } = useTheme();
  
  return (
    <div>
      <p>Current theme: {theme}</p>
      <ThemeToggle />
    </div>
  );
}
```

### Loading States
```tsx
import { Loading, PageLoading } from '@/components/loading';

function MyComponent() {
  return (
    <div>
      <Loading size="md" text="Loading data..." />
      <PageLoading />
    </div>
  );
}
```

## Features

- **TypeScript Support**: All components are fully typed
- **Accessibility**: ARIA labels and keyboard navigation support
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Theme Support**: Dark/light mode with system preference detection
- **Error Handling**: Graceful error boundaries with user-friendly fallbacks
- **Performance**: Optimized with proper memoization and lazy loading