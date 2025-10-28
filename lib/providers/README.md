# Providers

This directory contains React context providers and error boundaries used throughout the application.

## Files

### `swr-provider.tsx`
- **Purpose**: Provides SWR configuration for data fetching
- **Features**:
  - Pre-configured fallback data for `/api/user` and `/api/team`
  - Error retry configuration (3 retries with 1s interval)
  - Disabled automatic refresh by default
  - Revalidation on reconnect enabled

### `error-boundary.tsx`
- **Purpose**: Catches JavaScript errors anywhere in the component tree
- **Features**:
  - Custom error fallback UI
  - Error reset functionality
  - Development error details
  - Graceful error handling

### `index.ts`
- **Purpose**: Barrel export for all providers
- **Exports**: `SWRProvider`, `ErrorBoundary`

## Usage

```tsx
import { SWRProvider, ErrorBoundary } from '@/lib/providers';

// In your layout or app component
<ErrorBoundary>
  <SWRProvider>
    {children}
  </SWRProvider>
</ErrorBoundary>
```

## Error Boundary Customization

You can provide a custom fallback component:

```tsx
<ErrorBoundary fallback={CustomErrorFallback}>
  {children}
</ErrorBoundary>
```

The fallback component receives:
- `error`: The caught error object
- `resetError`: Function to reset the error state