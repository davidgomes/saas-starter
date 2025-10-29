'use client';

import { SWRConfig } from 'swr';

interface SWRProviderProps {
  children: React.ReactNode;
  fallback: {
    '/api/user': unknown;
    '/api/team': unknown;
  };
}

export function SWRProvider({ children, fallback }: SWRProviderProps) {
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
