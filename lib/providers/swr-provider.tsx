'use client';

import { SWRConfig } from 'swr';

interface SWRProviderProps {
  children: React.ReactNode;
  fallbackData?: Record<string, any>;
}

export function SWRProvider({ children, fallbackData = {} }: SWRProviderProps) {
  return (
    <SWRConfig
      value={{
        fallback: fallbackData,
        // Add error retry configuration
        errorRetryCount: 3,
        errorRetryInterval: 1000,
        // Add refresh configuration
        refreshInterval: 0, // Disable automatic refresh by default
        revalidateOnFocus: false,
        revalidateOnReconnect: true,
      }}
    >
      {children}
    </SWRConfig>
  );
}