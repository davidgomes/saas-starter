# Providers

This directory contains React context providers that are used throughout the application.

## Components

### SWRProvider
- **File**: `swr-provider.tsx`
- **Purpose**: Provides SWR configuration for data fetching
- **Features**: 
  - Pre-populates fallback data for user and team information
  - Prevents unnecessary API calls on initial load

### ThemeProvider
- **File**: `theme-provider.tsx`
- **Purpose**: Manages theme state (light/dark/system)
- **Features**:
  - System theme detection
  - Local storage persistence
  - Automatic theme switching based on system preferences

## Usage

These providers are automatically included in the root layout and don't need to be manually added to individual components.

## Error Boundary

The `ErrorBoundary` component is located in the parent `components` directory and provides error handling for the entire application.