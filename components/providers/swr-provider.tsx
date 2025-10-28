'use client';

import { ReactNode } from 'react';
import { SWRConfig } from 'swr';

interface SWRProviderProps {
  children: ReactNode;
  fallback?: Record<string, unknown>;
}

/**
 * SWRProvider component that provides global SWR configuration
 * with initial data from server-side queries
 */
export function SWRProvider({ children, fallback = {} }: SWRProviderProps) {
  return (
    <SWRConfig
      value={{
        fallback
      }}
    >
      {children}
    </SWRConfig>
  );
}
