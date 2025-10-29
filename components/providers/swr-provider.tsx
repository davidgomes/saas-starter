'use client';

import { SWRConfig } from 'swr';

interface SWRProviderProps {
  children: React.ReactNode;
  fallback?: Record<string, unknown>;
}

export function SWRProvider({ children, fallback }: SWRProviderProps) {
  return (
    <SWRConfig
      value={{
        fallback: fallback || {}
      }}
    >
      {children}
    </SWRConfig>
  );
}
